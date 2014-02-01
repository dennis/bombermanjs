"use strict";

var game = new Game();

$.ajax('/levels/level.json')
.done(function(data){
	game.parseLevel(data);
	game.run();
})
.fail(function() {
	console.error("Failed loading level");
});
