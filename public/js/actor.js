"use strict";

function Actor(name, kind) {
	this.name = name;
	this.kind = kind;
}
Actor.prototype.logic = function() {
}
Actor.prototype.draw = function(context, tileSet, interpolation, ticks) {
}
