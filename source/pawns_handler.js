
/**
 * This clas handle the caracter random generation (head and body), and its
 * print on the map.
 * 		
 * @param {Canva} context        Where to draw.
 * @param {Image} spritesheet    The spritesheet containing everything to load the caracters.
 * @param {Array} male_heads     Array of coordonates to the male heads in the image.
 * @param {Array} female_heads   Array of coordonates to the female heads in the image.
 * @param {Array} male_bodies    Array of coordonates to the male bodies in the image.
 * @param {Array} female_bodies  Array of coordonates to the male bodies in the image.
 */
PawnsHandler = function(context, spritesheet, male_heads, female_heads, male_bodies, female_bodies, head_size, body_size) {
	this.spritesheet = spritesheet;
	this.male_heads = male_heads;
	this.female_heads = female_heads;
	this.male_bodies = male_bodies;
	this.female_bodies = female_bodies;

	this.head_size = head_size;
	this.body_size = body_size;

	this.generated = {};

	this.ctx = context;
};

/**
 * Clear the list of generated pawns.
 */
PawnsHandler.prototype.clear = function() {
	this.generated = {};
};

/**
 * Generate caracter image, and save it for later use.
 * @param  {Pawn} pawn The pawn.
 */
PawnsHandler.prototype.generate = function(pawn) {
	var canva = document.createElement('canvas');
	canva.width = this.body_size;
	canva.height = this.body_size;

	var head, body;

	// Male or female
	if(Math.random() > 0.5) {
		// Male
		head = this.male_heads.random();
		body = this.male_bodies.random();
	} else {
		// Female
		head = this.female_heads.random();
		body = this.female_bodies.random();
	}

	canva.getContext('2d').drawImage(this.spritesheet, body.x, body.y, this.body_size, this.body_size,  0, 0, this.body_size, this.body_size);
	canva.getContext('2d').drawImage(this.spritesheet, head.x, head.y, this.head_size, this.head_size, 18, 4, this.head_size, this.head_size);
	this.generated[pawn.id] = canva;
};

/**
 * Draw the given pawn on the map, using its nodes, on the context given.
 * If not generated, a caracter will be generated.
 * 
 * @param  {Pawn} pawn      The pawn to use.
 */
PawnsHandler.prototype.draw = function(pawn, tileset) {

	if(pawn && pawn.node) {
		if(!this.generated[pawn.id])
			this.generate(pawn);

		// Draw !
		this.ctx.drawImage(this.generated[pawn.id], tileset.tile_size * pawn.node.y, tileset.tile_size * pawn.node.x);
	}

};