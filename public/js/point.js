function Point(x, y) {
	this.x = x;
	this.y = y;
}

Point.prototype.add = function(other) {
	return new Point(this.x + other.x, this.y + other.y);
}

Point.prototype.isEqualTo = function(other) {
	return this.x == other.x && this.y == other.y;
}

Point.DIRECTIONS = {
	"up": new Point(0,-1),
	"down": new Point(0,1),
	"left": new Point(-1,0),
	"right": new Point(1,0)
};

if(typeof module == "object") {
	module.exports = Point;
}
