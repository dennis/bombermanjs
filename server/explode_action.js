var Bomb = require('./bomb.js');
var Explosion = require('./explosion.js');


function ExplodeAction(bomb) {
	this.bomb = bomb;
}

ExplodeAction.prototype.execute = function(bomb, world) {
	world.removeActor(this.bomb);
	world.addActor(new Explosion(this.bomb));
}

module.exports = ExplodeAction;
