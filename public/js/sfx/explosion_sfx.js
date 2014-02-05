"use strict";

Factory.register('explosionsfx', function(game) {
	return new ExplosionSfx(game.soundManager);
});

function ExplosionSfx(soundManager) {
	this.context = soundManager.getContext();
	this.buffer = soundManager.getBuffer('snd-explosion');
}

ExplosionSfx.prototype._makeSound = function() {
	var compressorNode = this.context.createDynamicsCompressor();
	compressorNode.connect(this.context.destination);

	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	this.source.connect(compressorNode);
	this.source.start(0, 0.4);
};

ExplosionSfx.prototype.start = function() {
	this._makeSound();
};

