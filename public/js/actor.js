"use strict";

function Actor(name, kind) {
	this.name = name;
	this.kind = kind;
	this.actions = [];
}

Actor.prototype.getName = function() {
	return this.name;
};

Actor.prototype.addAction = function(action) {
	this.actions.push(action);
};

Actor.prototype.performActions = function(level) {
	if(this.actions.length)
		console.log("performin actions", this.actions);
	this.actions.forEach(function(action) {
		action.execute(level);
	});

	this.actions = [];
}

Actor.prototype.logic = function() {
};

Actor.prototype.draw = function(context, tileSet, interpolation, ticks) {
};

