"use strict";

function GameLoop() {
	this.logic_hooks = [];
	this.render_hooks = [];
	this.skipTicks = 1000 / GameLoop.logic_rate,
	this.lastGameTick = 0;
	this.firstGameTick = 0;
}

GameLoop.logic_rate = 20; // per second

GameLoop.prototype.addLogic = function(logic) {
	this.logic_hooks.push(logic);
}

GameLoop.prototype.addRender = function(render) {
	this.render_hooks.push(render);
}

GameLoop.prototype.render = function(interpolation, ticks) {
	this.render_hooks.forEach(function(render) {
		render(interpolation, ticks);
	})
}

GameLoop.prototype.logic = function() {
	this.logic_hooks.forEach(function(logic) {
		logic();
	})
}

GameLoop.prototype.run = function() {
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

function startRendering(gameLoop) {
	function renderer() {
		requestAnimFrame(renderer);
		gameLoop.run(); 
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

	renderer();
};
