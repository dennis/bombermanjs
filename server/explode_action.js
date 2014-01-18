var Bomb = require('./bomb.js');


function ExplodeAction(bomb) {
	this.bomb = bomb;
}

ExplodeAction.prototype.execute = function(bomb, world) {
	world.removeBomb(this.bomb);
}

module.exports = ExplodeAction;
