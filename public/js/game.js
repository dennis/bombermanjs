"use strict";

function Game() {
	this.input = new InputManager();
	this.gameLoop = new GameLoop();
	this.level = null;
	this.actors = [];
}

Game.prototype.parseLevel = function(levelJson) {
	var self = this;

	console.log("Loaded level1", levelJson);

	// load asset
	var tilesImg = new Image();
	tilesImg.src = levelJson.tilesets[0].image;
	tilesImg.onload = function() {
		console.log("Graphics loaded: ", tilesImg);

		var tileSet = new TileSet(levelJson.tilesets[0], tilesImg);
		self.level = new Level(levelJson, tileSet, 'background', 'actors', 'statusbar');

	}
};

Game.prototype.run = function() {
	var self = this;

	this.input.attach();
	this.gameLoop.addRender(function(i,t) { if(self.level) self.level.render(i,t); });
	this.gameLoop.addLogic(function() { if(self.level) self.level.handleInput(self.input); });
	this.gameLoop.addLogic(function() { if(self.level) self.level.logic(); });
	startRendering(this.gameLoop);
};

