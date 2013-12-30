function Actors(canvasId, mapWidth, mapHeight, tileSet) {
	this.actors = [];
	this.actorIdx = {};
	this.tileSet = tileSet;

	this.init(canvasId, mapWidth, mapHeight);
}

Actors.prototype = new CanvasManager();

Actors.prototype.populate = function(layer, levelMap) {
	for(var pos = 0; pos < layer.data.length; pos++) {
		if(layer.data[pos] != 0) {
			var xy = this.tileSet.toXY(pos);
			var name = levelMap.tilesets[0].tileproperties[layer.data[pos]-1].type;
			this.actors.push(new Actor(name, layer.data[pos]));
			this.actorIdx[name] = this.actors.length-1;
			console.log("  Found actor "+name+" at " + xy + " using tile-" + layer.data[pos]);
		}
	}
}

Actors.prototype.draw = function(tileSet) {
	var that = this;
	this.actors.forEach(function(actor) {
		actor.draw(that.context, tileSet);
	});
}

Actors.prototype.update = function(dataSet) {
	var that = this;

	// FIXME - if two actors is at the same spot - the non-moving actor is not redrawn
	
	dataSet.forEach(function (data) {
		var actor = that.actors[that.actorIdx[data.actor]];
		actor.update(data);
	});
}

