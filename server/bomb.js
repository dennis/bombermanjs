var ExplodeAction = require('./explode_action.js');
var bombSequenceId = 0;

function Bomb(x, y) {
	this.id = "bomb" + (++bombSequenceId);
	this.x = x;
	this.y = y;
	this.age = 0;

	console.log("Bomb.id", this.id);
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

	if(this.age > 12) {
		return new ExplodeAction(this);
	}
};

Bomb.prototype.getAge = function() {
	return this.age;
}

module.exports = Bomb;

