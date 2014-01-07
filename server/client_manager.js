var Client = require('./client.js');

function ClientManager() {
	this.clients = {};
};
ClientManager.prototype.newClient = function(socket, level, players, io) {
	return this.clients[socket.id] = new Client(socket, level, players, io);
}
ClientManager.prototype.removeClient = function(socket) {
	if(this.clients[socket.id].player)
		this.clients[socket.id].player.reset();
	delete this.clients[socket.id];
}
ClientManager.prototype.getClient = function(socket) {
	return this.clients[socket.id];
}

module.exports = ClientManager;

