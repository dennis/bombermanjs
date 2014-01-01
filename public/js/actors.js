function Actors(canvasId, mapWidth, mapHeight, tileSet) {
	this.tileSet = tileSet;
	this.actors = [];
	this.actorIdx = {};
	this.actorKinds = {};

	this.init(canvasId, mapWidth, mapHeight);
}

Actors.prototype = new CanvasManager();

Actors.prototype.populate = function(layer, levelMap) {
	/*
	for(var pos = 0; pos < layer.data.length; pos++) {
		if(layer.data[pos] != 0) {
			var xy = this.tileSet.toXY(pos);
			var name = levelMap.tilesets[0].tileproperties[layer.data[pos]-1].type;
			this.actors.push(new Actor(name, layer.data[pos]));
			this.actorIdx[name] = this.actors.length-1;
			console.log("  Found actor "+name+" at " + xy + " using tile-" + layer.data[pos]);
		}
	}
	*/

	var self = this;
	Object.keys(levelMap.tilesets[0].tileproperties).forEach(function(tileNum) {
		var properties = levelMap.tilesets[0].tileproperties[tileNum];
		if(!self.actorKinds[properties.type]) {
			self.actorKinds[properties.type] = new ActorKind();
		}
		
		self.actorKinds[properties.type].addTileSubtype(tileNum, properties.subtype);
	});

	console.log(this.actorKinds);
}

Actors.prototype.draw = function(tileSet, interpolation) {
	var that = this;
	this.actors.forEach(function(actor) {
		actor.draw(that.context, tileSet, interpolation);
	});
}

Actors.prototype.logic = function() {
	var that = this;
	this.actors.forEach(function(actor) {
		actor.logic();
	});
}

Actors.prototype.update = function(dataSet) {
	var that = this;

	dataSet.forEach(function (data) {
		var actor = that.actors[that.actorIdx[data.actor]];
		if(actor)
			actor.update(data);
		else
			console.error("Cannot find actor " +  data.actor);
	});
}

Actors.prototype.spawn = function(data) {
	console.log("need to spawn actor", data);

	this.actors.push(new Actor(data.id, this.actorKinds[data.actor]));
	this.actorIdx[data.id] = this.actors.length-1;
};
