"use strict";

function Bomberman(name, kind, data) {
	var initialPos = new Point(data.x, data.y);

	this.name = name;
	this.kind = kind;
	this.lastPos = initialPos.clone();
	this.pos = initialPos.clone();
	this.realPos = initialPos.clone(); // where we visually are between lastPos and pos
	this.animationState = {};
	this.direction = null;
	this.lastDirection = "down";
	this.bombCount = 0;

	this.kind.resetAll(this.animationState, 0);
};

Bomberman.prototype = new Actor();

Bomberman.prototype.draw = function(context, tileSet, interpolation, ticks) {
	var direction = this.direction || this.lastDirection;
	var diff = this.pos.sub(this.lastPos);

	if(this.direction == this.lastDirection) {
		direction = 'walk-' + direction;

		if(!this.pos.isEqualTo(this.realPos)) {
			this.realPos.x = this.lastPos.x + Math.ceil(diff.x * interpolation);
			this.realPos.y = this.lastPos.y + Math.ceil(diff.y * interpolation);
		}
	}

	var tile = this.kind.get(this.animationState, direction, ticks);

	tileSet.draw(context, this.realPos.x, this.realPos.y, tile);
};

Bomberman.prototype.logic = function(level) {
	this.performActions(level);

	if(this.direction) {
		this.lastDirection = this.direction;
	}
};

Bomberman.prototype.update = function(data) {
	this.newState = data.state;
};

Bomberman.prototype.canDropBomb = function() {
	return this.bombCount < 3;
};

Bomberman.prototype.addBomb = function() {
	this.bombCount++;
};

Bomberman.prototype.removeBomb = function() {
	this.bombCount--;
};

