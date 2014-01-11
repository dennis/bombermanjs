function Actors(canvasId, mapWidth, mapHeight, tileSet) {
	this.tileSet = tileSet;
	this.actors = [];
	this.actorIdx = {};
	this.actorKind = {};
	this.init(canvasId, mapWidth, mapHeight);
}

Actors.prototype = new CanvasManager();

Actors.prototype.populate = function(layer, levelMap) {
	var self = this;
	Object.keys(levelMap.tilesets[0].tileproperties).forEach(function(tileNum) {
		var properties = levelMap.tilesets[0].tileproperties[tileNum];

		if(!self.actorKind[properties.type]) {
			self.actorKind[properties.type] = new ActorKind();
		}
	
		self.actorKind[properties.type].addTileSubtype(tileNum, properties.subtype);
	});
}

Actors.prototype.draw = function(tileSet, interpolation, ticks) {
	this.context.clearRect(0, 0, this.mapWidth, this.mapHeight);
	var that = this;
	this.actors.forEach(function(actor) {
		actor.draw(that.context, tileSet, interpolation, ticks);
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
	var actorConstructor = null;

	switch(data.actor) {
		case 'player0':
		case 'player1':
		case 'player2':
		case 'player3':
			actorConstructor = Player;
			break;
		case 'bomb':
			actorConstructor = Bomb;
			break;
		default:
			throw new String(data.actor + " unsupported");
	}

	actor = new actorConstructor(data.id, this.actorKind[data.actor], data);
	this.actors.push(actor);
	this.actorIdx[data.id] = this.actors.length-1;
};

Actors.prototype.despawn = function(data) {
	delete this.actors[this.actorIdx[data.id]];
};
