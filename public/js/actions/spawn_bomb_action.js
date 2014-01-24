
function SpawnBombAction(pos, actor) {
	this.pos = pos;
	this.actor = actor;
}

SpawnBombAction.prototype.execute = function(level) {
	if(!this.actor.canDropBomb())
		return;

	var lowX = Math.floor(this.pos.x / level.getTileWidth());
	var lowY = Math.floor(this.pos.y / level.getTileHeight());
	var highX = Math.ceil(this.pos.x / level.getTileWidth());
	var highY = Math.ceil(this.pos.y / level.getTileHeight());

	// Determine the best location for bomb (snap to a tile)
	var x = highX;
	var y = highY;
	if(Math.abs(this.pos.x - lowX) < Math.abs(highX - this.pos.x))
		x = lowX;
	if(Math.abs(this.pos.y - lowY) < Math.abs(highY - this.pos.y))
		y = lowY;

	x *= level.getTileWidth();
	y *= level.getTileHeight();
		
	level.actors.addActor(new Bomb(level.actors.actorKind['bomb'], new Point(x, y), this.actor));
};
