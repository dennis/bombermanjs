var ActorState = require(__dirname + '/../public/js/actor_state.js')
	, Player = require('./player.js')
	, Point = require('./point.js');

function Level(levelMap) {
	levelMap.tilesets[0].image = levelMap.tilesets[0].image.substring(9); // strip "../public/
	this.levelMap = levelMap;
};

Level.prototype.getWidth = function() {
	return this.levelMap.width;
};

Level.prototype.getHeight = function() {
	return this.levelMap.height;
};

Level.prototype.getTileWidth = function() {
	return this.levelMap.tilewidth;
};

Level.prototype.getTileHeight = function() {
	return this.levelMap.tileheight;
};

Level.prototype.findPlayers = function() {
	var players = {};
	for(var i = 0; i < this.levelMap.layers.length; i++) {
		var layer = this.levelMap.layers[i];
		if(layer.type == "tilelayer" && layer.properties && layer.properties.type == "spawn") {
			for(var j = 0; j < layer.data.length; j++) {
				if(layer.data[j] != "0") {
					var type = this.levelMap.tilesets[0].tileproperties[layer.data[j]-1].type;

					var x = j % this.getWidth();
					var y = (j-x) / this.getWidth();

					var state = new ActorState();
					state.x = x * this.getTileWidth();
					state.y = y * this.getTileHeight();

					players[type] = new Player(type, state.x, state.y);
				}
			}
		}
	}

	return players;
};

Level.prototype.populateCollisionEngine = function(collisionEngine) {
	for(var i = 0; i < this.levelMap.layers.length; i++) {
		var layer = this.levelMap.layers[i];

		if(layer.type == "tilelayer" && layer.properties && layer.properties.type == "blocking") {
			for(var j = 0; j < layer.data.length; j++) {
				if(layer.data[j] != 0) { 
					var x = j % this.levelMap.width;
					var y = (j-x) / this.levelMap.width;

					collisionEngine.set(new Point(x, y));
				}
			}
		}
	}
};

Level.prototype.getJson = function() {
	return this.levelMap;
};

module.exports = Level;
