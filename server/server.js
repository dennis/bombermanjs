var server_port = 8888;
var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server)
	, fs = require('fs')

ActorState = require(__dirname + '/../public/js/actor_state.js');

server.listen(server_port);
app.use(express.static(__dirname + '/../public'));
app.use(express.logger());

console.log("Server running on port " + server_port);
console.log("Serving " + __dirname + '/../public');

var level = require(__dirname + '/../levels/level.json');

// fix image
level.tilesets[0].image = level.tilesets[0].image.substring(9); // strip "../public/

var players = {};
var playerIdx = {};
var blockedTiles = [];

// initialize blockedTiles
for(var x = 0; x < level.width; x++) {
	blockedTiles.push([]);
	for(var y = 0; y < level.height; y++) {
		blockedTiles[x].push([]);
	}
}
for(var x = 0; x < level.width; x++) {
	for(var y = 0; y < level.height; y++) {
		blockedTiles[x][y] = false;
	}
}

// looking through map - find players
for(var i = 0; i < level.layers.length; i++) {
	var layer = level.layers[i];
	if(layer.type == "tilelayer" && layer.properties && layer.properties.type == "spawn") {
		for(var j = 0; j < layer.data.length; j++) {
			if(layer.data[j] != "0") {
				var type = level.tilesets[0].tileproperties[layer.data[j]-1].type;

				var x = j % level.width;
				var y = (j-x) / level.width;

				var state = new ActorState();
				state.x = x * level.tilewidth;
				state.y = y * level.tileheight;

				players[type] = {
					connected: false, 
					requestedAction: null,
					socketId: null,
					state: state
				};
			}
		}
	}

	// build blockedTiles map
	if(layer.type == "tilelayer" && layer.properties && layer.properties.type == "blocking") {
		for(var j = 0; j < layer.data.length; j++) {
			if(layer.data[j] != 0) { 
				var x = j % level.width;
				var y = (j-x) / level.width;

				blockedTiles[x][y] = true;
			}
		}
	}
}

console.log("Map got room for " + Object.keys(players).length + " players");

io.sockets.on('connection', function (socket) {
	// find available player
	Object.keys(players).some(function(actorName) {
		var player = players[actorName];
		if(!player.connected) {
			player.connected = true;
			player.requestedAction = 'noop';
			player.state.visible = true;
			player.socketId = socket.id;
			playerIdx[socket.id] = actorName;
			console.log(actorName + " is " + socket.id);
			socket.emit("message", "you are " + actorName);
			return true;
		}
		else {
			console.log(actorName + " is in use");
			return false;
		}
	});

	var actorActions = function() {
		var update = [];
		Object.keys(players).forEach(function(actorName) {
			var player = players[actorName];
			if(player.connected && player.requestedAction) {
				player.state.visible = true;

				var x = player.state.x;
				var y = player.state.y;
				var step = 8;

				switch(player.requestedAction) {
					case 'up': y -= step; break;
					case 'down': y += step; break;
					case 'left': x -= step; break;
					case 'right': x += step; break;
					case 'space': console.log("NOT SUPPORTED"); break;
				}
				
				// boundary check
				if(x < 0)
					x = (level.width-1)*level.tilewidth;
				if(x > (level.width-1)*level.tilewidth)
					x = 0;
				if(y < 0)
					y = (level.height-1)*level.tileheight;
				if(y > (level.height-1)*level.tileheight)
					y = 0;

				player.requestedAction = null;

				var lowX = Math.floor(x / level.tilewidth);
				var lowY = Math.floor(y / level.tileheight);
				var highX = Math.ceil(x / level.tilewidth);
				var highY = Math.ceil(y / level.tileheight);
				
				// very very crude collision detection - needs work
				var collision = false;
				[lowX,highX].forEach(function(x) {
					[lowY, highY].forEach(function(y) {
						if(blockedTiles[x][y]) {
							collision = true;
						}
					});
				});

				if(collision) {
					return;
				}

				player.state.x = x;
				player.state.y = y;

				update.push({
					actor: actorName,
					state: player.state
				});
			}
		});

		if(update.length)
			io.sockets.emit('actor-update', update);
	};

	var actorActionsInterval = setInterval(actorActions, 1000/20);

	socket.emit('new-level', level );
	socket.on('actor-action', function (direction) {
		var player = players[playerIdx[socket.store.id]];
		if(player) {
			player.requestedAction = direction;
		}
		else {
			console.log("Can't find player!", socket.store.id);
			console.log("-------------------------------");
			console.log(" players", players);
			console.log(" playerIdx", playerIdx);
			console.log("-------------------------------");
		}
	});
	socket.on('disconnect', function() {
		if(playerIdx[socket.store.id]) {
			players[playerIdx[socket.store.id]].connected = false;
			delete playerIdx[socket.store.id];
		}
	});
});

