"use strict";

function Game() {
	this.input = new InputManager();
	this.gameLoop = new GameLoop();
	this.level = null;
	this.playerController = null;
	this.ticksTriggers = [];
	this.ticks = 0;
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
		self.playerController = new PlayerController(self.level.actors.getPlayer(), self);
	}
};

Game.prototype.run = function() {
	var self = this;

	this.input.attach();

	this.gameLoop.addRender(function(i,t) { 
		if(self.level) {
			self.level.render(self, i,t); 
		}
	});

	this.gameLoop.addLogic(function() { 
		self.ticks++;

		if(self.ticksTriggers[self.ticks]) {
			self.ticksTriggers[self.ticks].forEach(function(action) {
				action(self);
			});

			delete self.ticksTriggers[self.ticks];
		};
	});

	this.gameLoop.addLogic(function() { 
		if(self.level) {
			self.playerController.handleInput(self.input); 
		}
	});
	
	this.gameLoop.addLogic(function() { 
		if(self.level) {
			self.level.logic(self);
		}
	});
	startRendering(this.gameLoop);
};

Game.prototype.inTicksDo = function(ticks, action) {
	var absTicks = ticks+this.ticks;
	this.ticksTriggers[absTicks] = this.ticksTriggers[absTicks] || [];
	this.ticksTriggers[ticks+this.ticks].push(action);
};

Game.prototype.inSecondsDo = function(seconds, action) {
	this.inTicksDo(seconds * GameLoop.logic_rate, action);
};
