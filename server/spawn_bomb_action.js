var Bomb = require('./bomb.js');

function SpawnBombAction(x, y) {
	this.x = x;
	this.y = y;
}
SpawnBombAction.prototype.execute = function(player, world, update) {
	var lowX = Math.floor(this.x / world.level.getTileWidth());
	var lowY = Math.floor(this.y / world.level.getTileHeight());
	var highX = Math.ceil(this.x / world.level.getTileWidth());
	var highY = Math.ceil(this.y / world.level.getTileHeight());

	// Determine the best location for bomb (snap to a tile)
	var x = highX;
	var y = highY;
	if(this.x - lowX < highX - this.x)
		x = lowX;
	if(this.y - lowY < highY - this.y)
		y = lowY;

	x *= world.level.getTileWidth();
	y *= world.level.getTileHeight();
		
	world.dropBombAt(x, y);
}

module.exports = SpawnBombAction;
