var server_port = 8888;
var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server)
	, fs = require('fs')
	, Stately = require('stately.js')
	, Player = require('./player.js');

ActorState = require(__dirname + '/../public/js/actor_state.js');

server.listen(server_port);
app.use(express.static(__dirname + '/../public'));
app.use(express.logger());

console.log("Server running on port " + server_port);
console.log("Serving " + __dirname + '/../public');

var level = require(__dirname + '/../levels/level.json');

// fix image
level.tilesets[0].image = level.tilesets[0].image.substring(9); // strip "../public/

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

var players = {};
var playerIdx = {};
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

				players[type] = new Player(type, state.x, state.y);
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

function Client(socket) {
	this.player = null;
	this.socket = socket;

	this.state = Stately.machine(
		{	
			'PRECONNECT': {
				'connecting': function(client) {
						client.socket.emit('new-level', level );
					return this.CONNECTED;
				}
			},
			'CONNECTED': {
				'doneLoadingLevel': function(client) {
					Object.keys(players).forEach(function(actorName) {
						var player = players[actorName];
						client.socket.emit('new-actor', { id: player.name, actor: player.name });
					});
					client.socket.emit('observing' );
					return this.OBSERVING;
				}
			},
			'OBSERVING': {
				'join': function(client) {
					var foundFreePlayer = false;

					// find available player
					Object.keys(players).some(function(actorName) {
						var player = players[actorName];

						if(!player.isOccupied()) {
							player.occupy();
							client.player = player;
							client.socket.emit("message", "you are " + actorName);
							io.sockets.emit('new-actor', { id: player.name, actor: player.name, x: player.state.x, y: player.state.y });
							foundFreePlayer = true;
							return true;
						}
						else {
							console.log(actorName + " is in use");
							return false;
						}
					});

					if(foundFreePlayer)
						return this.PLAYING;
					else
						return this.OBSERVING;
				}
			},
			'PLAYING': {
				'leave': function(client) {
					io.sockets.emit('del-actor', { id: client.player.name });
					client.observe();				
					client.socket.emit("message", "you are now an observer");
					return this.OBSERVING;
				}
			}
		}, 
		'PRECONNECT'
	);
	this.state.bind(function(event, oldState, newState) {
		console.log("State change: ", event, oldState, newState);
	});

	//this.state = clone(ClientState);
}
Client.prototype.isObserver = function() {
	this.observer == null;
}
Client.prototype.isPlayer = function() {
	this.observer != null;
}
Client.prototype.observe = function() {
	this.player.reset();
	this.player = null;
}

function ClientManager() {
	this.clients = {};
};
ClientManager.prototype.newClient = function(socket) {
	return this.clients[socket.id] = new Client(socket);
}
ClientManager.prototype.removeClient = function(socket) {
	if(this.clients[socket.id].player)
		this.clients[socket.id].player.reset();
	delete this.clients[socket.id];
}
ClientManager.prototype.getClient = function(socket) {
	return this.clients[socket.id];
}

var clientManager = new ClientManager();
var bombs = {};
var lastBombId = 1;

function Bomb(id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
}
Bomb.prototype.getId = function() {
	return this.id;
}
Bomb.prototype.getX = function() {
	return this.x;
}
Bomb.prototype.getY = function() {
	return this.y;
}

var actorActions = function() {
	var update = [];
	Object.keys(players).forEach(function(actorName) {
		var player = players[actorName];
		if(player.isDirty()) {
			player.state.visible = true;

			var x = player.state.x;
			var y = player.state.y;
			var step = 8;

			switch(player.requestedAction) {
				case 'up': y -= step; break;
				case 'down': y += step; break;
				case 'left': x -= step; break;
				case 'right': x += step; break;
				case 'space': 
					var bomb = new Bomb(lastBombId++, player.state.x, player.state.y);
					bombs[bomb.getId()] = bomb;

					io.sockets.emit('new-actor', { 
						id: bomb.getId(), 
						actor: 'bomb', 
						x: bomb.getX(), 
						y: bomb.getY() });
				break;
			}

			if(player.requestedAction != 'space' && player.requestedAction != 'noop') 
				player.state.direction = player.requestedAction;
			
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
				console.log("Collision!");
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

	if(update.length) {
		io.sockets.emit('actor-update', update);
	}
};

var actorActionsInterval = setInterval(actorActions, 1000/20);

io.sockets.on('connection', function(socket) {
	var client = clientManager.newClient(socket);

	client.state.connecting(client);

	socket.on('new-level-done', function() {
		client.state.doneLoadingLevel(client);
	});

	socket.on('join', function() {
		client.state.join(client);
	});
	socket.on('leave', function() {
		client.state.leave(client);
	});

	socket.on('actor-action', function (direction) {
		var client = clientManager.getClient(socket);
		if(client && client.player) {
			client.player.requestedAction = direction;
		}
	});

	socket.on('disconnect', function() {
		clientManager.removeClient(socket);
	});
});

