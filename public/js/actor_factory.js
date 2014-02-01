function ActorFactory(game) {
	this.game = game;
	this.constructors = {};
}

ActorFactory.actorConstructors = {};

// Constructors of actors are expected to accept: kind and pos
ActorFactory.register = function(name, constructor) {
	ActorFactory.actorConstructors[name] = constructor;

	console.log('Registered actor', name);
};

ActorFactory.prototype.new = function(name, pos) {
	if(!ActorFactory.actorConstructors[name]) {
		throw new Error("Unknown actor: " + name);
	}

	return new ActorFactory.actorConstructors[name](this.game, pos);
};
