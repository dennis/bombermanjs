"use strict";

function PlayerController(actor, game) {
	this.actor = actor;
	this.game = game;
	this.isMoving = false;
}

PlayerController.prototype.execute = function(inputManager) {
	var self = this;
	var action = null;
	var movement = false;

	if(!this.actor.alive)
		return;

	Object.keys(Point.DIRECTIONS).forEach(function(direction) {
		if(inputManager.KEY_STATUS[direction]) {
			movement = true;
			action = new MoveAction(self.actor, direction);
		}
	});

	if(action)
		action.execute(this.game);

	if(inputManager.KEY_RELEASED['space']) {
		(new SpawnBombAction(this.actor.pos, this.actor)).execute(this.game);
	}

	if(movement == false && this.isMoving) {
		(new StopAction(self.actor)).execute(this.game);
	}

	this.isMoving = movement;

	inputManager.resetReleasedKeys();
};
