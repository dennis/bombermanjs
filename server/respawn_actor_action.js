function RespawnActorAction(actor) {
	this.age = 0;
	this.actor = actor;
};

RespawnActorAction.prototype.execute = function(actor, world) {
	this.age++;
	
	if(this.age == 50) {
		this.actor.awaken();

		world.broadcast("actor-update", {
			actor: this.actor.name,
			state: this.actor.state
		});
	}
	else {
		if(this.actor.setAction)
			this.actor.setAction(this);
	}
};

module.exports = RespawnActorAction;

