var server_port = 8888;
var express = require('express')
	, app = express()
	, server = require('http').createServer(app)
	, io = require('socket.io').listen(server)
	, fs = require('fs');

var Client = require('./client.js')
	, World = require('./world.js')
	, Client = require('./client.js');

server.listen(server_port);
app.use(express.static(__dirname + '/../public'));
app.use(express.logger());

console.log("Server running on port " + server_port);
console.log("Serving " + __dirname + '/../public');

var world = new World(__dirname + '/../levels/level.json', 
	// broadcaster
	function(name, payload) {
		io.sockets.emit(name, payload);
	},
	// to single client
	function(socket, name, payload) {
		console.log("direct message", socket, name, payload);
		console.log(socket);
		socket.emit(name, payload);
	}
);

io.sockets.on('connection', function(socket) {
	var client = world.newClient(socket, io);

	socket.on('new-level-done', function() {
		world.clientDoneLoadingLevel(client);
	});

	socket.on('join', function() {
		world.clientJoin(client);
	});
	socket.on('leave', function() {
		world.clientLeave(client);
	});

	socket.on('actor-action', function (direction) {
		world.clientActorAction(client, direction);
	});

	socket.on('disconnect', function() {
		world.removeClient(client);
	});
});
