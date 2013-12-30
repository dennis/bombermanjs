function Actor(name, tileNum) {
	this.name = name;
	this.tileNum = tileNum;
	this.state = new ActorState();
	this.newState = new ActorState();
};
Actor.prototype.draw = function(context, tileSet) {
	if(!this.state.differentTo(this.newState))
		return;

	if(this.state.visible)
		tileSet.clear(context, this.state.x, this.state.y);

	this.state.update(this.newState);

	if(this.newState.visible) {
		tileSet.draw(context, this.newState.x, this.newState.y, this.tileNum);
	}
}
Actor.prototype.update = function(data) {
	this.newState = data.state;
}

