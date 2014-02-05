function ActorFactory(game) {
	this.game = game;
	this.constructors = {};
}

ActorFactory.actorConstructors = {};

// Constructors of actors are expected to accept: name and position
ActorFactory.register = function(name, constructor) {
	ActorFactory.actorConstructors[name] = constructor;

	console.log('Registered actor', name);
};

// FIXME: Don't know how. 
ActorFactory.prototype.new = function(name, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
	if(arguments.length > 10)
		throw new Error("Factory cannot support this many arguments");

	if(!ActorFactory.actorConstructors[name]) {
		throw new Error("Unknown actor: " + name);
	}

	return new ActorFactory.actorConstructors[name](this.game, arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9);
};
