// main
var socket = io.connect(document.location.origin);
var level = null;
var input = new InputManager();
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
		renderer();
	}
});

socket.on('actor-update', function(state) {
	if(level)
		level.actorUpdate(state);
});
socket.on('message', function(text) {
	console.error(text);
});

function sendActions() {
	var key = input.getKey();
	if(key) {
		socket.emit('actor-action', key);
	}
}

var game = new Game(input);
game.addRender(function() { level.render(); });
game.addLogic(function() { sendActions(); });

function renderer() {
	requestAnimFrame(renderer);
	game.run()();
}

window.requestAnimFrame = (function(){
	return window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};
})();
