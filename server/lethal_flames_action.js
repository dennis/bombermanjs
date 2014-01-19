var Point = require('../public/js/point.js');

function LethalFlamesAction() {
	this.lethalTiles = undefined;
};

LethalFlamesAction.prototype.execute = function(actor, world) {
	// DOES NOT SUPPORT MOVING actors!
	var self = this;
	
	if(this.lethalTiles == undefined) {
		// build lethal tiles
		this.lethalTiles = new Array(world.level.getWidth()*world.level.getHeight());

		var tileX = actor.getX()/world.level.getTileWidth();
		var tileY = actor.getY()/world.level.getTileHeight();
		var totalX = world.level.getWidth()+1;
		var totalY = world.level.getHeight()+1;
		self.lethalTiles[tileY*world.level.getHeight()+tileX] = true;

		// populating tiles
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
					self.lethalTiles[pos.y*world.level.getHeight()+pos.x] = true;
					pos = pos.add(vector);
				}
			}
		});
	}
		
	Object.keys(world.actors).forEach(function(actorName) {
		var otherActor = world.actors[actorName];

		var lowX = Math.floor(otherActor.getX() / world.level.getTileWidth());
		var lowY = Math.floor(otherActor.getY() / world.level.getTileHeight());
		var highX = Math.ceil(otherActor.getX() / world.level.getTileWidth());
		var highY = Math.ceil(otherActor.getY() / world.level.getTileHeight());

		// snap actor to grid (if he is partially in a tile that is lethal, he might get to live after all)
		var x = highX;
		var y = highY;
		if(Math.abs(otherActor.getX() - lowX) < Math.abs(highX - otherActor.getX()))
			x = lowX;
		if(Math.abs(otherActor.getY() - lowY) < Math.abs(highY - otherActor.getY()))
			y = lowY;

		if(self.lethalTiles[y*world.level.getHeight()+x]) {
			// Do the kill, if possible
			console.log(actorName + " got it by lethal flames from " + actor.getId());
			if(world.actors[actorName].kill) { 
				world.actors[actorName].kill(actor);
			}
		}
	});
};

module.exports = LethalFlamesAction;

