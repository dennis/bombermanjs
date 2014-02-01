"use strict";

function Actors(canvasId, mapWidth, mapHeight, spriteManager) {
	this.tileSet = spriteManager.getTileSet();
	this.actors = [];
	this.actorKind = {};
	this.factory = new ActorFactory(this);

	this.init(canvasId, mapWidth, mapHeight);
}

Actors.prototype = new CanvasManager();

Actors.prototype.populate = function(layer, levelMap) {
	var self = this;
	Object.keys(levelMap.tilesets[0].tileproperties).forEach(function(tileNum) {
		var properties = levelMap.tilesets[0].tileproperties[tileNum];

		if(!self.actorKind[properties.type]) {
			self.actorKind[properties.type] = new ActorKind();
		}
	
		self.actorKind[properties.type].addTileSubtype(tileNum, properties.subtype);
	});
}

Actors.prototype.draw = function(interpolation, ticks, level) {
	this.context.clearRect(0, 0, this.mapWidth, this.mapHeight);
	var self = this;
	this.actors.forEach(function(actor) {
		actor.draw(self.context, self.tileSet, interpolation, ticks, level);
	});
}

Actors.prototype.logic = function(level) {
	this.actors.forEach(function(actor) {
		actor.logic(level);
	});
}

Actors.prototype.addActor = function(actor) {
	if(actor.beforeAddActor)
		actor.beforeAddActor();
	this.actors.push(actor);
};

Actors.prototype.removeActor = function(target) {
	if(target.beforeRemoveActor)
		target.beforeRemoveActor();
	this.actors = this.actors.filter(function(actor) {
		return actor !== target;
	});
};

Actors.prototype.getPlayer = function(actorName) {
	return this.getActorByIndex(0); // FIXME This will not work for all maps
};

Actors.prototype.getActorByIndex= function(idx) {
	return this.actors[idx];
};

