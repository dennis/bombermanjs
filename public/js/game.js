function Game() {
	this.logic_hooks = [];
	this.render_hooks = [];
	this.skipTicks = 1000 / Game.logic_rate,
	this.lastGameTick = 0;
	this.firstGameTick = 0;
}

Game.logic_rate = 20; // per second

Game.prototype.addLogic = function(logic) {
	this.logic_hooks.push(logic);
}

Game.prototype.addRender = function(render) {
	this.render_hooks.push(render);
}

Game.prototype.render = function(interpolation, ticks) {
	this.render_hooks.forEach(function(render) {
		render(interpolation, ticks);
	})
}

Game.prototype.logic = function() {
	this.logic_hooks.forEach(function(logic) {
		logic();
	})
}

Game.prototype.run = function() {
	var now = (new Date()).getTime();

	if(this.lastGameTick == 0) {
		this.lastGameTick = now-this.skipTicks;
		this.firstGameTick = now;
	}

	while(now > this.lastGameTick) {
		this.logic();
		this.lastGameTick += this.skipTicks;
	}

	var interpolation = (this.lastGameTick-now)/this.skipTicks;

	this.render(interpolation, now - this.firstGameTick);
}

function renderer() {
	requestAnimFrame(renderer);
	game.run(); 
}

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};
})();
