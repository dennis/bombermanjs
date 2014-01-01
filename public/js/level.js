function Level(levelMap, tileSet, backgroundCanvasId, actorsCanvasId) {
	var mapWidth = levelMap.width*levelMap.tilewidth;
	var mapHeight = levelMap.height*levelMap.tileheight;

	this.tileSet = tileSet;
	this.background = new Background(backgroundCanvasId, mapWidth, mapHeight, tileSet);
	this.actors = new Actors(actorsCanvasId, mapWidth, mapHeight, tileSet);

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
Level.prototype.render = function(interpolation) {
	this.background.draw(this.tileSet);
	this.actors.draw(this.tileSet, interpolation);
}

Level.prototype.logic = function() {
	this.actors.logic();
}

Level.prototype.actorUpdate = function(data) {
	this.actors.update(data);
}
Level.prototype.newActor = function(data) {
	this.actors.spawn(data);
}
