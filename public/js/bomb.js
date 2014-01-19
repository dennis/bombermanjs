function Bomb(name, kind, data) {
	this.name = name;
	this.kind = kind;
	this.x = data.x;
	this.y = data.y;
	this.animationState = undefined;
};

Bomb.prototype = new Actor();

Bomb.prototype.draw = function(context, tileSet, interpolation, ticks) {
	if(this.animationState == undefined) {
		this.animationState = {};
		this.kind.resetAll(this.animationState, ticks);
	}
	tile = this.kind.get(this.animationState, undefined, ticks);

	tileSet.draw(context, this.x, this.y, tile);
};

