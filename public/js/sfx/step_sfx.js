"use strict";

Factory.register('stepsfx', function(game) {
	return new StepSfx(game.soundManager);
});

function StepSfx(soundManager) {
	this.context = soundManager.getContext();
	this.buffer = soundManager.getBuffer('snd-step');
	this.timeoutId = null;
}

StepSfx.prototype._makeSound = function() {
	var compressorNode = this.context.createDynamicsCompressor();
	compressorNode.connect(this.context.destination);

	this.source = this.context.createBufferSource();
	this.source.buffer = this.buffer;
	this.source.connect(compressorNode);
	this.source.start();
	var self = this;
	this.timeoutId = setTimeout(function() {
		self._makeSound();
	}, 250);
};

StepSfx.prototype.start = function() {
	if(this.timeoutId === null)
		this._makeSound();
};

StepSfx.prototype.stop = function() {
	clearTimeout(this.timeoutId);
	this.timeoutId = null;
};

