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

/**
 * Check if a tile need a background.
 * @param  {String} tile_id The id of the tile.
 * @return {Boolean}        True if the tile needs a background, otherwise false.
 */
Tileset.needBackgroundTile = function(tile_id) {
	switch (tile_id) {
	 	case "D":
	 	case "P":
	 	case "A":
	 	return true;
	 default:
	 	return false;
	 }
};
