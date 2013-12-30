var server_port = 8888;
var app = require('express')()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server)
	, fs = require('fs')

server.listen(server_port);

console.log("Server running on port " + server_port);

var level = require(__dirname + '/../assets/levels/level.json');

app.get('/', function(req, res) {
	res.sendfile(__dirname + '/index.html');
});
app.get('/img/bomb_party_v4.png', function(req, res) {
	res.sendfile(__dirname + '/img/bomb_party_v4.png');
});

var players = {};
var playerKeys = [];
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

				players[type] = {connected: false, x: x, y: y, visible: false, move: null};
				playerKeys.push(type);
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

console.log("Map got room for " + playerKeys.length + " players");

io.sockets.on('connection', function (socket) {
	// find available player
	for(var i = 0; i < playerKeys.length; i++) {
		var player = players[playerKeys[i]];
		if(!player.connected) {
			player.connected = true;
			player.move = 'noop';
			player.visible = true;
			player.socketId = socket.id;
			playerIdx[socket.id] = playerKeys[i];
			console.log(playerKeys[i] + " is " + socket.id);
			socket.emit("message", "you are " + playerKeys[i]);
			break;
		}
	}

	var actorActions = setInterval(function() {
		var update = [];
		for(var i = 0; i < playerKeys.length; i++) {
			var player = players[playerKeys[i]];
			if(player.connected) {
				player.visible = true;

				var x = player.x;
				var y = player.y;

				switch(player.move) {
					case 'up': y--; break;
					case 'down': y++; break;
					case 'left': x--; break;
					case 'right': x++; break;
				}
				
				// boundary check
				if(x < 0)
					x = level.width-1;
				if(x > level.width-1)
					x = 0;
				if(y < 0)
					y = level.height-1;
				if(y > level.height-1)
					y = 0;

				player.move = null;

				if(blockedTiles[x][y]) {
					return;
				}

				player.x = x;
				player.y = y;

				update.push({
					actor: playerKeys[i],
					visible: player.visible,
					x: player.x,
					y: player.y
				});
			}
		}

		io.sockets.emit('actor-update', update);
	}, 1000/3);

	socket.emit('new-level', level );
	socket.on('actor-action', function (direction) {
		var player = players[playerIdx[socket.store.id]];
		if(player) {
			player.move = direction;
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
		players[playerIdx[socket.store.id]].connected = false;
		delete playerIdx[socket.store.id];
	});
});

