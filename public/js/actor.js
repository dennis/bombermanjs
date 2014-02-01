"use strict";

function Actor() {
	this.alive = true;
	this.actions = [];
}

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

Actor.prototype.beforeAddActor = function() {
};

Actor.prototype.beforeRemoveActor = function() {
}

