function Bomb(name, kind, data) {
	this.name = name;
	this.kind = kind;
	this.x = data.x;
	this.y = data.y;
};

Bomb.prototype = new Actor();

Bomb.prototype.draw = function(context, tileSet, interpolation, ticks) {
	tile = this.kind.get(undefined, ticks);

	tileSet.draw(context, this.x, this.y, tile);
}

