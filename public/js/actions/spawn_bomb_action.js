
function SpawnBombAction(pos, actor) {
	this.pos = pos;
	this.actor = actor;
}

SpawnBombAction.prototype.execute = function(game) {
	var level = game.level;
	if(!this.actor.canDropBomb())
		return;

   var bombPos = game.level.snapXYToTileXY(this.pos);

	bombPos.x *= level.getTileWidth();
	bombPos.y *= level.getTileHeight();
		
	var bomb = game.factory.new('bomb', bombPos);
	bomb.setOwner(this.actor);
	level.actors.addActor(bomb);
};
