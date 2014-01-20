"use strict";

function ActorKind() {
	this.subtypes = {};
	this.lastSubtype = null;
};
ActorKind.prototype.lastSubtype = null;
ActorKind.prototype.subtypes = {};
ActorKind.prototype.addTileSubtype = function(tileNum, subtype) {
	if(this.subtypes[subtype] == undefined) 
		this.subtypes[subtype] = new Animation();
	this.subtypes[subtype].push(tileNum);
};
ActorKind.prototype.get = function(state, subtype, ticks) {
	if(this.lastSubtype != subtype) {
		this.reset(state, subtype, ticks);
		this.lastSubtype = subtype;
	}
	return this.subtypes[subtype].get(state, ticks);
};

ActorKind.prototype.resetAll = function(state, ticks) {
	var self = this;
	Object.keys(this.subtypes).forEach(function(subtype) {
		self.reset(state, subtype, ticks);
	});
};
ActorKind.prototype.reset = function(state, subtype, ticks) {
	if(this.subtypes[subtype])
		this.subtypes[subtype].reset(state, ticks);
};
