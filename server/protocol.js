function Protocol(world) {
	this.world = world;
};

Protocol.prototype.sendLevel = function(client) {
	this.world.sendMessage(client, 'new-level', this.world.level.getJson() );
};

Protocol.prototype.sendAllActors = function(client) {
	var self = this;
	Object.keys(this.world.players).forEach(function(actorName) {
		var player = self.world.players[actorName];
		self.world.sendMessage(client, 'new-actor', { id: player.name, actor: player.name });
	});
};

Protocol.prototype.sendMessage = function(client, message) {
	this.world.sendMessage(client, message);
};

Protocol.prototype.join = function(client) {
	var foundFreePlayer = false;

	var self = this;

	// find available player
	Object.keys(this.world.players).some(function(actorName) {
		var player = self.world.players[actorName];

		if(!player.isOccupied()) {
			player.occupy();
			client.player = player;
			self.world.sendMessage(client, "message", "you are " + actorName);
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

Protocol.prototype.leave = function(client) {
	this.world.broadcast('del-actor', { id: client.player.name });
	client.observe();				
	this.world.sendMessage(client, "message", "you are now an observer");
};

Protocol.prototype.dropBombAt = function(bomb) {
	this.world.broadcast('new-actor', { 
		id: bomb.getId(), 
		actor: 'bomb', 
		x: bomb.getX(), 
		y: bomb.getY() });
}

module.exports = Protocol;

