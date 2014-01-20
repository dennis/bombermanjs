// FIXME Remove non-protocol code
var Player = require('./player.js');

function Protocol(world) {
	this.world = world;
	this.directMessageQueue = {};
	this.broadcastQueue = [];
};

Protocol.prototype.directMessage = function(client, name, payload) {
	if(!this.directMessageQueue[client.socket.id])
		this.directMessageQueue[client.socket.id] = [];

	this.directMessageQueue[client.socket.id].push({name: name, payload: payload});
};

Protocol.prototype.broadcast = function(name, payload) {
	this.broadcastQueue.push({name: name, payload: payload});
}

Protocol.prototype.sendLevel = function(client) {
	this.directMessage(client, 'new-level', this.world.level.getJson() );
};

Protocol.prototype.sendAllActors = function(client) {
	var self = this;
	Object.keys(this.world.actors).forEach(function(actorName) {
		var actor = self.world.actors[actorName];

		self.directMessage(client, 'new-actor', actor.getCurrentState());
	});
};

Protocol.prototype.sendMessage = function(client, message) {
	this.directMessage(client, 'message', message);
};

Protocol.prototype.broadcastMessage = function(message) {
	this.broadcast('message', message);
};

Protocol.prototype.join = function(client) {
	var foundFreePlayer = false;

	var self = this;

	// find available player
	Object.keys(this.world.actors).some(function(actorName) {
		var actor = self.world.actors[actorName];

		if(actor instanceof Player) {
			var player = actor;
			if(!player.isOccupied()) {
				player.occupy();
				client.player = player;
				self.directMessage(client, "message", "you are " + actorName);
				self.broadcast('new-actor', { 
					id: player.name, 
					actor: player.name, 
					x: player.state.x, 
					y: player.state.y });
				foundFreePlayer = true;
				return true;
			}
			else {
				console.log(actorName + " is in use");
				return false;
			}
		}
	});

	return foundFreePlayer;
};

Protocol.prototype.leave = function(client) {
	this.removeActor(client.player.name);
	client.observe();				
	this.directMessage(client, "message", "you are now an observer");
};

Protocol.prototype.addActor = function(actor) {
	this.world.broadcast('new-actor', actor.getCurrentState());
}

Protocol.prototype.getAndClearDirectMessageQueue = function() {
	var queue = this.directMessageQueue;

	this.directMessageQueue = {};

	return queue;
}

Protocol.prototype.getAndClearBroadcastQueue = function() {
	var queue = this.broadcastQueue;

	this.broadcastQueue = [];

	return queue;
}

Protocol.prototype.removeActor = function(actorName) {
	this.broadcast('del-actor', { id: actorName });
};

module.exports = Protocol;

