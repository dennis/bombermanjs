var Bomb = require('./bomb.js');

function SpawnBombAction(x, y) {
	this.x = x;
	this.y = y;
}
SpawnBombAction.prototype.execute = function(player, world, update) {
	world.dropBombAt(this.x, this.y);
}

module.exports = SpawnBombAction;
