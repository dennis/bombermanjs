var server_port = 8888;
var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server)
	, fs = require('fs');

// Local requires
var ActorState = require(__dirname + '/../public/js/actor_state.js')
	, Player = require('./player.js')
	, Bomb = require('./bomb.js')
	, Point = require('./point.js')
	, CollisionEngine = require('./collision_engine.js')
	, Client = require('./client.js')
	, ClientManager = require('./client_manager.js')
	, Level = require('./level.js')
	, MoveAction = require('./move_action.js')
	, SpawnBombAction = require('./spawn_bomb_action.js');

server.listen(server_port);
app.use(express.static(__dirname + '/../public'));
app.use(express.logger());

console.log("Server running on port " + server_port);
console.log("Serving " + __dirname + '/../public');

var levelMap = require(__dirname + '/../levels/level.json');
var level = new Level(levelMap);
var collisionEngine = new CollisionEngine(level.getWidth(), level.getHeight());
var players = level.findPlayers();
level.populateCollisionEngine(collisionEngine);

// looking through map - find players
console.log("Map got room for " + Object.keys(players).length + " players");

var clientManager = new ClientManager();
var bombs = {};
var lastBombId = 1;

var actorActions = function() {
	var update = [];
	Object.keys(players).forEach(function(actorName) {
		var player = players[actorName];
		
		if(player.isOccupied()) {
			action = player.act();

			if(action) {
				action.execute(player, level, collisionEngine, update);
			}
		}
	});

	if(update.length) {
		io.sockets.emit('actor-update', update);
	}
};

var actorActionsInterval = setInterval(actorActions, 1000/20);

io.sockets.on('connection', function(socket) {
	// FIXME Client shouldnt require this knowledge
	var client = clientManager.newClient(socket, levelMap, players, io);

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

