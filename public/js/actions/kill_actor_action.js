function KillActorAction(victimActor, perpetratorActor) {
	this.victim = victimActor;
	this.perpetrator = perpetratorActor;
}

KillActorAction.prototype.execute = function(game) {
	if(this.victim.killed) {
		this.victim.killed(game);
	}
};
