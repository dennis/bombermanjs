function Game() {};
Game.prototype.logic_rate = 1; // per second
Game.prototype.render = function() {
	level.render();
}
Game.prototype.logic = function() {
	console.log("logic()");
	level.logic();
}
Game.prototype.run = function() {
	var loops = 0, 
		skipTicks = 1000 / Game.logic_rate,
		nextGameTick = (new Date()).getTime();

	var self = this;
	return function() {
		loops = 0;

		while((new Date()).getTime() > nextGameTick) {
			self.logic();
			nextGameTick += skipTicks;
			loops++;
		}

		self.render();
	};
}
