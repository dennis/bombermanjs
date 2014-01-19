function Animation() {
	this.tiles = [];
	this.fps = 4;
};

Animation.prototype.fps = 0;
Animation.prototype.tiles = [];
Animation.prototype.push = function(tile) {
	this.tiles.push(tile);
};

Animation.prototype.get = function(state, ticks) {
	var frame = parseInt(((ticks - state.start)*this.fps)/1000) % this.tiles.length;
	return this.tiles[frame];
};

Animation.prototype.reset = function(state, ticks) {
	state.start = ticks;
};
