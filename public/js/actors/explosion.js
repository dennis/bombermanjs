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

Explosion.prototype.logic = function(level) {
	this.logicCount++;

	if(this.logicCount == GameLoop.logic_rate/2)
		level.actors.removeActor(this);
};
