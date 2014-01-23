"use strict";

function PlayerController(player, level) {
	this.player = player;
	this.level = level;
}

PlayerController.prototype.handleInput = function(inputManager) {
	var self = this;
	var action = null;
	Object.keys(Point.DIRECTIONS).forEach(function(direction) {
		if(inputManager.KEY_STATUS[direction]) {
			action = new MoveAction(self.player, direction);
		}
	});

	if(action)
		action.execute(this.level);
};
