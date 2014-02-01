"use strict";

var game = new Game();

$.ajax('/levels/level.json')
.done(function(data){
	try {
		game.parseLevel(data);
		game.run();
	}
	catch(error) {
		console.error(error.message);
	}
})
.fail(function() {
	console.error("Failed loading level");
});
