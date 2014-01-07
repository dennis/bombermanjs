var Stately = require('stately.js');

function Client(socket, level, players, io) {
	this.player = null;
	this.socket = socket;

	this.state = Stately.machine(
		{	
			'PRECONNECT': {
				'connecting': function(client) {
						client.socket.emit('new-level', level );
					return this.CONNECTED;
				}
			},
			'CONNECTED': {
				'doneLoadingLevel': function(client) {
					Object.keys(players).forEach(function(actorName) {
						var player = players[actorName];
						client.socket.emit('new-actor', { id: player.name, actor: player.name });
					});
					client.socket.emit('observing' );
					return this.OBSERVING;
				}
			},
			'OBSERVING': {
				'join': function(client) {
					var foundFreePlayer = false;

					// find available player
					Object.keys(players).some(function(actorName) {
						var player = players[actorName];

						if(!player.isOccupied()) {
							player.occupy();
							client.player = player;
							client.socket.emit("message", "you are " + actorName);
							io.sockets.emit('new-actor', { id: player.name, actor: player.name, x: player.state.x, y: player.state.y });
							foundFreePlayer = true;
							return true;
						}
						else {
							console.log(actorName + " is in use");
							return false;
						}
					});

					if(foundFreePlayer)
						return this.PLAYING;
					else
						return this.OBSERVING;
				}
			},
			'PLAYING': {
				'leave': function(client) {
					io.sockets.emit('del-actor', { id: client.player.name });
					client.observe();				
					client.socket.emit("message", "you are now an observer");
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

