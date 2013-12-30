// main
var socket = io.connect(document.location.origin);
var level = null;
var levelMap = null; // only made public for debuggin

// keyboard handling
KEY_CODES = {
	32: 'space',
	37: 'left', 
	38: 'up',
	39: 'right',
	40: 'down',
}

KEY_STATUS = {};
resetKeys();
function resetKeys() {
	for(code in KEY_CODES) {
		KEY_STATUS[KEY_CODES[code]] = false;
	}
}

document.onkeydown = function(e) {
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
	if(KEY_CODES[keyCode]) {
		e.preventDefault();
		KEY_STATUS[KEY_CODES[keyCode]] = true;
	}
}
document.onkeyup = function(e) {
	var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
	if(KEY_CODES[keyCode]) {
		e.preventDefault();
		KEY_STATUS[KEY_CODES[keyCode]] = false;
	}
}

function actionsToServer() {
	for(code in KEY_CODES) {
		if(KEY_STATUS[KEY_CODES[code]]) {
			socket.emit('actor-action', KEY_CODES[code]);
			return;
		}
	}
}

var keyboardAnnoucer = setInterval(actionsToServer, 1000/3);

socket.on('new-level', function (data) {
	levelMap = data;
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
	level.actorUpdate(state);
});
socket.on('message', function(text) {
	console.error(text);
});


var game = new Game();

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
