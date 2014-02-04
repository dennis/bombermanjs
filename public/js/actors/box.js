"use strict";

ActorFactory.register('box', function(game, pos) {
	return new Box(game, pos);
});

function Box(game, pos) {
	this.game = game;
	this.sprite = game.spriteManager.get('box');
	this.pos = pos;
	this.spriteState;
	this.tilesetXY;
};

Box.prototype = new Actor();

Box.prototype.beforeAddActor = function() {
	// As the collision engine only works in tiles, box needs to be placed 100% matching a tile
	this.tilesetXY = new Point(this.pos.x/this.game.level.getTileWidth(), this.pos.y/this.game.level.getTileHeight());

	this.game.level.collisionEngine.set(this.tilesetXY, this);
};

Box.prototype.beforeRemoveActor = function() {
	this.game.level.collisionEngine.set(this.tilesetXY, false);
};

Box.prototype.draw = function(context, tileSet, interpolation, ticks) {
	if(!this.spriteState)
		this.spriteState = new SpriteState(ticks);
	var tile = this.sprite.get(this.spriteState, ticks);

	tileSet.draw(context, this.pos.x, this.pos.y, tile);
};

Box.prototype.killed = function(game) {
	this.game.level.actors.removeActor(this);
};

Box.prototype.isBlocking = function(game, otherActor) { // got hit
	var self = this;
	this.game.inSecondsDo(0.5, function() {
		self.killed(game);
	});
	return true;
};
