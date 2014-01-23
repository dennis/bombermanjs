"use strict";

function PlayerController(actor, level) {
	this.actor = actor;
	this.level = level;
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

	if(movement == false) {
		(new StopAction(self.actor)).execute(this.level);
	}


	if(action)
		action.execute(this.level);
};
