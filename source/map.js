/**
 * The map of the game
 * If no terrain is specified, it loads the default one
 * Same for the tileset
 * @param {Matrix} terrain A matrix of symbols representing the map
 * @param {[type]} tileset The tileset used to draw the map
 */
Map = function(context, terrain, tileset) {

	this.ctx = context;
	
	if (terrain == undefined)
		this.terrain = default_map;
	else
		this.terrain = terrain;
	
	if (tileset == undefined)
		this.tileset = new Tileset();
	else
		this.tileset = tileset;

	this.height = this.terrain.length;
	this.width = this.terrain[0].length;
};

Map.prototype.drawBackground = function() {

	// Draw the cached background if available
	if (this.background_image)
		this.ctx.putImageData(this.background_image, 0, 0);
	else 
	{
		console.log("Drawing started");
		
		// For each row
		for(var i = 0; i < this.height; i++) 
		{
			// For each tile of this row
			for(var j = 0; j < this.width; j++) 
			{
				// Some tiles have transparency and so they need a background under them
				if (Tileset.needBackgroundTile(this.terrain[i][j]) == true)
					this.drawTileAt(this.ctx, " ", j , i );
				
				this.drawTileAt(this.ctx, this.terrain[i][j], j, i);
			}
		}

		// Save the background to avoid redrawing it
		this.background_image = this.ctx.getImageData(0, 0, this.width * this.tileset.tile_size, this.height * this.tileset.tile_size);
	}
};

/**
 * Draw the tile specified by id at the position x and y using the provided context.
 * @param ctx The context where to draw the tile.
 * @param id  The id of the tile to draw.
 * @param x   The x position in pixels.
 * @param y   The y position in pixels.
**/
Map.prototype.drawTileAt = function(ctx, tile_id, x, y) {
	var tile_coords = this.tileset.tex_coords[tile_id];
	if(tile_coords) {
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

var default_map = 
[
	"************************************************",
	"*      *              *                    A   *",
	"* ** A  *   ********** *             *   *     *",
	"* **    *     *      * * *******     *****     *",
	"*  *    ****  * G*   *   GGG      *  *         *",
	"*  *        *  * G*   *******     *  ******    *",
	"*               GG* *       *     *       **   *",
	"*****G********************  *  ********   *    *",
	"*  GGGG  * GGGG   *         *         *   *  * *",
	"* *** GG * G*G*****  ***    ******    *   *    *",
	"*GGGGGG  * G*G*       *          *    *   **   *",
	"* G****  *        *************  ******   *    *",
	"* GGGGGGGGG *          GGGG  *           *     *",
	"****** ******     ****  GGGG  *      ********  *",
	"*           *     *       GGG *                *",
	"*  ******   *                                  *",
	"*   *                                   D      *",
	"*    D      *                                  *",
	"************************************************",
];
