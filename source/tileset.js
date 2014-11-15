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

	/*
	if (spritesheet_path === undefined) {
		this.spritesheet_path = "default_tileset.png";
		this.tile_size = 26; // Hardcoded because _we_ create the spritesheets
	}
	else {
		this.spritesheet_path = spritesheet_path;
		this.tile_size = tile_size;
	}
	
	var size = this.tile_size;
	// The first 6 coordinates respect the default spritesheet
	// We can still add more tiles on other coordinates
	this.tex_coords = {
		" ": {x: 0 * size, y: 0 * size},
		"*": {x: 0 * size, y: 1 * size},
		"G": {x: 0 * size, y: 2 * size},
		"D": {x: 0 * size, y: 3 * size},
		"P": {x: 0 * size, y: 4 * size},
		"A": {x: 0 * size, y: 5 * size},
	};*/
	
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
