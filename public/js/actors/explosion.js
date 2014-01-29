"use strict";

ActorFactory.register('explosion', function(actors, pos) {
	return new Explosion(actors, pos);
});

function Explosion(actors, pos) {
	this.kind = actors.actorKind['explosion'];
	this.pos = pos;
	this.animationState = undefined;
	this.flames = null;
	this.logicCount = 0;
	this.lethalTiles = undefined;
};

Explosion.prototype = new Actor();

Explosion.prototype.setLethalFlames = function(flames) {
	this.flames = flames;
};

Explosion.prototype.draw = function(context, tileSet, interpolation, ticks, level) {
	if(this.animationState == undefined) {
		this.animationState = {};
		this.kind.resetAll(this.animationState, ticks);
	}
	var tile = this.kind.get(this.animationState, "center", ticks);

	var tileX = this.pos.x/level.getTileWidth();
	var tileY = this.pos.y/level.getTileHeight();

	var self = this;
	Object.keys(Point.DIRECTIONS).forEach(function(direction) {
		var vector = Point.DIRECTIONS[direction];
		var i = 0;
		var pos = new Point(tileX, tileY);

		tile = self.kind.get(self.animationState, direction, ticks);

		for(i = 0; i < self.flames[direction]; i++) {
			pos = pos.add(vector);

			if(i+1 == self.flames[direction]) {
				tile = self.kind.get(self.animationState, direction, ticks);
			}
			else if(vector.x != 0) {
				tile = self.kind.get(self.animationState, "horizontal", ticks);
			}
			else {
				tile = self.kind.get(self.animationState, "vertical", ticks);
			}

			tileSet.draw(context, pos.x*level.getTileWidth(), pos.y*level.getTileHeight(), tile);
		}
	});

	tile = this.kind.get(this.animationState, "center", ticks);
	tileSet.draw(context, this.pos.x, this.pos.y, tile);
};

Explosion.prototype.logic = function(game) {
	var self = this;
	var level = game.level;

	this.logicCount++;

	if(this.logicCount == GameLoop.logic_rate/2) {
		level.actors.removeActor(this);
		return;
	}

	if(this.lethalTiles == undefined) {
		// build lethal tiles
		this.lethalTiles = new Array(level.getWidth()*level.getHeight());

		var tileX = this.pos.x/level.getTileWidth();
		var tileY = this.pos.y/level.getTileHeight();
		var totalX = level.getWidth()+1;
		var totalY = level.getHeight()+1;
		this.lethalTiles[tileY*level.getHeight()+tileX] = true;

		// populating tiles
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
					self.lethalTiles[pos.y*level.getHeight()+pos.x] = true;
					pos = pos.add(vector);
				}
			}
		});
	}

	level.actors.actors.forEach(function(otherActor) {
		if(otherActor !== self) {
			var lowX = Math.floor(otherActor.pos.x / level.getTileWidth());
			var lowY = Math.floor(otherActor.pos.y / level.getTileHeight());
			var highX = Math.ceil(otherActor.pos.x+1 / level.getTileWidth());
			var highY = Math.ceil(otherActor.pos.y+1 / level.getTileHeight());

			// snap actor to grid (if he is partially in a tile that is lethal, he might get to live after all)
			var x = highX;
			var y = highY;
			if(Math.abs(otherActor.pos.x - lowX) > Math.abs(highX - otherActor.pos.x))
				x = lowX;
			if(Math.abs(otherActor.pos.y - lowY) > Math.abs(highY - otherActor.pos.y))
					y = lowY;

			if(self.lethalTiles[(y * level.getHeight())+x]) {
				(new KillActorAction(otherActor, self)).execute(game);
			}
		}
	});
};
