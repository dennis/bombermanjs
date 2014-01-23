"use strict";

var game = new Game();

// main
$.ajax('/levels/level.json', {
	success: function(data) {
		game.parseLevel(data);
		game.run();
	}
});

/*
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

*/
