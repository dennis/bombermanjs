"use strict";

ActorFactory.register('player0', function(actors, pos) {
	return new Bomberman(actors, pos, 'player0');
});
ActorFactory.register('player1', function(actors, pos) {
	return new Bomberman(actors, pos, 'player1');
});
ActorFactory.register('player2', function(actors, pos) {
	return new Bomberman(actors, pos, 'player2');
});
ActorFactory.register('player3', function(actors, pos) {
	return new Bomberman(actors, pos, 'player3');
});

function Bomberman(actors, initialPos, actorKind) {
	this.kind = actors.actorKind[actorKind];

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

	// show snapXYToTileXY
	{
		var level = window.game.level;
		var tileXY = level.snapXYToTileXY(this.realPos, context);
	}
};

Bomberman.prototype.logic = function(game) {
	this.performActions(game.level);

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

Bomberman.prototype.killed = function(game) {
	var self = this;
	this.alive = false;
	game.level.actors.removeActor(this);

	game.inSecondsDo(3, function() {
		self.alive = true;
		game.level.actors.addActor(self);
	});
};
