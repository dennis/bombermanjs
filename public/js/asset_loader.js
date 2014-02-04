function AssetLoader(success, error) {
	this.assets = {};
	this.success = success;
	this.error = error;
}

AssetLoader.prototype.load = function(name, url, type) {
	type = type || 'arraybuffer';
	this.assets[name] = {
		type: type,
		url: url,
		response: undefined
	};
};

AssetLoader.prototype.execute = function() {
	var self = this;
	var needsLoading = Object.keys(this.assets).length;
	var allOk = true;

	Object.keys(this.assets).forEach(function(asset) {
		var request = new XMLHttpRequest();
		request.open('GET', self.assets[asset].url, true);
		request.responseType = self.assets[asset].type;
		request.onload = function() {
			if(request.status === 200) {
				needsLoading--;

				self.assets[asset].response = request.response;
				console.log("asset loader '" + asset + "' loaded ok");

				if(needsLoading == 0 && allOk)
					self._success();
				if(needsLoading == 0 && !allOk)
					self._error();
			}
		};
		request.onerror = function() {
			allOk = false;
			console.error("Failed loading", url);
		};
		request.onabout = function() {
			allOk = false;
			console.error("Aborted loading", url);
		};
		request.send();
	});
};

AssetLoader.prototype.get = function(url) {
	return this.assets[url].response;
};

AssetLoader.prototype._success = function() {
	this.success(this);
};

AssetLoader.prototype._error = function() {
	this.error(this);
};
