var RemoveActorAction = require('./remove_actor_action.js');
var idSequence = 0;

function Explosion(bomb) {
	this.id = "explosion" + (++idSequence);
	this.x = bomb.x;
	this.y = bomb.y;
	this.age = 0;
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
		type: 'explosion',
		x: this.x,
		y: this.y
	};
};

Explosion.prototype.act = function() {
	this.age++;

	if(this.age > 5) {
		return new RemoveActorAction(this);
	}
};

module.exports = Explosion;
