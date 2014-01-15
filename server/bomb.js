function Bomb(id, x, y) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.age = 0;
};

Bomb.prototype.getId = function() {
	return this.id;
};

Bomb.prototype.getX = function() {
	return this.x;
};

Bomb.prototype.getY = function() {
	return this.y;
};

Bomb.prototype.act = function() {
	this.age++;

	if(this.age > 30) {
		console.log("IMPLODE");
	}
};

Bomb.prototype.getAge = function() {
	return this.age;
}

module.exports = Bomb;

