// main
var socket = io.connect(document.location.origin);
var level = null;
var input = new InputManager();
var message = document.getElementById('messages');
input.attach();

socket.on('new-level', function (levelMap) {
	console.log("EVENT: new-level");

	// load asset
	var tilesImg = new Image();
	tilesImg.src = levelMap.tilesets[0].image;
	tilesImg.onload = function() {
		console.log("Graphics loaded: ", tilesImg);
		var tileSet = new TileSet(levelMap.tilesets[0], tilesImg);
		level = new Level(levelMap, tileSet, 'background', 'actors');
		console.log("ready");
	}
});

socket.on('actor-update', function(state) {
	if(level)
		level.actorUpdate(state);
});
socket.on('message', function(text) {
	message.innerHTML = text + "<br />" + message.innerHTML;
});

function sendActions() {
	var key = input.getKey();
	if(key) {
		socket.emit('actor-action', key);
	}
}

var game = new Game(input);
game.addRender(function(i) { level.render(i); });
game.addLogic(function() { level.logic(); });
game.addLogic(function() { sendActions(); });
renderer();