"use strict";

var assetLoader = new AssetLoader(function(assetLoader) {
	console.log("Done loading assets");
	try {
		var game = new Game(assetLoader);
		game.initialize();
		game.run();
	}
	catch(error) {
		console.error(error.message);
	}
}, function(assetLoader) {
	console.error("Failed loading level");
});
assetLoader.load('level', '/levels/level.json', 'json');
assetLoader.load('sprites', '/levels/sprites.json', 'json');
assetLoader.execute();
