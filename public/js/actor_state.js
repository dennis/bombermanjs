// ActorState
function ActorState() { 
	this.visible = false;
	this.x = 0;
	this.y = 0;
};
ActorState.prototype.update = function(newState) {
	this.visible = newState.visible;
	this.x = newState.x;
	this.y = newState.y;
}
ActorState.prototype.differentTo = function(otherState) {
	return !(this.visible == otherState.visible && this.x == otherState.x && this.y == otherState.y);
}

if(typeof module == "object") {
	module.exports = ActorState;
}
