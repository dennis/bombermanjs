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
		for(var pos = 0; pos < this.layers[i].data.length; pos++) {
			this.tileSet.draw(this.context,pos,this.layers[i].data[pos]-1);
		}
	}

	this.dirty = false;
}
