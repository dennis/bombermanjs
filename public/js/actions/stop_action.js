function StopAction(actor) {
	this.actor = actor;
}

StopAction.prototype.execute = function(level) {
	this.actor.direction = null;
};
