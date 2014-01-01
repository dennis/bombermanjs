function Actor(name, kind) {
	this.name = name;
	this.kind = kind;
	this.state = new ActorState();
	this.newState = new ActorState();
	this.realX = null;
	this.realY = null;
	this.logic_counter = 0;

	console.log("Created actor", name, kind);
};
Actor.prototype.draw = function(context, tileSet, interpolation) {
	if(this.realX != null && this.realY != null) {
		tileSet.clear(context, this.realX, this.realY);
	}
	else {
		this.realX = this.state.x;
		this.realY = this.state.y;
	}

	if(!this.newState.visible)
		return;

	this.realX = this.newState.x - Math.floor((this.newState.x - this.state.x) * interpolation);
	this.realY = this.newState.y - Math.floor((this.newState.y - this.state.y) * interpolation);

	var tile = this.kind.subtypes.down[0]; // default

	var direction = this.newState.direction;

	if(this.newState.x != this.state.x || this.newState.y != this.state.y)
		direction = 'walk-' + direction;

	if(this.kind.subtypes[direction] !== undefined) {
		var frameCount = this.kind.subtypes[direction].length;
		tile = this.kind.subtypes[direction][parseInt(this.logic_counter/2) % this.kind.subtypes[direction].length];
	}

	tileSet.draw(context, this.realX, this.realY, tile);
}

Actor.prototype.logic = function() {
	this.logic_counter++;
	this.realX = this.state.x;
	this.realY = this.state.y;
	this.state.update(this.newState);
}
Actor.prototype.update = function(data) {
	this.newState = data.state;
}

