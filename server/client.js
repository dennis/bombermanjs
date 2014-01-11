var Stately = require('stately.js');
var Protocol = require('./protocol.js');

function Client(socket, world) {
	this.player = null;
	this.socket = socket;
	this.protocol = new Protocol(this, world); 

	var self = this;

	this.state = Stately.machine(
		{	
			'PRECONNECT': {
				'connecting': function() {
					self.protocol.sendLevel();
					return this.CONNECTED;
				}
			},
			'CONNECTED': {
				'doneLoadingLevel': function(client) {
					self.protocol.sendAllActors();
					self.protocol.sendMessage('observing');
					return this.OBSERVING;
				}
			},
			'OBSERVING': {
				'join': function() {
					if(self.protocol.join())
						return this.PLAYING;
					else
						return this.OBSERVING;
				}
			},
			'PLAYING': {
				'leave': function(client) {
					self.protocol.leave();
					return this.OBSERVING;
				}
			}
		}, 
		'PRECONNECT'
	);
	this.state.bind(function(event, oldState, newState) {
		console.log("State change: ", event, oldState, newState);
	});

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

