var Level = require('./level.js')
	, CollisionEngine = require('./collision_engine.js')
	, ClientManager = require('./client_manager.js')
	;

function World(levelFile, broadcast, sendMessage) {
	this.broadcast = broadcast;
	this.sendMessage = sendMessage;
	this.levelMap = require(levelFile); // FIXME - should not be needed
	this.level = new Level(this.levelMap);
	this.collisionEngine = new CollisionEngine(this.level.getWidth(), this.level.getHeight());
	this.players = this.level.findPlayers();
	this.clientManager = new ClientManager();

	this.level.populateCollisionEngine(this.collisionEngine);

	// looking through map - find players
	console.log("Map got room for " + Object.keys(this.players).length + " players");

	var bombs = {};
	var lastBombId = 1;
	
	var self = this;

	var actorActions = function() {
		var update = [];
		Object.keys(self.players).forEach(function(actorName) {
			var player = self.players[actorName];
			
			if(player.isOccupied()) {
				action = player.act();

				if(action) {
					action.execute(player, self.level, self.collisionEngine, update);
				}
			}
		});

		if(update.length) {
			self.broadcast('actor-update', update);
		}
	};

	var actorActionsInterval = setInterval(actorActions, 1000/20);
};

World.prototype.newClient = function(socket) {
	var client = this.clientManager.newClient(socket, this.levelMap, this.players, this.broadcast, this.sendMessage);
	client.state.connecting(client);

	return client;
}

World.prototype.clientDoneLoadingLevel = function(client) {
	client.state.doneLoadingLevel(client);
}

World.prototype.clientJoin = function(client) {
	client.state.join(client);
}

World.prototype.clientLeave = function(client) {
	client.state.leave(client);
}

World.prototype.clientActorAction = function(client, direction) {
	if(client.player) {
		client.player.requestedAction = direction;
	}
}

World.prototype.removeClient = function(client) {
	this.clientManager.removeClient(client);
}

module.exports = World;

