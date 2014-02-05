"use strict";

ActorFactory.register('spawnsfx', function(game) {
	return new CommonSfx(game.soundManager, 'snd-spawn');
});

ActorFactory.register('gameoversfx', function(game) {
	return new CommonSfx(game.soundManager, 'snd-gameover');
});

function CommonSfx(soundManager, asset) {
	this.context = soundManager.getContext();
	this.buffer = soundManager.getBuffer(asset);
}

CommonSfx.prototype._makeSound = function() {
	var compressorNode = this.context.createDynamicsCompressor();
	compressorNode.connect(this.context.destination);

	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	this.source.connect(compressorNode);
	this.source.start();
};

CommonSfx.prototype.start = function() {
	this._makeSound();
};

