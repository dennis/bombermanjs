var Point = require('../public/js/point.js');

function MoveAction(direction) {
	this.direction = direction;
}

MoveAction.prototype.execute = function(player, world) {
	var x = player.state.x;
	var y = player.state.y;
	var step = 8;

	switch(this.direction) {
		case 'up': y -= step; break;
		case 'down': y += step; break;
		case 'left': x -= step; break;
		case 'right': x += step; break;
	}
	
	// boundary check
	if(x < 0)
		x = (world.level.getWidth()-1)*world.level.getTileWidth();
	if(x > (world.level.getWidth()-1)*world.level.getTileWidth())
		x = 0;
	if(y < 0)
		y = (world.level.getHeight()-1)*world.level.getTileHeight();
	if(y > (world.level.getHeight()-1)*world.level.getTileHeight())
		y = 0;

	player.requestedAction = null;

	var lowX = Math.floor(x / world.level.getTileWidth());
	var lowY = Math.floor(y / world.level.getTileHeight());
	var highX = Math.ceil(x / world.level.getTileWidth());
	var highY = Math.ceil(y / world.level.getTileHeight());

	var collision = false;
	[lowX,highX].forEach(function(x) {
		[lowY, highY].forEach(function(y) {
			if(world.collisionEngine.isBlocked(new Point(x, y))) {
				collision = true;
			}
		});
	});

	if(collision) {
		console.log("Collision!");
		return;
	}

	player.state.x = x;
	player.state.y = y;

	world.broadcast("actor-update", {
		actor: player.name,
		state: player.state
	});
}

module.exports = MoveAction;

