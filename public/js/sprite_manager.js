"use strict";

function SpriteManager(tileset, json) {
	var self = this;

	this.sprites = {};
	this.tileset = tileset;

	Object.keys(json.sprites).forEach(function(spriteName) {
		console.log("Found sprite: " + spriteName);

		self.sprites[spriteName] = new Sprite(tileset, json.sprites[spriteName]);
	});
}

SpriteManager.prototype.getTileSet = function() {
	return this.tileset;
};

SpriteManager.prototype.get = function(spriteName) {
	return this.sprites[spriteName];
};

