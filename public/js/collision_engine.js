function CollisionEngine(width, height) {
	this.width = width;
	this.height = height;
	this.cells = new Array(width*height);
};

CollisionEngine.prototype.set = function(point, value) {
	if(value === undefined)
		value = true;
	this.cells[point.y*this.width + point.x] = value;
};

CollisionEngine.prototype.get = function(point) {
	return this.cells[point.y*this.width + point.x];
};

CollisionEngine.prototype.isBlocked = function(point) {
	return !!this.get(point);
};

