/**
 * Contains a sprite sheet and the coordinates of each individual sprite.
 * If no spritesheet is specified, it loads a default one.
 * @param {String} spritesheet_path Path to the image.
 * @param {number} tile_size        The size of a (square) tile.
 */
Tileset = function(spritesheet, tile_size, correspondence_map) {

	this.spritesheet = spritesheet;
	this.tile_size = tile_size;
	this.correspondence_map = correspondence_map;
};

Tileset.prototype.getTileValue = function(x, y) {
	for (var key in this.correspondence_map) {
		var tile_coords = this.correspondence_map[key];

		if(tile_coords.constructor == Array) {

			for (var i = 0; i < tile_coords.length; i++) {
				var tile_coord = tile_coords[i];
				
				if((x >= tile_coord.x && x < tile_coord.x + this.tile_size) &&
				   (y >= tile_coord.y && y < tile_coord.y + this.tile_size)) {
					return { value: key.charAt(0), real_value : key, x: tile_coord.x, y: tile_coord.y, tile_size: this.tile_size };
				}
			}
		} else {
			if((x >= tile_coords.x && x < tile_coords.x + this.tile_size) &&
			   (y >= tile_coords.y && y < tile_coords.y + this.tile_size)) {
				return { value: key.charAt(0), real_value : key, x: tile_coords.x, y: tile_coords.y, tile_size: this.tile_size };
			}
		}
	}

	return null;
};

/**
 * Check if a tile need a background.
 * @param  {String} tile_id The id of the tile.
 * @return {Boolean}        True if the tile needs a background, otherwise false.
 */
Tileset.prototype.needBackgroundTile = function(tile_id) {
	switch (tile_id) {
	 	case "D":
	 	case "P":
	 	case "A":
	 	return true;
	 default:
	 	return false;
	 }
};
