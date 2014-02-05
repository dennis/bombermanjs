"use strict";

function Game(assetLoader, soundManager) {
	this.assetLoader = assetLoader;
	this.spriteManager = null;
	this.soundManager = soundManager;
	this.input = new InputManager();
	this.gameLoop = new GameLoop();
	this.factory = new ActorFactory(this);
	this.level = null;
	this.playerController = null;
	this.sherryController = null;
	this.ticksTriggers = [];
	this.ticks = 0;
	this.bombCount = 5;
	this.lives = 3;
}

Game.prototype.initialize = function() {
	var self = this;
	var sprites = this.assetLoader.get('sprites');
	var levelJson = this.assetLoader.get('level');

	console.log("Loaded level1", levelJson);

	if(levelJson.tilesets[1]) {
		throw new Error("Cannot handle more than a single tileset");
	}

	// sprites definitions
	console.log("Loaded sprites");

	// the image
	var tilesImg = new Image();
	tilesImg.src = levelJson.tilesets[0].image;
	tilesImg.onload = function() {
		console.log("Graphics loaded: ", tilesImg);

		var tileSet = new TileSet(levelJson.tilesets[0], tilesImg);
		self.spriteManager = new SpriteManager(tileSet, sprites);

		self.level = new Level(levelJson, self.spriteManager, 'background', 'actors', 'statusbar');
		self.level.initialize(self);
		self.playerController = new PlayerController(self.level.actors.getPlayer(0), self);
		self.sherryController = new SherryController(self.level.actors.getPlayer(1), self);
		self.updateStatusbar();
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
			self.playerController.execute(self.input); 
			self.sherryController.execute(); 
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

Game.prototype.getTick = function() {
	return this.ticks;
};

Game.prototype.canDropBomb = function() {
	return this.bombCount > 0;
};

Game.prototype.dropBomb = function() {
	this.bombCount--;
	this.updateStatusbar();
};

Game.prototype.actorDied = function(actor) {
	console.log("Actor died");

	var self = this;

	if(this == self.level.actors.getPlayer(0)) {
		this.inSecondsDo(3, function() {
			actor.alive = true;
			self.level.actors.addActor(actor);
			self.lives--;
			self.bombCount = 5;

			self.updateStatusbar();
		});
	}
};

Game.prototype.updateStatusbar = function() {
	this.level.statusbar.update({bombCount: this.bombCount, lives: this.lives});
};

