var ActorState = require(__dirname + '/../public/js/actor_state.js'),
	MoveAction = require('./move_action.js'),
	SpawnBombAction = require('./spawn_bomb_action.js');

function Player(name, x, y) {;
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
Player.prototype.act = function() {
	var action = undefined;

	if(this.isDirty()) {
		if(this.requestedAction == 'space') {
			action = new SpawnBombAction(this.state.x, this.state.y);
		}
		else if(this.requestedAction != 'noop')  {
			this.state.direction = this.requestedAction;
			action = new MoveAction(this.state.direction);
		}

		this.requestedAction = null;
	}

	return action;
};

module.exports = Player;
