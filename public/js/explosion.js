function Explosion(name, kind, data) {
	this.name = name;
	this.kind = kind;
	this.data = data;
	this.animationState = undefined;
};

Explosion.prototype = new Actor();

Explosion.prototype.draw = function(context, tileSet, interpolation, ticks, level) {
	if(this.animationState == undefined) {
		this.animationState = {};
		this.kind.resetAll(this.animationState, ticks);
	}
	var tile = this.kind.get(this.animationState, "center", ticks);

	var tileX = this.data.x/level.getTileWidth();
	var tileY = this.data.y/level.getTileHeight();

	var self = this;
	Object.keys(Point.DIRECTIONS).forEach(function(direction) {
		var vector = Point.DIRECTIONS[direction];
		var i = 0;
		var pos = new Point(tileX, tileY);

		tile = self.kind.get(self.animationState, direction, ticks);

		for(i = 0; i < self.data[direction]; i++) {
			pos = pos.add(vector);

			if(i+1 == self.data[direction]) {
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
	tileSet.draw(context, this.data.x, this.data.y, tile);
};

