var RemoveActorAction = require('./remove_actor_action.js');
var idSequence = 0;

function Explosion(bomb, up, right, down, left) {
	this.id = "explosion" + (++idSequence);
	this.x = bomb.x;
	this.y = bomb.y;
	this.age = 0;
	this.up = up;
	this.right = right;
	this.down = down;
	this.left = left;
};

Explosion.prototype.getId = function() {
	return this.id;
};

Explosion.prototype.getX = function() {
	return this.x;
};

Explosion.prototype.getY = function() {
	return this.y;
};

Explosion.prototype.getCurrentState = function() {
	return {
		id: this.getId(),
		actor: 'explosion',
		x: this.x,
		y: this.y,
		up: this.up,
		right: this.right,
		down: this.down,
		left: this.left
	};
};

Explosion.prototype.act = function() {
	this.age++;

	if(this.age > 5) {
		return new RemoveActorAction(this);
	}
};

module.exports = Explosion;
