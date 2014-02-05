"use strict";

var game = null;
var assetLoader = new AssetLoader(function(assetLoader) {
	console.log("Done loading assets");
	try {
		var soundManager = new SoundManager(assetLoader, 
		function() { // SUCCESS
			console.log("Done decoding sfx");
			game = new Game(assetLoader, soundManager);
			game.initialize();
			game.run();
		},
		function() { // ERROR
			console.error("Failed loading sfx");
		});
	}
	catch(error) {
		console.error(error);
	}
}, function(assetLoader) {
	console.error("Failed loading level");
});
assetLoader.load('level', 'levels/level.json', 'json');
assetLoader.load('sprites', 'levels/sprites.json', 'json');
assetLoader.load('snd-step', 'sfx/step.mp3', 'arraybuffer');
assetLoader.load('snd-explosion', 'sfx/explosion.mp3', 'arraybuffer');
assetLoader.load('snd-spawn', 'sfx/spawn.mp3', 'arraybuffer');
assetLoader.load('snd-gameover', 'sfx/gameover.mp3', 'arraybuffer');
assetLoader.execute();
