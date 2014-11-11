/**
 * Contains a sprite sheet and the coordinates of each individual sprite
 * If no spritesheet is specified, it loads a default one
 * @param {String} spritesheet_path [description]
 */
Tileset = function(spritesheet_path) {

	this.spritesheet = new Image();

	if (spritesheet_path === undefined) {
		this.spritesheet.src = "default_tileset.png";
		this.tile_size = 26; 
	}
	else {
		this.spritesheet.src = spritesheet_path;
		this.tile_size = 50; // Hardcoded because _we_ create the spritesheets
	}
	
	this.spritesheet.onload = function() {
		console.log("Tileset ["+this.src+"] loaded");
	};
	
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
	};
	
};
