var Client = require('./client.js');

function ClientManager() {
	this.clients = {};
};

ClientManager.prototype.newClient = function(socket, level, players, broadcast, sendMessage) {
	return this.clients[socket.id] = new Client(socket, level, players, broadcast, sendMessage);
};

ClientManager.prototype.removeClient = function(client) {
	if(this.clients[client.socket.id].player)
		this.clients[client.socket.id].player.reset();
	delete this.clients[client.socket.id];
};

ClientManager.prototype.getClient = function(socket) {
	return this.clients[socket.id];
};

ClientManager.prototype.getClients = function() {
	return this.clients;
};

module.exports = ClientManager;

