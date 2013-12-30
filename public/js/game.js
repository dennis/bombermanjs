function Game() {
	this.logic_hooks = [];
	this.render_hooks = [];
}

Game.prototype.logic_rate = 10; // per second

Game.prototype.addLogic = function(logic) {
	this.logic_hooks.push(logic);
}

Game.prototype.addRender = function(render) {
	this.render_hooks.push(render);
}

Game.prototype.render = function() {
	this.render_hooks.forEach(function(render) {
		render();
	})
}

Game.prototype.logic = function() {
	this.logic_hooks.forEach(function(logic) {
		logic();
	})
}

Game.prototype.run = function() {
	var loops = 0, 
		skipTicks = 1000 / Game.logic_rate,
		nextGameTick = (new Date()).getTime();

	var self = this;
	var lastLogicTicks = 0;
	return function() {
		loops = 0;
		var now = (new Date()).getTime();

		if(lastLogicTicks == 0) {
			// First interation
			self.logic();
			lastLogicTicks = now;
		}
		while(now < (lastLogicTicks+skipTicks)) {
			self.logic();
			lastLogicTicks += skipTicks;
		}
		lastLogicTicks = now;

		self.render();
	};
}
