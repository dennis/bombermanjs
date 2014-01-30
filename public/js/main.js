"use strict";

var game = new Game();

// main
$.ajax('/levels/level.json', {
	success: function(data) {
		game.parseLevel(data);
		game.run();
	}
});
