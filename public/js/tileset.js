"use strict";

// TileSet
function TileSet(tileSetData, sprite) {
	this.sprite = sprite;

	this.tileWidth = tileSetData.tilewidth;
	this.tileHeight = tileSetData.tileheight;

	this.cols = tileSetData.imagewidth / this.tileWidth;
	this.rows = tileSetData.imageheight / this.tileHeight;
};

TileSet.prototype.draw = function(context, x, y, tileNum) {
	var tileXY = this.toXY(tileNum);

	context.drawImage(
		this.sprite, 
		tileXY.x * this.tileWidth, tileXY.y * this.tileHeight, this.tileWidth, this.tileHeight,
		x, y, this.tileWidth, this.tileHeight
		);
}
TileSet.prototype.clear = function(context, x, y) {
	context.clearRect(x, y, this.tileWidth, this.tileHeight);
}
TileSet.prototype.toXY = function(pos) {
	var x = pos % this.cols;
	var y = (pos - x)/ this.cols;
	return {
		x: x,
		y: y,
		toString: function() {
			return "(" + x + "," + y + ")";
		}
	}
}
TileSet.prototype.fromXY = function(pos) {
	return pos.y * this.cols + pos.x;
}

TileSet.prototype.getTileWidth = function() {
	return this.tileWidth;
}

TileSet.prototype.getTileHeight = function() {
	return this.tileHeight;
}

