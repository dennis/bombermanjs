function Protocol(client, world) {
	this.client = client;
	this.world = world;
};

Protocol.prototype.sendLevel = function() {
	this.world.sendMessage(this.client, 'new-level', this.world.level.getJson() );
};

Protocol.prototype.sendAllActors = function() {
	var self = this;
	Object.keys(this.world.players).forEach(function(actorName) {
		var player = self.world.players[actorName];
		self.world.sendMessage(self.client, 'new-actor', { id: player.name, actor: player.name });
	});
};

Protocol.prototype.sendMessage = function(message) {
	this.world.sendMessage(this.client, message);
};

Protocol.prototype.join = function() {
	var foundFreePlayer = false;

	var self = this;

	// find available player
	Object.keys(this.world.players).some(function(actorName) {
		var player = self.world.players[actorName];

		if(!player.isOccupied()) {
			player.occupy();
			self.client.player = player;
			self.world.sendMessage(self.client, "message", "you are " + actorName);
			self.world.broadcast('new-actor', { id: player.name, actor: player.name, x: player.state.x, y: player.state.y });
			foundFreePlayer = true;
			return true;
		}
		else {
			console.log(actorName + " is in use");
			return false;
		}
	});

	return foundFreePlayer;
};

Protocol.prototype.leave = function() {
	this.world.broadcast('del-actor', { id: this.client.player.name });
	this.client.observe();				
	this.world.sendMessage(this.client, "message", "you are now an observer");
};

module.exports = Protocol;

