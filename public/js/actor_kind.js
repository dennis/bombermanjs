function ActorKind() {
	this.subtypes = {};
	this.lastSubtype = null;
};
ActorKind.prototype.lastSubtype = null;
ActorKind.prototype.subtypes = {};
ActorKind.prototype.addTileSubtype = function(tileNum, subtype) {
	if(this.subtypes[subtype] == undefined) 
		this.subtypes[subtype] = new Animation();
	this.subtypes[subtype].push(tileNum);
}
ActorKind.prototype.get = function(subtype, ticks) {
	if(this.lastSubtype != subtype) {
		this.subtypes[subtype].reset(ticks);
		this.lastSubtype = subtype;
	}
	return this.subtypes[subtype].get(ticks);
}
