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
};

Actor.prototype.logic = function() {
};

Actor.prototype.draw = function(context, tileSet, interpolation, ticks) {
};

// Called before actor is added to the game
Actor.prototype.beforeAddActor = function() {
};

// Called before actor is removed from the game
Actor.prototype.beforeRemoveActor = function() {
};

// Called by CollisionEngine if it have been used as a value for CollisionDetection
Actor.prototype.isBlocking = function(otherActor) {
	console.log(this, "is blocking for ", otherActor);

	return false;
};
