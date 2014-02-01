function ExplodeAction(actor, strength) {
	this.actor = actor;
	this.explosion = undefined;
	this.strength = strength || 3;
}

ExplodeAction.prototype.execute = function(game) {
	var level = game.level;
	if(this.explosion != undefined)
		return;

	// calculate how many tiles the darting flame should be
	var tileX = this.actor.pos.x/level.getTileWidth();
	var tileY = this.actor.pos.y/level.getTileHeight();
	var totalX = level.getWidth()+1;
	var totalY = level.getHeight()+1;

	var result = {};
	var self = this;
	Object.keys(Point.DIRECTIONS).forEach(function(dir) {
		var pos = new Point(tileX, tileY);
		var vector = Point.DIRECTIONS[dir];
		var step = 0;
		
		pos = pos.add(vector);
		while(pos.x >= 0 && pos.x < totalX && pos.y >=0 && pos.y < totalY) {
			if(level.collisionEngine.isBlocked(pos)) {
				break;
			}
			else if(step == self.strength) {
				break;
			}
			else {
				step++;
				pos = pos.add(vector);
			}
		}

		result[dir] = step;
	});

	this.explosion = level.actors.factory.new('explosion', this.actor.pos);
	this.explosion.setLethalFlames(result);
	level.actors.removeActor(this.actor);
	level.actors.addActor(this.explosion);
};

