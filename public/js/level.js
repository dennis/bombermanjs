"use strict";

function Level(levelMap, tileSet, backgroundCanvasId, actorsCanvasId) {
	var mapWidth = levelMap.width*levelMap.tilewidth;
	var mapHeight = levelMap.height*levelMap.tileheight;

	this.tileSet = tileSet;
	this.background = new Background(backgroundCanvasId, mapWidth, mapHeight, tileSet);
	this.actors = new Actors(actorsCanvasId, mapWidth, mapHeight, tileSet);
	this.tileWidth = levelMap.tilewidth;
	this.tileHeight = levelMap.tileheight;

	console.log("Loading map");

	var that = this;

	levelMap.layers.filter(function(layer) {
		return (layer.type == "tilelayer" && layer.visible && layer.properties);
	}).forEach(function(layer, i) {
		if(layer.properties.type == "background" || layer.properties.type == "blocking") {
			console.log("Loaded layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
			that.background.populate(layer);
		}
		else if(layer.properties.type == "spawn") {
			console.log("Loaded layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
			that.actors.populate(layer, levelMap);
		}
		else {
			console.error("Ignored layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
		}
	});
};

Level.prototype.render = function(interpolation, ticks) {
	this.background.draw(this.tileSet);
	this.actors.draw(this.tileSet, interpolation, ticks, this);
};

Level.prototype.logic = function() {
	this.actors.logic();
};

Level.prototype.actorUpdate = function(data) {
	this.actors.update(data);
};

Level.prototype.newActor = function(data) {
	this.actors.spawn(data);
};

Level.prototype.delActor = function(data) {
	this.actors.despawn(data);
};

Level.prototype.getTileHeight = function() {
	return this.tileHeight;
};

Level.prototype.getTileWidth = function() {
	return this.tileWidth;
};

