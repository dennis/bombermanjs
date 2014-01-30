"use strict";

function SherryController(actor, game) {
	this.actor = actor;
	this.game = game;
	this.stop = false;
}

SherryController.prototype.execute = function() {
	var self = this;

	if(!this.actor.alive)
		return;

	if(this.stop)
		return;

	// go left - because that's what we do
	
	var action = new MoveAction(self.actor, 'left');

	if(!action.execute(this.game)) {
		(new ExplodeAction(self.actor)).execute(this.game);
		this.stop = true;
	}
};
