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
