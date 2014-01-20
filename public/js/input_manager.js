"use strict";

function InputManager() {
	this.KEY_CODES = {
		32: 'space',
		37: 'left', 
		38: 'up',
		39: 'right',
		40: 'down',
	}

	this.KEY_STATUS = {};
	this.resetKeys();

	this.oldonkeydown = null;
	this.oldonkeyup = null;
}
InputManager.prototype.resetKeys = function() {
	for(var code in this.KEY_CODES) {
		this.KEY_STATUS[this.KEY_CODES[code]] = false;
	}
}
InputManager.prototype.onkeydown = function(e) {
	var self = this;
	return function(e) {
		var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
		if(self.KEY_CODES[keyCode]) {
			e.preventDefault();
			self.KEY_STATUS[self.KEY_CODES[keyCode]] = true;
		}
	}
}
InputManager.prototype.onkeyup = function(e) {
	var self = this;
	return function(e) {
		var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
		if(self.KEY_CODES[keyCode]) {
			e.preventDefault();
			self.KEY_STATUS[self.KEY_CODES[keyCode]] = false;
		}
	}
}
InputManager.prototype.attach = function() {
	this.oldonkeydown = document.onkeydown;
	this.oldonkeyup = document.onkeyup;

	document.onkeydown = this.onkeydown();
	document.onkeyup = this.onkeyup();
}

InputManager.prototype.detach = function() {
	document.onkeydown = this.oldonkeydown;
	document.onkeyup = this.oldonkeyup;

	this.oldonkeyup = null;
	this.oldonkeydown = null;
}

InputManager.prototype.getKey = function() {
	for(var code in this.KEY_CODES) {
		if(this.KEY_STATUS[this.KEY_CODES[code]]) {
			this.KEY_STATUS[this.KEY_CODES[code]] = false;
			return this.KEY_CODES[code];
		}
	}
}

