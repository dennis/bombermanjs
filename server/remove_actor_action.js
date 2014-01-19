function RemoveActorAction() {};

RemoveActorAction.prototype.execute = function(actor, world) {
	world.removeActor(actor);
}

module.exports = RemoveActorAction;

