function MoveAction(actor, direction) {
	this.actor = actor;
	this.direction = direction;
}

MoveAction.prototype.execute = function(game) {
	var level = game.level;
	var x = this.actor.pos.x;
	var y = this.actor.pos.y;

	this.actor.lastPos = this.actor.pos.clone();
	this.actor.direction = this.direction;

	var step = 2;

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

	var lowX = Math.floor(x / level.getTileWidth());
	var lowY = Math.floor(y / level.getTileHeight());
	var highX = Math.ceil(x / level.getTileWidth());
	var highY = Math.ceil(y / level.getTileHeight());

	var collision = false;
	[lowX,highX].forEach(function(x) {
		[lowY, highY].forEach(function(y) {
			if(level.collisionEngine.isBlocked(new Point(x, y))) {
				collision = true;
			}
		});
	});

	if(collision) {
		return false;
	}

	this.actor.pos.x = x;
	this.actor.pos.y = y;

	return true;
};
