"use strict";

function SpriteManager(tileset, json) {
	var self = this;

	this.sprites = {};
	this.tileset = tileset;

	Object.keys(json.sprites).forEach(function(spriteName) {
		self.sprites[spriteName] = new Sprite(tileset, json.sprites[spriteName]);
	});
}

SpriteManager.prototype.getTileSet = function() {
	return this.tileset;
};

SpriteManager.prototype.get = function(spriteName) {
	if(!this.sprites[spriteName])
		throw new Error("Unknown requested sprite: " + spriteName);
	return this.sprites[spriteName];
};

SpriteManager.prototype.getSpriteNames = function() {
	return Object.keys(this.sprites);
};
