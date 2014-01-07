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
	, Level = require('./level.js');

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
				x = (level.getWidth()-1)*level.getTileWidth();
			if(x > (level.getWidth()-1)*level.getTileWidth())
				x = 0;
			if(y < 0)
				y = (level.getHeight()-1)*level.getTileHeight();
			if(y > (level.getHeight()-1)*level.getTileHeight())
				y = 0;

			player.requestedAction = null;


			var lowX = Math.floor(x / level.getTileWidth());
			var lowY = Math.floor(y / level.getTileHeight());
			var highX = Math.ceil(x / level.getTileWidth());
			var highY = Math.ceil(y / level.getTileHeight());

			var collision = false;
			[lowX,highX].forEach(function(x) {
				[lowY, highY].forEach(function(y) {
					if(collisionEngine.isBlocked(new Point(x, y))) {
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

