
/**
 * Canvas handler. The purpose of this class is to simply
 * handle canvas with zoom and move methods.
 *
 * Made to be usually used with canvas too big for being displayed.
 * 
 * @param {Canvas} canvas  The canvas to be used.
 * @param {Canvas} content The contained canva.
 */
CanvasHandler = function(canvas, content) {

	this.canvas = canvas;
	this.scaled_content = document.createElement('canvas');
	this.scaled_usable = false;
	this.content = content;
	this.locked = false;

	// Try to desactivate the smoothing
	this.canvas.getContext("2d").imageSmoothingEnabled = false;
	this.scaled_content.getContext("2d").imageSmoothingEnabled = false;
	this.content.getContext("2d").imageSmoothingEnabled = false;

	this.x = 0;
	this.y = 0;

	this.reset();
	this.initEvents();
};

CanvasHandler.prototype.lock = function(locked) {
	if(locked)
		this.locked = true;
	else
		this.locked = false;
}

/**
 * Init the event handlers.
 */
CanvasHandler.prototype.initEvents = function() {
	var me = this;

	var x;
	var y;

	var clicked = false;

	canvas.onmousedown = function(e) {
		x = e.offsetX;
		y = e.offsetY;
		clicked = true;
	};

	canvas.onmousemove = function(e) {
		// Move
		if(clicked && !me.locked) {
			if((e.x !== 0 && e.y !== 0) && (e.offsetX != x || e.offsetY != y)) {
				me.x += e.offsetX - x;
				me.y += e.offsetY - y;

				x = e.offsetX;
				y = e.offsetY;

				me.updateDisplay();
			}
		}
	};

	canvas.onmouseout = canvas.onmouseup = function(e) {
		clicked = false;
	};

	canvas.onwheel = function(e) {
		if(!me.locked) {
			var val = e.details ? (e.details / 100) : (e.wheelDelta / 12000);

			me.zoomIn(val, e.offsetX, e.offsetY);
			return false;
		}

	};

    canvas.addEventListener('contextmenu', function(e) {
		if(me.onrightclick)
			me.onrightclick(~~((e.offsetX - me.x) / me.zoom), ~~((e.offsetY - me.y) / me.zoom), e);
        e.preventDefault();
    }, false);

	canvas.onclick = function(e) {
		if(me.onclick)
			me.onclick(~~((e.offsetX - me.x) / me.zoom), ~~((e.offsetY - me.y) / me.zoom), e);
	};
};

/**
 * Zoom in the content image.
 * @param  {number} val The new zoom value. If > 1, will be set back to 1.
 * @param  {number} x   The x position for the zoom center.
 * @param  {number} y   The y position for the zoom center.
 */
CanvasHandler.prototype.zoomIn = function(val, x, y) {
	this.zoomChange(this.zoom + (val || 0.05), x, y);
};

/**
 * Zoom out in the content image.
 * @param  {number} val The new zoom value. If > 1, will be set back to 1.
 * @param  {number} x   The x position for the zoom center.
 * @param  {number} y   The y position for the zoom center.
 */
CanvasHandler.prototype.zoomOut = function(val, x, y) {
	this.zoomChange(this.zoom - (val || 0.05), x, y);
};

/**
 * Update the zoom value.
 * @param  {number} val The new zoom value. If > 1, will be set back to 1.
 * @param  {number} x   The x position for the zoom center.
 * @param  {number} y   The y position for the zoom center.
 */
CanvasHandler.prototype.zoomChange = function(val, x, y) {

	if(val > 1)
		val = 1;

	this.scaled_usable = false;
	
	if(x === undefined || y === undefined) {
		x = this.canvas.width / 2;
		y = this.canvas.height / 2;
	}

	// Position inside the content
	var relx = x - this.x;
	var rely = y - this.y;

	// Compute the new position
	this.x -= ~~(((this.content.width * val) * (relx/(this.content.width * this.zoom))) - relx);
	this.y -= ~~(((this.content.height * val) * (rely/(this.content.height * this.zoom))) - rely);

	this.zoom = val;
	this.updateDisplay();
};

/**
 * Reset the zoom and the position to the default values.
 */
CanvasHandler.prototype.reset = function() {
	
	// Zoom
	this.zoom = 1.0;

	var height = false;
	var width = false;

	if(this.content.height > this.canvas.height) {
		height = true;
	}

	if(this.content.width > this.canvas.width) {
		width = true;
	}

	if(height && width) {
		var zoomA = this.canvas.height / this.content.height;
		var zoomB = this.canvas.width / this.content.width;
		this.zoom = zoomA < zoomB ? zoomA : zoomB;
	} else if (height) {
		this.zoom = this.canvas.height / this.content.height ;
	} else if (width) {
		this.zoom =  this.canvas.width / this.content.width;
	}

	// Position
	this.x = (this.canvas.width - (this.content.width * this.zoom)) / 2;
	this.y = (this.canvas.height - (this.content.height * this.zoom)) / 2;
};

/**
 * Update the display canvas.
 * @param  {boolean} force If true, force the redraw of the image and ignore cached image (if any).
 */
CanvasHandler.prototype.updateDisplay = function(force) {
	this.canvas.getContext("2d").clearRect(0, 0, this.canvas.width, this.canvas.height);

	if(!this.scaled_usable || force) {
		this.scaled_content.width = this.zoom * this.content.width;
		this.scaled_content.height = this.zoom * this.content.height;
		this.scaled_content.getContext("2d").drawImage(this.content, 0, 0, this.scaled_content.width, this.scaled_content.height);

		this.scaled_usable = true;
	}

	this.canvas.getContext("2d").drawImage(this.scaled_content, this.x, this.y);
};