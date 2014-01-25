function KillActorAction(victimActor, perpetratorActor) {
	this.victim = victimActor;
	this.perpetrator = perpetratorActor;
}

KillActorAction.prototype.execute = function(level) {
	console.log("Smoked", this.victim);
	level.actors.removeActor(this.victim);
};
