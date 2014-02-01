"use strict";

ActorFactory.register('explosion', function(game, pos) {
	return new Explosion(game, pos);
});

function Explosion(game, pos) {
	var spriteNames = [ "up", "down", "right", "left", "horizontal", "vertical", "center"];
	this.sprites = {};
	this.game = game;
	var self = this;

	spriteNames.forEach(function(spriteName) {
		self.sprites[spriteName] = game.spriteManager.get("explosion-" + spriteName);
	});
	this.spriteState = new SpriteState();
	this.pos = pos;
	this.flames = null;
	this.logicCount = 0;
	this.lethalTiles = undefined;
};

Explosion.prototype = new Actor();

Explosion.prototype.setLethalFlames = function(flames) {
	this.flames = flames;
};

Explosion.prototype.draw = function(context, tileSet, interpolation, ticks, level) {
	var tile = this.sprites["center"].get(this.spriteState, ticks);

	var tileX = this.pos.x/level.getTileWidth();
	var tileY = this.pos.y/level.getTileHeight();

	var self = this;
	Object.keys(Point.DIRECTIONS).forEach(function(direction) {
		var vector = Point.DIRECTIONS[direction];
		var i = 0;
		var pos = new Point(tileX, tileY);

		tile = self.sprites[direction].get(self.spriteState, ticks);

		for(i = 0; i < self.flames[direction]; i++) {
			pos = pos.add(vector);

			if(i+1 == self.flames[direction]) {
				tile = self.sprites[direction].get(self.spriteState, ticks);
			}
			else if(vector.x != 0) {
				tile = self.sprites['horizontal'].get(self.spriteState, ticks);
			}
			else {
				tile = self.sprites['vertical'].get(self.spriteState, ticks);
			}

			tileSet.draw(context, pos.x*level.getTileWidth(), pos.y*level.getTileHeight(), tile);
		}
	});

	tile = this.sprites['center'].get(this.spriteState, ticks);
	tileSet.draw(context, this.pos.x, this.pos.y, tile);
};

Explosion.prototype.logic = function() {
	var self = this;
	var level = this.game.level;

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
			var tileXY = level.snapXYToTileXY(otherActor.pos);

			if(self.lethalTiles[(tileXY.y * level.getHeight())+tileXY.x]) {
				(new KillActorAction(otherActor, self)).execute(game);
			}
		}
	});
};
