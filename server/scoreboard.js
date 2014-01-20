function Scoreboard() {
	this.scores = {};
	this.dirty = true;
}

Scoreboard.prototype.enable = function(actorName) {
	this.scores[actorName] = 0;
	this.dirty = true;
}

Scoreboard.prototype.disable = function(actorName) {
	delete this.scores[actorName];
	this.dirty = true;
};

Scoreboard.prototype.died = function(actorName) {
	this.scores[actorName] = this.scores[actorName] + 1;
	this.dirty = true;
};

Scoreboard.prototype.isDirty = function() {
	return this.dirty;
};

Scoreboard.prototype.cleanDirty = function() {
	this.dirty = false;
};

Scoreboard.prototype.getCurrentState = function() {
	return this.scores;
};

module.exports = Scoreboard;
