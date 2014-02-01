"use strict";

function SpriteBackground(canvasId, mapWidth, mapHeight, spriteManager) {
	this.layers = [];
	this.spriteManager = spriteManager;

	this.init(canvasId, mapWidth, mapHeight);
}

SpriteBackground.prototype = new CanvasManager();

SpriteBackground.prototype.draw = function(interpolation, ticks) {
	var self = this;
	var pos = 0;
	var tileSet = this.spriteManager.tileset;
	var states = {};

	this.spriteManager.getSpriteNames().forEach(function(spriteName) {
		states[spriteName] = new SpriteState();
		var xy = tileSet.toXY(pos);
		pos++;
		tileSet.draw(self.context, xy.x * tileSet.getTileWidth(), xy.y * tileSet.getTileHeight(), 
					 self.spriteManager.get(spriteName).get(states[spriteName], ticks));
	});
};
