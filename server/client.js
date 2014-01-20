var Stately = require('stately.js');

function Client(socket, world) {
	this.player = null;
	this.socket = socket;

	var self = this;

	this.state = Stately.machine(
		{	
			'PRECONNECT': {
				'connecting': function() {
					world.protocol.sendLevel(self);
					return this.CONNECTED;
				}
			},
			'CONNECTED': {
				'doneLoadingLevel': function() {
					world.protocol.sendAllActors(self);
					world.protocol.sendMessage(self, 'observing');
					return this.OBSERVING;
				}
			},
			'OBSERVING': {
				'join': function() {
					if(world.protocol.join(self))
						return this.PLAYING;
					else
						return this.OBSERVING;
				}
			},
			'PLAYING': {
				'leave': function() {
					world.protocol.leave(self);
					return this.OBSERVING;
				}
			}
		}, 
		'PRECONNECT'
	);
	//this.state.bind(function(event, oldState, newState) {
	//	console.log("State change: ", event, oldState, newState);
	//});

	//this.state = clone(ClientState);
}
Client.prototype.isObserver = function() {
	this.observer == null;
}
Client.prototype.isPlayer = function() {
	this.observer != null;
}
Client.prototype.observe = function() {
	this.player.reset();
	this.player = null;
}

module.exports = Client;

