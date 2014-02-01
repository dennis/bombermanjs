function Error(message) {
	this.message = message;
};

Error.prototype.toString = function() {
	return this.message;
};
