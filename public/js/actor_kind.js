function ActorKind() {
	this.subtypes = {};
};
ActorKind.prototype.addTileSubtype = function(tileNum, subtype) {
	if(this.subtypes[subtype] == undefined) 
		this.subtypes[subtype] = []
	this.subtypes[subtype].push(tileNum);
}

