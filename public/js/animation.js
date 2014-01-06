function Animation() {
	this.tiles = [];
	this.current = 0;
	this.start = 0;
	this.fps = 4;
}
Animation.prototype.fps = 4;
Animation.prototype.tiles = [];
Animation.prototype.push = function(tile) {
	this.tiles.push(tile);
};
Animation.prototype.get = function(ticks) {
	var frame = parseInt(((ticks - this.start)*this.fps)/1000) % this.tiles.length;
	return this.tiles[frame];
}
Animation.prototype.reset = function(ticks) {
	this.start = ticks;
}

