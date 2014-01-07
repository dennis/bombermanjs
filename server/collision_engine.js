function CollisionEngine(width, height) {
	this.width = width;
	this.height = height;
	this.cells = new Array(width*height);
}
CollisionEngine.prototype.setXY = function(x, y) {
	this.cells[y*this.width + x] = true;
};
CollisionEngine.prototype.isBlocked = function(x, y) {
	return this.cells[y*this.width + x];
}

module.exports = CollisionEngine;

