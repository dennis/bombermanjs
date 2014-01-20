"use strict";

// main
var socket = io.connect(document.location.origin);
var level = null;
var input = new InputManager();
var message = document.getElementById('messages');
var joinBtn = document.getElementById('join');
var leaveBtn = document.getElementById('leave');

joinBtn.onclick = function() {
	socket.emit('join');
};

leaveBtn.onclick = function() {
	socket.emit('leave');
};

input.attach();

console.log("Setting up events");
socket.on('new-level', function (levelMap) {
	console.log("EVENT: new-level");

	// load asset
	var tilesImg = new Image();
	tilesImg.src = levelMap.tilesets[0].image;
	tilesImg.onload = function() {
		console.log("Graphics loaded: ", tilesImg);
		var tileSet = new TileSet(levelMap.tilesets[0], tilesImg);
		level = new Level(levelMap, tileSet, 'background', 'actors', 'statusbar');
		socket.emit('new-level-done');
	}
});

socket.on('actor-update', function(state) {
	console.log("EVENT: actor-update");
	if(level)
		level.actorUpdate(state);
});
socket.on('new-actor', function(data) {
	console.log("EVENT: new-actor");
	level.newActor(data);
});
socket.on('del-actor', function(data) {
	console.log("EVENT: del-actor");
	level.delActor(data);
});
socket.on('message', function(text) {
	message.innerHTML = text + "<br />" + message.innerHTML;
});
socket.on('observing', function(data) {
	console.log("EVENT: observing");
	message.innerHTML = "We're observing" + "<br />" + message.innerHTML;
});
socket.on('scoreboard', function(data) {
	console.log("EVENT: scoreboard", data);
	level.statusbar.updateScoreboard(data);
});

function sendActions() {
	var key = input.getKey();
	if(key) {
		socket.emit('actor-action', key);
	}
}

var game = new Game(input);
game.addRender(function(i,t) { if(level) level.render(i,t); });
game.addLogic(function() { if(level) level.logic(); });
game.addLogic(function() { sendActions(); });
renderer();
