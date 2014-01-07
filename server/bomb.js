function Bomb(id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
}
Bomb.prototype.getId = function() {
	return this.id;
}
Bomb.prototype.getX = function() {
	return this.x;
}
Bomb.prototype.getY = function() {
	return this.y;
}

module.exports = Bomb;

