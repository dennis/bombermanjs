function KillActorAction(victimActor, perpetratorActor) {
	this.victim = victimActor;
	this.perpetrator = perpetratorActor;
}

KillActorAction.prototype.execute = function(level) {
	console.log("Smoked", this.victim);
	if(this.victim instanceof Bomb)
		(new ExplodeAction(this.victim)).execute(level);
	else
		level.actors.removeActor(this.victim);
};
