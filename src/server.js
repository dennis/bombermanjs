var server_port = 8888;
var app = require('http').createServer(handler)
	, io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(server_port);

console.log("Server running on port " + server_port);

var level = require(__dirname + '/../assets/levels/level.json');

function handler(request, response) {
	console.log(request.method, request.url);
	switch(request.url) {
	case '/':
		serveFile(response, __dirname + '/index.html');
		break;
	case '/favicon.ico':
		response.writeHead(404);
		break;
	case '/img/bomb_party_v4.png':
		serveFile(response, __dirname + '/../assets/img/bomb_party_v4.png');
		break;
	}
}

function serveFile(response, filename) {
	fs.readFile(filename, function (err, data) {
			if (err) {
					response.writeHead(500);
					return response.end('Error loading index.html');
			}

			response.writeHead(200);
			response.end(data);
	});
}

io.sockets.on('connection', function (socket) {
	socket.emit('new-level', level );
});

