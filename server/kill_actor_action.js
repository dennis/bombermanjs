var RespawnActorAction = require('./respawn_actor_action.js');

function KillActorAction(victimActor, perpetratorActor) {
	this.victimActor = victimActor;
	this.perpetratorActor = perpetratorActor;
};

KillActorAction.prototype.execute = function(actor, world) {
	if(this.victimActor.kill && this.victimActor.kill()) {
		world.protocol.broadcastMessage(this.victimActor.id + " got killed");

		world.broadcast("actor-update", {
			actor: this.victimActor.name,
			state: this.victimActor.state
		});

		return new RespawnActorAction(this.victimActor);
	}
};

module.exports = KillActorAction;

