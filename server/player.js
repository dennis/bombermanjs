function Player(name, x, y) {
	this.name = name;
	this.state = new ActorState();
	this.requestedAction = null;
	this.state.visible = true;
	this.occupied = false;
	this.initialX = x;
	this.initialY = y;
};
Player.prototype.reset = function() {
	this.requestedAction = null;
	this.state = new ActorState();
	this.state.visible = true;
	this.occupied = false;
};
Player.prototype.isOccupied = function() {
	return this.occupied;
};
Player.prototype.occupy = function() {
	this.occupied = true;
	this.requestedAction = "noop";
	this.state.x = this.initialX;
	this.state.y = this.initialY;
}
Player.prototype.isDirty = function() {
	return this.occupied && this.requestedAction != null;
}

module.exports = Player;
