"use strict";

function PlayerController(actor, level) {
	this.actor = actor;
	this.level = level;
	this.isMoving = false;
}

PlayerController.prototype.handleInput = function(inputManager) {
	var self = this;
	var action = null;
	var movement = false;
	Object.keys(Point.DIRECTIONS).forEach(function(direction) {
		if(inputManager.KEY_STATUS[direction]) {
			movement = true;
			action = new MoveAction(self.actor, direction);
		}
	});

	if(action)
		action.execute(this.level);

	if(inputManager.KEY_STATUS['space']) {
		(new SpawnBombAction(this.actor.pos, this.actor)).execute(this.level);
	}

	if(movement == false && this.isMoving) {
		(new StopAction(self.actor)).execute(this.level);
	}

	this.isMoving = movement;
};
