"use strict";

function Statusbar(canvasId, mapWidth, mapHeight, spriteManager) {
	this.spriteManager = spriteManager;
	this.layers = [];
	this.dirty = true;
	this.height = 20;
	this.colorActive = "#fff";
	this.colorInactive = "#f55";
	this.data = {};

	this.init(canvasId, mapWidth, mapHeight + this.height);
}
Statusbar.prototype = new CanvasManager();

Statusbar.prototype.draw = function() {
	if(!this.dirty) {
		return;
	}

	this.context.setFillColor(0,0,0,1);
	this.context.fillRect(0, this.mapHeight-this.height, this.mapWidth, this.mapHeight);

	// bomb sprite
	this.spriteManager.tileset.draw(this.context, 90, this.mapHeight-18, this.spriteManager.get('bomberman0-down').tiles[0]);
	this.spriteManager.tileset.draw(this.context, 150, this.mapHeight-18, this.spriteManager.get('bomb').tiles[0]);

	// text
	this.context.font = "12px verdana";
	this.context.textAlign = 'left';
	this.context.fillStyle = '#fff';
	this.context.fillText( "bombermanjs", 0, this.mapHeight-6 );

	this.context.font = "10px verdana";
	this.context.textAlign = 'left';

	// text: lives
	this.context.fillStyle = this.data.lives > 0 ? this.colorActive : this.colorInactive;
	this.context.fillText( "× " + this.data.lives, 110, this.mapHeight-6 );

	// text: bombs
	this.context.fillStyle = this.data.bombCount > 0 ? this.colorActive : this.colorInactive;
	this.context.fillText( "× " + this.data.bombCount, 170, this.mapHeight-6 );

	this.dirty = false;
};

Statusbar.prototype.update = function(data) {
	this.data = data;
	this.dirty = true;
};

