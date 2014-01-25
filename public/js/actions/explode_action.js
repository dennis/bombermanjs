function ExplodeAction(bomb) {
	this.bomb = bomb;
	this.explosion = undefined;
}

ExplodeAction.prototype.execute = function(level) {
	if(this.explosion != undefined)
		return;
	// calculate how many tiles the darting flame should be
	var tileX = this.bomb.pos.x/level.getTileWidth();
	var tileY = this.bomb.pos.y/level.getTileHeight();
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
			else {
				step++;
				pos = pos.add(vector);
			}
		}

		result[dir] = step;
	});

	this.explosion = new Explosion(this.bomb, result.up, result.right, result.down, result.left);
	level.actors.removeActor(this.bomb);
	//level.addActor(this.explosion);
};

