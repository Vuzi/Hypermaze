/**
 * The graphical map of the game.
 * @param {Matrix} terrain A matrix of symbols representing the map
 * @param {[type]} tileset The tileset used to draw the map
 */
Map = function(context, terrain, tileset) {

	this.ctx = context;
	this.terrain = terrain;
	this.tileset = tileset;
};

/**
 * Init the content of the map. Should be call if any important value is changed.
 * @return {Map} Return itself.
 */
Map.prototype.init = function() {
	this.height = this.terrain.length;
	this.width = this.terrain[0].length;

	this.canvas = document.createElement('canvas');
	this.canvas.width = this.getWidth();
	this.canvas.height = this.getHeight();
	this.cached = false;

	return this;
};

/**
 * Get node coordonates from x and y pixel position on the map.
 * @param  {number} x X position in pixels.
 * @param  {number} y Y position in pixels.
 * @return {Object}   The X and Y of the node in the grap.
 */
Map.prototype.getCoords = function(x, y) {
	return { x : ~~(x / this.tileset.tile_size), y : ~~(y / this.tileset.tile_size)};
};

/**
 * Return the width of the displayed map in pixel.
 * @return {number} The width in pixel of the map.
 */
Map.prototype.getWidth = function() {
	return this.terrain[0].length * this.tileset.tile_size;
};

/**
 * Return the height of the displayed map in pixel.
 * @return {number} The height in pixel of the map.
 */
Map.prototype.getHeight = function() {
	return this.terrain.length * this.tileset.tile_size;
};

/**
 * Draw the background map.
 * @param  {boolean} force If true, don't use the cached image.
 */
Map.prototype.drawBackground = function(force) {

	// Draw the cached background if needed
	if (!this.cached || force) {
		var ctx = this.canvas.getContext("2d");
		// For each row
		for(var i = 0; i < this.height; i++) {
			// For each tile of this row
			for(var j = 0; j < this.width; j++) {
				if(this.terrain[i][j]) {
					var value = 0;

					// Try to guess if the tile is connected
					if(this.terrain[i-1] && this.terrain[i-1][j] == this.terrain[i][j])
						value = 1;

					if(this.terrain[i][j+1] == this.terrain[i][j])
						value += 2;

					if(this.terrain[i+1] && this.terrain[i+1][j] == this.terrain[i][j])
						value += 4;

					if(this.terrain[i][j-1] == this.terrain[i][j])
						value += 8;

					value = this.terrain[i][j] + "" + value;

					if(this.tileset.correspondence_map[value])
						this.drawTileAt(ctx, value, j, i);
					else
						this.drawTileAt(ctx, this.terrain[i][j], j, i);
				}
			}
		}
		this.cached = true;
	}
	
	this.ctx.drawImage(this.canvas, 0, 0);
};

/**
 * Draw the tile specified by id at the position x and y using the provided context.
 * @param ctx The context where to draw the tile.
 * @param id  The id of the tile to draw.
 * @param x   The x position in pixels.
 * @param y   The y position in pixels.
**/
Map.prototype.drawTileAt = function(ctx, id, x, y) {
	var tile_coords = this.tileset.correspondence_map[id];
	if(tile_coords) {
		if(tile_coords.constructor == Array) {
			tile_coords = tile_coords.random();
		}

		ctx.drawImage(this.tileset.spritesheet,   // The spritesheet
					  tile_coords.x,              // The x position  in the spritesheet
					  tile_coords.y,              // The y position  "                "
					  this.tileset.tile_size,     // The tile width  "                "
					  this.tileset.tile_size,     // The tile height "                "
					  x * this.tileset.tile_size, // The x position  in the canvas
					  y * this.tileset.tile_size, // The y position  "           "
					  this.tileset.tile_size,     // The tile width  "           "
					  this.tileset.tile_size);    // The tile height "           "
	}
};

