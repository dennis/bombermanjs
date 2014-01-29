function StopAction(actor) {
	this.actor = actor;
}

StopAction.prototype.execute = function(game) {
	this.actor.direction = null;
};
