function Background(canvasId, mapWidth, mapHeight, tileSet) {
	this.layers = [];
	this.tileSet = tileSet;
	this.dirty = false;

	this.init(canvasId, mapWidth, mapHeight);
}
Background.prototype = new CanvasManager();
Background.prototype.populate = function(layer) {
	this.layers.push(layer);
	this.dirty = true;
}
Background.prototype.draw = function() {
	if(!this.dirty) {
		return;
	}

	for(var i = 0; i < this.layers.length; i++) {
		var layer = this.layers[i];
		for(var pos = 0; pos < layer.data.length; pos++) {
			var xy = this.tileSet.toXY(pos);
			this.tileSet.draw(this.context, xy.x * this.tileSet.getTileWidth(), xy.y * this.tileSet.getTileHeight(), layer.data[pos]-1);
		}
	}

	this.dirty = false;
}
