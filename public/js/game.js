	// CanvasManager
	function CanvasManager() {};
	CanvasManager.prototype.init = function(canvasId, mapWidth, mapHeight) {
        this.canvas = document.getElementById(canvasId);

        if(this.canvas.getContext) {
           this.context = this.canvas.getContext('2d');

		   this.canvas.width = mapWidth;
		   this.canvas.height = mapHeight;
        }
        else {
            throw new "No canvas support for element " + canvasId;
        }
	}

    function Background(canvasId, mapWidth, mapHeight, tileSet) {
		this.layers = [];
		this.tileSet = tileSet;
		this.dirty = false;

		this.init(canvasId, mapWidth, mapHeight);
	}
    Background.prototype = new CanvasManager();
	Background.prototype.populate = function(layer) {
		this.layers.push(layer);
		this.dirty = true;
	}
    Background.prototype.draw = function() {
		if(!this.dirty) {
			return;
		}

		for(var i = 0; i < this.layers.length; i++) {
			for(var pos = 0; pos < this.layers[i].data.length; pos++) {
				this.tileSet.draw(this.context,pos,this.layers[i].data[pos]-1);
			}
		}

		this.dirty = false;
    }

	// Actors
	function Actors(canvasId, mapWidth, mapHeight, tileSet) {
		this.actors = [];
		this.actorIdx = {};
		this.tileSet = tileSet;

		this.init(canvasId, mapWidth, mapHeight);
	}
	Actors.prototype = new CanvasManager();
	Actors.prototype.populate = function(layer, levelMap) {
		for(var pos = 0; pos < layer.data.length; pos++) {
			if(layer.data[pos] != 0) {
				var xy = this.tileSet.toXY(pos);
				var name = levelMap.tilesets[0].tileproperties[layer.data[pos]-1].type;
				this.actors.push(new Actor(name, layer.data[pos]));
				this.actorIdx[name] = this.actors.length-1;
				console.log("  Found actor "+name+" at " + xy + " using tile-" + layer.data[pos]);
			}
		}
	}
	Actors.prototype.draw = function(tileSet) {
		var that = this;
		this.actors.forEach(function(actor) {
			actor.draw(that.context, tileSet);
		});
	}
	Actors.prototype.update = function(newStateSet) {
		var that = this;

		// FIXME - if two actors is at the same spot - the non-moving actor is not redrawn
		
		newStateSet.forEach(function (newState) {
			var actor = that.actors[that.actorIdx[newState.actor]];
			actor.update(newState);
		});
	}

	// ActorState
	function ActorState() { 
		this.visible = false;
		this.x = 0;
		this.y = 0;
	};
	ActorState.prototype.update = function(newState) {
		this.visible = newState.visible;
		this.x = newState.x;
		this.y = newState.y;
	}
	ActorState.prototype.differentTo = function(otherState) {
		return !(this.visible == otherState.visible && this.x == otherState.x && this.y == otherState.y);
	}


	// Actor
	function Actor(name, tileNum) {
		this.name = name;
		this.tileNum = tileNum;
		this.state = new ActorState();
		this.newState = new ActorState();
	};
	Actor.prototype.draw = function(context, tileSet) {
		if(!this.state.differentTo(this.newState))
			return;

		if(this.state.visible)
			tileSet.clear(context, tileSet.fromXY({x: this.state.x, y: this.state.y}));

		this.state.update(this.newState);

		if(this.newState.visible) {
			tileSet.draw(context, tileSet.fromXY({x: this.newState.x, y: this.newState.y}), this.tileNum);
		}
	}
	Actor.prototype.update = function(newState) {
		this.newState.update(newState);
	}

	// TileSet
	function TileSet(tileSetData, sprite) {
		this.sprite = sprite;

		this.tileWidth = tileSetData.tilewidth;
		this.tileHeight = tileSetData.tileheight;

		this.cols = tileSetData.imagewidth / this.tileWidth;
		this.rows = tileSetData.imageheight / this.tileHeight;
	};

	TileSet.prototype.draw = function(context, pos, tileNum) {
		var tileXY = this.toXY(tileNum);
		var posXY = this.toXY(pos);

		context.drawImage(this.sprite, 
			tileXY.x * this.tileWidth, tileXY.y * this.tileHeight, this.tileWidth, this.tileHeight, 
			posXY.x * this.tileWidth, posXY.y * this.tileHeight, this.tileWidth, this.tileHeight);
	}
	TileSet.prototype.clear = function(context, pos) {
		var posXY = this.toXY(pos);
		context.clearRect(posXY.x * this.tileWidth, posXY.y * this.tileHeight, this.tileWidth, this.tileHeight);
	}
	TileSet.prototype.toXY = function(pos) {
		var x = pos % this.cols;
		var y = (pos - x)/ this.cols;
		return {
			x: x,
			y: y,
			toString: function() {
				return "(" + x + "," + y + ")";
			}
		}
	}
	TileSet.prototype.fromXY = function(pos) {
		return pos.y * this.cols + pos.x;
	}
	
	TileSet.prototype.getTileWidth = function() {
		return this.tileWidth;
	}

	TileSet.prototype.getTileHeight = function() {
		return this.tileHeight;
	}

    // Level
    function Level(levelMap, tileSet) {
        var mapWidth = levelMap.width*levelMap.tilewidth;
        var mapHeight = levelMap.height*levelMap.tileheight;

		this.tileSet = tileSet;
        this.background = new Background('background', mapWidth, mapHeight, tileSet);
		this.actors = new Actors('actors', mapWidth, mapHeight, tileSet);

		console.log("Loading map");

		var that = this;

		levelMap.layers.filter(function(layer) {
			return (layer.type == "tilelayer" && layer.visible && layer.properties);
		}).forEach(function(layer, i) {
			if(layer.properties.type == "background" || layer.properties.type == "blocking") {
				console.log("Loaded layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
				that.background.populate(layer);
			}
			else if(layer.properties.type == "spawn") {
				console.log("Loaded layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
				that.actors.populate(layer, levelMap);
			}
			else {
				console.error("Ignored layer #" + i + " " + layer.name + " (" + layer.properties.type + ")");
			}
		});
    };
    Level.prototype.draw = function() {
        this.background.draw(this.tileSet);
		this.actors.draw(this.tileSet);
    }
	Level.prototype.actorUpdate = function(data) {
		this.actors.update(data);
	}

    // main
    var socket = io.connect(document.location.origin);
    var level = null;
	var levelMap = null;

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
			level = new Level(levelMap, tileSet);
			console.log("ready");
			animate();
		}
    });
	socket.on('actor-update', function(state) {
		level.actorUpdate(state);
	});
	socket.on('message', function(text) {
		console.error(text);
	});

    function animate() {
        requestAnimFrame(animate);
		level.draw();
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
