"use strict";

function Statusbar(canvasId, mapWidth, mapHeight) {
	this.layers = [];
	this.dirty = true;
	this.height = 20;
	this.colorActive = "#55f";
	this.colorInactive = "#555";

	this.init(canvasId, mapWidth, mapHeight + this.height);
}
Statusbar.prototype = new CanvasManager();
Statusbar.prototype.draw = function() {
	if(!this.dirty) {
		return;
	}

	this.context.setFillColor(0,0,0,1);
	this.context.fillRect(0, this.mapHeight-this.height, this.mapWidth, this.mapHeight);
	this.context.font = "12px verdana";
	this.context.textAlign = 'left';
	this.context.fillStyle = '#fff';
	this.context.fillText( "bombermanjs", 0, this.mapHeight-2 );

	this.context.font = "10px verdana";
	this.context.textAlign = 'left';

	this.context.fillStyle = this.colorInactive;
	this.context.fillText( "p1: 0", 90, this.mapHeight-2 );

	this.context.fillStyle = this.colorInactive;
	this.context.fillText( "p2: 0", 130, this.mapHeight-2 );
	
	this.context.fillStyle = this.colorInactive;
	this.context.fillText( "p3: 0", 170, this.mapHeight-2 );

	this.context.fillStyle = this.colorInactive;
	this.context.fillText( "p4: 0", 210, this.mapHeight-2 );

	this.dirty = false;
}
