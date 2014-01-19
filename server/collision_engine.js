var Point = require('./../public/js/point.js');

function CollisionEngine(width, height) {
	this.width = width;
	this.height = height;
	this.cells = new Array(width*height);
};

CollisionEngine.prototype.set = function(point) {
	this.cells[point.y*this.width + point.x] = true;
};

CollisionEngine.prototype.isBlocked = function(point) {
	return this.cells[point.y*this.width + point.x];
};

module.exports = CollisionEngine;

