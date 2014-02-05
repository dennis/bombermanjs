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
	var needsLoading = 0;
	var allOk = true;

	Object.keys(this.assets).forEach(function(assetName) {
		var asset = self.assets[assetName];
		if(asset.response === undefined)
			needsLoading++;
	});;

	Object.keys(this.assets).forEach(function(assetName) {
		var asset = self.assets[assetName];
		var request = new XMLHttpRequest();
		request.open('GET', asset.url, true);
		request.responseType = asset.type;
		request.onload = function() {
			if(request.status === 200) {
				needsLoading--;

				asset.response = request.response;
				console.log("asset loader '" + assetName + "' loaded ok");

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

AssetLoader.prototype.getNames = function() {
	return Object.keys(this.assets);
};
