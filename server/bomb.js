var ExplodeAction = require('./explode_action.js');
var bombSequenceId = 0;

function Bomb(player, x, y) {
	this.id = "bomb" + (++bombSequenceId);
	this.owner = player;
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

Bomb.prototype.beforeAddActor = function(world) {
	this.getOwner().addBomb(this);
};

Bomb.prototype.beforeRemoveActor = function(world) {
	this.getOwner().removeBomb(this);
};

Bomb.prototype.act = function() {
	this.age++;

	if(this.age == 12) {
		return new ExplodeAction(this);
	}
};

Bomb.prototype.getAge = function() {
	return this.age;
}

Bomb.prototype.getOwner = function() {
	return this.owner;
}

Bomb.prototype.getCurrentState = function() {
	return  {
		id: this.getId(), 
		actor: 'bomb', 
		x: this.getX(), 
		y: this.getY() };
}

module.exports = Bomb;

