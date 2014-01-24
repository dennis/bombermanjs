"use strict";

function Actors(canvasId, mapWidth, mapHeight, tileSet) {
	this.tileSet = tileSet;
	this.actors = [];
	this.actorIdx = {};
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

Actors.prototype.update = function(data) {
	var actor = this.actors[this.actorIdx[data.actor]];
	if(actor)
		actor.update(data);
	else
		console.error("Cannot find actor " +  data.actor);
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
	this.actorIdx[actor.id || actor.name] = this.actors.length-1;
};

Actors.prototype.removeActor = function(data) {
	if(actor.beforeRemoveACtor)
		actor.beforeRemoveActor();
	delete this.actors[this.actorIdx[data.id]];
};

Actors.prototype.getActor = function(actorName) {
	return this.actors[this.actorIdx[actorName]];
};

