"use strict";

ActorFactory.register('bomb', function(actors, pos) {
	return new Bomb(actors, pos);
});

function Bomb(actors, pos, owner) {
	this.name = name;
	this.kind = actors.actorKind['bomb'];
	this.pos = pos;
	this.animationState = undefined;
	this.owner = owner;
	this.logicCount = 0;
};

Bomb.prototype = new Actor();

Bomb.prototype.draw = function(context, tileSet, interpolation, ticks) {
	if(this.animationState == undefined) {
		this.animationState = {};
		this.kind.resetAll(this.animationState, ticks);
	}
	var tile = this.kind.get(this.animationState, undefined, ticks);

	tileSet.draw(context, this.pos.x, this.pos.y, tile);
};

Bomb.prototype.logic = function(game) {
	this.logicCount++;

	if(GameLoop.logic_rate * 1.5 === this.logicCount) {
		(new ExplodeAction(this)).execute(game);
	}
};

Bomb.prototype.setOwner = function(actor) {
	this.owner = actor;
};

Bomb.prototype.beforeAddActor = function() {
	this.owner.addBomb(this);
};

Bomb.prototype.beforeRemoveActor = function() {
	this.owner.removeBomb(this);
};

Bomb.prototype.killed = function(game) {
	(new ExplodeAction(this)).execute(game);
};
