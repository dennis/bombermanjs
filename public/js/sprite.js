"use strict";

function Sprite(tileset, json) {
	this.tileset = tileset;
	this.tiles = json.tiles;
	this.fps = json.fps;
}

Sprite.prototype.get = function(state, ticks) {
	var frame = 0;
	if(this.fps)
		frame = parseInt(((ticks - state.start)*this.fps)/1000) % this.tiles.length;
	return this.tiles[frame];
};

Sprite.prototype.reset = function(state, ticks) {
	state.start = ticks;
};

