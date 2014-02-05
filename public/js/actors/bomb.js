"use strict";

Factory.register('bomb', function(game, pos) {
	return new Bomb(game, pos);
});

function Bomb(game, pos, owner) {
	this.game = game;
	this.sprite = game.spriteManager.get('bomb');
	this.explosionSfx = game.factory.new('explosionsfx');
	this.pos = pos;
	this.spriteState;
	this.owner = owner;
	this.logicCount = 0;
};

Bomb.prototype = new Actor();

Bomb.prototype.draw = function(context, tileSet, interpolation, ticks) {
	if(!this.spriteState)
		this.spriteState = new SpriteState(ticks);
	var tile = this.sprite.get(this.spriteState, ticks);

	tileSet.draw(context, this.pos.x, this.pos.y, tile);
};

Bomb.prototype.logic = function(game) {
	this.logicCount++;

	if(GameLoop.logic_rate * 1.5 === this.logicCount) {
		(new ExplodeAction(this)).execute(game);
	}
};

Bomb.prototype.setOwner = function(actor) {
	this.owner = actor;
};

Bomb.prototype.beforeAddActor = function() {
	this.owner.addBomb(this);
};

Bomb.prototype.beforeRemoveActor = function() {
	this.owner.removeBomb(this);
	this.explosionSfx.start();
};

Bomb.prototype.killed = function(game) {
	(new ExplodeAction(this)).execute(game);
};
