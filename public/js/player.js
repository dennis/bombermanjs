"use strict";

function Player(name, kind, data) {
	var initialPos = new Point(data.x, data.y);

	this.name = name;
	this.kind = kind;
	this.lastPos = initialPos.clone();
	this.pos = initialPos.clone();
	this.realPos = initialPos.clone(); // where we visually are between lastPos and pos
	this.animationState = {};
	this.direction = null;
	this.lastDirection = "down";

	this.kind.resetAll(this.animationState, 0);
};

Player.prototype = new Actor();

Player.prototype.draw = function(context, tileSet, interpolation, ticks) {
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

Player.prototype.logic = function(level) {
	this._act(level);

	if(this.direction) {
		this.lastDirection = this.direction;
	}
};

Player.prototype._act = function(level) {
	var action;

	if(this.direction) {
		action = new MoveAction(this.direction);

		action.execute(this, level);
	}
};

Player.prototype.update = function(data) {
	this.newState = data.state;
};

