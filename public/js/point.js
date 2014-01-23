"use strict";

function Point(x, y) {
	this.x = x || 0;
	this.y = y || 0 ;
}

Point.prototype.add = function(other) {
	return new Point(this.x + other.x, this.y + other.y);
};

Point.prototype.sub = function(other) {
	return new Point(this.x - other.x, this.y - other.y);
}

Point.prototype.isEqualTo = function(other) {
	return this.x == other.x && this.y == other.y;
};

Point.prototype.clone = function() {
	return new Point(this.x, this.y);
};

Point.DIRECTIONS = {
	"up": new Point(0,-1),
	"down": new Point(0,1),
	"left": new Point(-1,0),
	"right": new Point(1,0)
};
