"use strict";

function PlayerController(actor, level) {
	this.actor = actor;
	this.level = level;
}

PlayerController.prototype.handleInput = function(inputManager) {
	var self = this;
	var action = null;
	Object.keys(Point.DIRECTIONS).forEach(function(direction) {
		if(inputManager.KEY_STATUS[direction]) {
			action = new MoveAction(self.actor, direction);
		}
	});

	if(action)
		action.execute(this.level);
};
