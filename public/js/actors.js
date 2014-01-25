"use strict";

function Actors(canvasId, mapWidth, mapHeight, tileSet) {
	this.tileSet = tileSet;
	this.actors = [];
	this.actorKind = {};
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

Actors.prototype.draw = function(tileSet, interpolation, ticks, level) {
	this.context.clearRect(0, 0, this.mapWidth, this.mapHeight);
	var that = this;
	this.actors.forEach(function(actor) {
		actor.draw(that.context, tileSet, interpolation, ticks, level);
	});
}

Actors.prototype.logic = function(level) {
	var that = this;
	this.actors.forEach(function(actor) {
		actor.logic(level);
	});
}

Actors.prototype.constructAndAddActor = function(data) {
	var actorConstructor = null;

	switch(data.actor) {
		case 'player0':
		case 'player1':
		case 'player2':
		case 'player3':
			actorConstructor = Bomberman;
			break;
		case 'bomb':
			actorConstructor = Bomb;
			break;
		case 'explosion':
			actorConstructor = Explosion;
			break;
		default:
			throw new String(data.actor + " unsupported");
	}

	var actor = new actorConstructor(data.id, this.actorKind[data.actor], data);
	
	this.addActor(actor);

	return actor;
};

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
	return this.actors[0]; // FIXME This will not work for all maps
};

