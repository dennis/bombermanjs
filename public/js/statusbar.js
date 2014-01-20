"use strict";

function Statusbar(canvasId, mapWidth, mapHeight) {
	this.layers = [];
	this.dirty = true;
	this.height = 20;
	this.colorActive = "#55f";
	this.colorInactive = "#555";
	this.scoreboard = {};

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

	console.log(this.scoreboard);

	this.context.fillStyle = this.scoreboard.player0 ? this.colorActive : this.colorInactive;
	this.context.fillText( "p1: " + (this.scoreboard.player0 || 0), 90, this.mapHeight-2 );

	this.context.fillStyle = this.scoreboard.player1 ? this.colorActive : this.colorInactive;
	this.context.fillText( "p2: " + (this.scoreboard.player1 || 0), 130, this.mapHeight-2 );
	
	this.context.fillStyle = this.scoreboard.player2 ? this.colorActive : this.colorInactive;
	this.context.fillText( "p3: " + (this.scoreboard.player2 || 0), 170, this.mapHeight-2 );

	this.context.fillStyle = this.scoreboard.player3 ? this.colorActive : this.colorInactive;
	this.context.fillText( "p4: " + (this.scoreboard.player3 || 0), 210, this.mapHeight-2 );

	this.dirty = false;
};

Statusbar.prototype.updateScoreboard = function(data) {
	this.scoreboard = data;
	this.dirty = true;
};
