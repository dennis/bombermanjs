function CollisionEngine(width, height) {
	this.width = width;
	this.height = height;
	this.tiles = [];

	// initialize tiles
	for(var x = 0; x < this.width; x++) {
		this.tiles.push([]);
		for(var y = 0; y < this.height; y++) {
			this.tiles[x].push([]);
		}
	}
	for(var x = 0; x < this.width; x++) {
		for(var y = 0; y < this.height; y++) {
			this.tiles[x][y] = false;
		}
	}
}
CollisionEngine.prototype.setXY = function(x, y) {
	this.tiles[x][y] = true;
};
CollisionEngine.prototype.isBlocked = function(x, y) {
	return this.tiles[x][y];
}

module.exports = CollisionEngine;

