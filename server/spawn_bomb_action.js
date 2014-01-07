var Bomb = require('./bomb.js');

function SpawnBombAction(x, y) {
	this.x = x;
	this.y = y;
}
SpawnBombAction.prototype.execute = function(player, level, collisionEngine, update) {
	console.error("Spawn bomb here!");

	level.placeBomb(this.x, this.y);
}

module.exports = SpawnBombAction;
