// ActorState
function ActorState() { 
	this.direction = 'down';
	this.alive = false;
	this.x = 0;
	this.y = 0;
};

ActorState.prototype.update = function(newState) {
	this.direction = newState.direction;
	this.alive = newState.alive;
	this.x = newState.x;
	this.y = newState.y;
}

ActorState.prototype.differentTo = function(otherState) {
	return !(this.alive == otherState.alive && this.x == otherState.x && this.y == otherState.y && this.direction == otherState.direction);
}

if(typeof module == "object") {
	module.exports = ActorState;
}
