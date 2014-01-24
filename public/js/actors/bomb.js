"use strict";

function Bomb(kind, pos, owner) {
	this.name = name;
	this.kind = kind;
	this.pos = pos;
	this.animationState = undefined;
	this.owner = owner;
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

Bomb.prototype.beforeAddActor = function() {
	this.owner.addBomb(this);
};

Bomb.prototype.beforeRemoveActor = function() {
	this.owner.removeBomb(this);
};

