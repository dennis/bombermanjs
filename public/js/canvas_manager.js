function CanvasManager() {
	this.mapWidth = 0;
	this.mapHeight = 0;
};
CanvasManager.prototype.init = function(canvasId, mapWidth, mapHeight) {
	this.canvas = document.getElementById(canvasId);

	if(this.canvas.getContext) {
		this.context = this.canvas.getContext('2d');

		this.canvas.width = this.mapWidth =  mapWidth;
		this.canvas.height = this.mapHeight = mapHeight;
	}
	else {
		throw new "No canvas support for element " + canvasId;
	}
}
