"use strict";

function SoundManager(assetLoader, success, error) {
	var self = this;
	var assetsToDecode = 0;
	var allOk = true;

	this.assetLoader = assetLoader;
	this.sounds = {};

	var AudioContext = AudioContext || webkitAudioContext;
	this.context = new AudioContext();

	assetLoader.getNames().forEach(function(assetName) {
		if(assetName.substr(0,4) === "snd-") {
			assetsToDecode++;
		}
	});

	// load all assets prefixed with snd-
	assetLoader.getNames().forEach(function(assetName) {
		if(assetName.substr(0,4) === "snd-") {
			console.log("Sound Manager: Decoding sound", assetName);

			self.context.decodeAudioData(assetLoader.get(assetName), 
			function(buffer) {
				if(!buffer) {
					console.error("Error decoding audio '" + assetName + "'");
					return;
				}

				self.sounds[assetName] = buffer;
				console.log("Successfully loaded " + assetName);
				assetsToDecode--;

				if(assetsToDecode === 0) {
					if(allOk) {
						success(self);
					}
					else {
						error(self);
					}
				}
			},
			function(error) {
				console.error("Error decoding audio '" + assetName + "':", error);
				assetsToDecode--;
				allOK = false;
				if(assetsToDecode === 0) {
					error();
				}
			});
		}
	});
}

SoundManager.prototype.getBuffer = function(name) {
	if(!this.sounds[name])
		throw new Error("No sound matching name found: " + name);

	return this.sounds[name];
};

SoundManager.prototype.getContext = function() {
	return this.context;
};
