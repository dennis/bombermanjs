function Actor(name, tileNum) {
	this.name = name;
	this.tileNum = tileNum;
	this.state = new ActorState();
	this.newState = new ActorState();
	this.realX = null;
	this.realY = null;
};
Actor.prototype.draw = function(context, tileSet, interpolation) {
	if(this.realX != null && this.realY != null) {
		tileSet.clear(context, this.realX, this.realY);
	}
	else {
		this.realX = this.state.x;
		this.realY = this.state.y;
	}

	this.realX = this.newState.x - Math.floor((this.newState.x - this.state.x) * interpolation);
	this.realY = this.newState.y - Math.floor((this.newState.y - this.state.y) * interpolation);

	tileSet.draw(context, this.realX, this.realY, this.tileNum);
}

Actor.prototype.logic = function() {
	this.realX = this.state.x;
	this.realY = this.state.y;
	this.state.update(this.newState);
}
Actor.prototype.update = function(data) {
	this.newState = data.state;
}

