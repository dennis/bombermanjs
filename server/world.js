var Level = require('./level.js')
	, CollisionEngine = require('./collision_engine.js')
	, ClientManager = require('./client_manager.js')
	, Protocol = require('./protocol.js')
	, Bomb = require('./bomb.js')
	;

function World(levelFile, broadcast, sendMessage) {
	this.broadcast = broadcast;
	this.sendMessage = sendMessage;
	this.level = new Level(require(levelFile));
	this.collisionEngine = new CollisionEngine(this.level.getWidth(), this.level.getHeight());
	this.actors = this.level.findPlayers();
	this.clientManager = new ClientManager();
	this.protocol = new Protocol(this);
	this.sockets = {};

	this.level.populateCollisionEngine(this.collisionEngine);

	console.log("Map got room for " + Object.keys(this.actors).length + " players");

	var self = this;

	var actorActions = function() {
		Object.keys(self.actors).forEach(function(actorName) {
			var actor = self.actors[actorName];
			
			action = actor.act();

			if(action) {
				action.execute(actor, self);
			}
		});

		var protocol = self.protocol;

		// Handle direct messages
		var dmQueue = protocol.getAndClearDirectMessageQueue();
		Object.keys(dmQueue).forEach(function(socketId) {
			var v = dmQueue[socketId];

			v.forEach(function(e) {
				self.sendMessage(self.sockets[socketId], e.name, e.payload);
			});
		});

		// handle broadcasts
		var bQueue = protocol.getAndClearBroadcastQueue();
		bQueue.forEach(function(e) {
			self.broadcast(e.name, e.payload);
		});
	};

	var actorActionsInterval = setInterval(actorActions, 1000/10);
};

World.prototype.newClient = function(socket) {
	var client = this.clientManager.newClient(socket, this);
	this.sockets[client.socket.id] = socket;
	client.state.connecting();

	return client;
};

World.prototype.clientDoneLoadingLevel = function(client) {
	client.state.doneLoadingLevel();
};

World.prototype.clientJoin = function(client) {
	client.state.join();
};

World.prototype.clientLeave = function(client) {
	client.state.leave();
};

World.prototype.clientActorAction = function(client, direction) {
	if(client.player) {
		client.player.requestedAction = direction;
	}
};

World.prototype.removeClient = function(client) {
	this.clientManager.removeClient(client);
};

World.prototype.dropBombAt = function(player, x, y) {
	var bomb = new Bomb(player, x, y);

	player.addBomb(bomb);

	this.actors[bomb.getId()] = bomb;

	this.protocol.dropBombAt(bomb);
};

World.prototype.removeBomb = function(bomb) {
	delete this.actors[bomb.getId()];

	bomb.getOwner().removeBomb(bomb);

	this.protocol.removeActor(bomb.getId());
};

module.exports = World;

