var Bomb = require('./bomb.js');
var Explosion = require('./explosion.js');
var Point = require('../public/js/point.js');


function ExplodeAction(bomb) {
	this.bomb = bomb;
}

ExplodeAction.prototype.execute = function(bomb, world) {
	// calculate how many tiles the darting flame should be
	var tileX = bomb.getX()/world.level.getTileWidth();
	var tileY = bomb.getY()/world.level.getTileHeight();
	var totalX = world.level.getWidth()+1;
	var totalY = world.level.getHeight()+1;

	var result = {};
	var self = this;
	Object.keys(Point.DIRECTIONS).forEach(function(dir) {
		var pos = new Point(tileX, tileY);
		var vector = Point.DIRECTIONS[dir];
		var step = 0;
		
		pos = pos.add(vector);
		while(pos.x >= 0 && pos.x < totalX && pos.y >=0 && pos.y < totalY) {
			if(world.collisionEngine.isBlocked(pos)) {
				break;
			}
			else {
				step++;
				pos = pos.add(vector);
			}
		}

		result[dir] = step;
	});

	world.removeActor(this.bomb);
	world.addActor(new Explosion(this.bomb, result.up, result.right, result.down, result.left));
}

module.exports = ExplodeAction;
