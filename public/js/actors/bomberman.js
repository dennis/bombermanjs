"use strict";

ActorFactory.register('player0', function(game, pos) {
	return new Bomberman(game, pos, 'bomberman0');
});
ActorFactory.register('player1', function(game, pos) {
	return new Bomberman(game, pos, 'bomberman1');
});
ActorFactory.register('player2', function(game, pos) {
	return new Bomberman(game, pos, 'bomberman2');
});
ActorFactory.register('player3', function(game, pos) {
	return new Bomberman(game, pos, 'bomberman3');
});

function Bomberman(game, initialPos, spritePrefix) {
	var spriteNames = [ "up", "down", "right", "left", "walk-up", "walk-down", "walk-left", "walk-right" ];
	this.game = game;
	this.sprites = {};
	var self = this;

	spriteNames.forEach(function(spriteName) {
		self.sprites[spriteName] = game.spriteManager.get(spritePrefix + "-" + spriteName);
	});

	this.lastPos = initialPos.clone();
	this.pos = initialPos.clone();
	this.realPos = initialPos.clone(); // where we visually are between lastPos and pos

	this.spriteState = new SpriteState(game.getTick());
	this.direction = null;
	this.lastDirection = "down";
	this.bombCount = 0;
};

Bomberman.prototype = new Actor();

Bomberman.prototype.draw = function(context, tileSet, interpolation, ticks) {
	var direction = this.direction || this.lastDirection;
	var diff;

	if(this.direction == this.lastDirection) {
		direction = 'walk-' + direction;
		diff = this.pos.sub(this.lastPos);

		if(!this.pos.isEqualTo(this.realPos)) {
			this.realPos.x = this.lastPos.x + Math.ceil(diff.x * interpolation);
			this.realPos.y = this.lastPos.y + Math.ceil(diff.y * interpolation);
		}
	}

	if(!this.sprites[direction])
		throw new Error("Unknown direction " + direction);
	var tile = this.sprites[direction].get(this.spriteState, ticks);

	tileSet.draw(context, this.realPos.x, this.realPos.y, tile);
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

Bomberman.prototype.killed = function() {
	var self = this;
	this.alive = false;
	this.game.level.actors.removeActor(this);
	this.game.actorDied(this);
};
