var Point = require('./point.js');

function MoveAction(direction) {
	this.direction = direction;
}

MoveAction.prototype.execute = function(player, level, collisionEngine, update) {
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
		x = (level.getWidth()-1)*level.getTileWidth();
	if(x > (level.getWidth()-1)*level.getTileWidth())
		x = 0;
	if(y < 0)
		y = (level.getHeight()-1)*level.getTileHeight();
	if(y > (level.getHeight()-1)*level.getTileHeight())
		y = 0;

	player.requestedAction = null;

	var lowX = Math.floor(x / level.getTileWidth());
	var lowY = Math.floor(y / level.getTileHeight());
	var highX = Math.ceil(x / level.getTileWidth());
	var highY = Math.ceil(y / level.getTileHeight());

	var collision = false;
	[lowX,highX].forEach(function(x) {
		[lowY, highY].forEach(function(y) {
			if(collisionEngine.isBlocked(new Point(x, y))) {
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

	update.push({
		actor: player.name,
		state: player.state
	});
}

module.exports = MoveAction;

