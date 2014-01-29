"use strict";

// TODO Split canvas stuff into another class
// FIXME This is a kicthensink! :(

function Level(levelMap, tileSet, backgroundCanvasId, actorsCanvasId, statusCanvasId) {
	var mapWidth = levelMap.width*levelMap.tilewidth;
	var mapHeight = levelMap.height*levelMap.tileheight;

	this.tileSet = tileSet;
	this.background = new Background(backgroundCanvasId, mapWidth, mapHeight, tileSet);
	this.actors = new Actors(actorsCanvasId, mapWidth, mapHeight, tileSet);
	//this.statusbar = new Statusbar(statusCanvasId, mapWidth, mapHeight);
	this.tileWidth = levelMap.tilewidth;
	this.tileHeight = levelMap.tileheight;
	this.levelMap = levelMap;
	this.collisionEngine = new CollisionEngine(levelMap.width, levelMap.height);

	console.log("Loading map");

	var self = this;

	levelMap.layers.filter(function(layer) {
		return (layer.type == "tilelayer" && layer.visible && layer.properties);
	}).forEach(function(layer, i) {
		if(layer.properties.type == "background" || layer.properties.type == "blocking") {
			console.log("Loaded layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
			self.background.populate(layer);
		}
		else if(layer.properties.type == "spawn") {
			console.log("Loaded layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
			self.actors.populate(layer, levelMap);
		}
		else {
			console.error("Ignored layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
		}
	});

	this._findPredefinedActors().forEach(function(predefinedActor) {
		var actor = self.actors.factory.new(predefinedActor.actor, new Point(predefinedActor.x, predefinedActor.y));

		self.actors.addActor(actor);
	});

	this._populateCollisionEngine();
};

Level.prototype.getWidth = function() {
	return this.levelMap.width;
};

Level.prototype.getHeight = function() {
	return this.levelMap.height;
};

Level.prototype.getTileWidth = function() {
	return this.levelMap.tilewidth;
};

Level.prototype.getTileHeight = function() {
	return this.levelMap.tileheight;
};

Level.prototype._findPredefinedActors = function() {
	var actors = [];
	for(var i = 0; i < this.levelMap.layers.length; i++) {
		var layer = this.levelMap.layers[i];
		if(layer.type == "tilelayer" && layer.properties && layer.properties.type == "spawn") {
			for(var j = 0; j < layer.data.length; j++) {
				if(layer.data[j] != "0") {
					var type = this.levelMap.tilesets[0].tileproperties[layer.data[j]-1].type;

					var x = j % this.getWidth();
					var y = (j-x) / this.getWidth();

					x = x * this.getTileWidth();
					y = y * this.getTileHeight();

					actors.push({actor: type, id: type, x: x, y: x});
				}
			}
		}
	}

	return actors;
};

Level.prototype._populateCollisionEngine = function() {
	for(var i = 0; i < this.levelMap.layers.length; i++) {
		var layer = this.levelMap.layers[i];

		if(layer.type == "tilelayer" && layer.properties && layer.properties.type == "blocking") {
			for(var j = 0; j < layer.data.length; j++) {
				if(layer.data[j] != 0) { 
					var x = j % this.levelMap.width;
					var y = (j-x) / this.levelMap.width;

					this.collisionEngine.set(new Point(x, y));
				}
			}
		}
	}
};

Level.prototype.render = function(game, interpolation, ticks) {
	this.background.draw(this.tileSet);
	this.actors.draw(this.tileSet, interpolation, ticks, this);
	//this.statusbar.draw();
};

Level.prototype.logic = function(game) {
	this.actors.logic(game);
};

