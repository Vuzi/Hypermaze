
/**
 * Image loader, will fire the given callback when the images are all loaded.
 * @param {Array} array   Array of images to load (String of the source).
 * @param {function} clbk The callback to call at the end of the loading.
 */
ImageLoader = function(array, clbk) {

	this.loaded = false;
	this.loading = false;

	if(array)
		this.to_load = array;
	else
		this.to_load = [];

	if(clbk)
		this.onload = clbk;
};

/**
 * Add an image to load.
 * @param {String} image Source of the image to load.
 */
ImageLoader.prototype.add = function(image) {
	if(!this.loaded && !this.loading)
		this.to_load.push(image);
};

/**
 * Load all the images, and call the provided callback (Or any set before).
 * @param  {function} clbk The callback to call at the end of the loading.
 */
ImageLoader.prototype.load = function(clbk) {

	if(this.loaded || this.loading || this.to_load.length === 0)
		return;

	var count = this.to_load.length;
	var count_loaded = 0;
	var me = this;

	// Callback
	var onload = clbk || this.onload;

	// Prepare the callbacks
	var load_clbk = function() {
		count_loaded++;

		if(count_loaded >= count) {
			me.loading = false;
			me.loaded = true;

			if(onload)
				onload(me.images);
		}
	};

	var error_clbk = function() {
		if(me.onerror)
			me.onerror(this.src);
	};

	// Results
	this.images = [];
	this.loading = true;

	// For each image to load
	for(var i = 0; i < this.to_load.length; i++) {
		// New image
		var img = new Image();
		this.images[this.to_load[i]] = img;

		// Set the callbacks
		img.onload = load_clbk;
		img.onerror = error_clbk;

		// Launch the load
		img.src = this.to_load[i];
	}
};

/**
 * Get the loaded image by its source.
 * @param  {String} src The image source.
 * @return {Image}      The loaded image.
 */
ImageLoader.prototype.get = function(src) {
	if(this.loaded)
		return this.images[src];
};