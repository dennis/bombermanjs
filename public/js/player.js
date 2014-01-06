function Player(name, kind) {
	this.name = name;
	this.kind = kind;
	this.state = new ActorState();
	this.newState = new ActorState();
	this.realX = null;
	this.realY = null;
	this.lastSeenWalking = 0;

	console.log("Created actor", name, kind);
};
Player.prototype = new Actor();
Player.prototype.draw = function(context, tileSet, interpolation, ticks) {
	if(this.realX == null && this.realY == null) {
		this.realX = this.state.x;
		this.realY = this.state.y;
		this.newState = this.state;
	}

	if(!this.newState.visible)
		return;

	var distX = this.newState.x - this.state.x;
	var distY = this.newState.y - this.state.y;

	this.realX = this.newState.x - Math.floor(distX * interpolation);
	this.realY = this.newState.y - Math.floor(distY * interpolation);

	var direction = this.newState.direction;

	if(distX == 0 && distY == 0) {
		;
	}
	else {
		this.lastSeenWalking = ticks;
	}
	//if(this.newState.x != this.state.x || this.newState.y != this.state.y)
		//direction = 'walk-' + direction;

	if(ticks - this.lastSeenWalking < 250)
		direction = 'walk-' + direction;
	tile = this.kind.get(direction, ticks);

	tileSet.draw(context, this.realX, this.realY, tile);
}

Player.prototype.logic = function() {
	this.realX = this.state.x;
	this.realY = this.state.y;
	this.state.update(this.newState);
}
Player.prototype.update = function(data) {
	this.newState = data.state;
}
