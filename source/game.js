
/**
 * Handle the progress of a game. This class will handle the spawns of pawn, their movement,
 * their destruction of the game, and everything related to the game.
 *
 * The needredraw method can be set in the Game object, and will be called every time the canvas
 * have been redraw and need to be updated (usually in a CanvasHandler).
 *
 * Once the game is launched, modifing the graph is a bad idea an can cause undefined behavior.
 * 
 * @param  {Graph} graph                The graph used for the game.
 * @param  {Map} map                    The graphical map to display.
 * @param  {PawnsHandler} pawns_handler The pawns generator, used to generate new pawns.
 * @param  {Context} context            The canvas context where to draw.
 */
Game = function(graph, map, pawns_handler) {
	this.graph = graph;
	this.map = map;
	this.pawns_handler = pawns_handler;

	this.pawns = [];
	this.results = [];

	this.turn = 0;
	this.running = false;

	// List of possible callbacks
	this.needredraw = null;
	this.new_pawn = null;
	this.pawn_exited = null;
	this.pawn_checkpoint = null;
	this.endgame = null;
}

/**
 * Launch the game with a target number of pawns to generate. At each new spawn,
 * the new_pawn method is called (if defined). At each pawn being at a checkpoint,
 * the pawn_checkpoint method is called (if defined). At each pawn exiting the game,
 * the pawn_checkpoint method is called (id defined). At the end of the game, when
 * all the pawn have exited the game, the endgame method is called (if defined).
 * @param  {number} pawns_number The number of pawns to spawn.
 */
Game.prototype.launch = function(pawns_number, timer) {
	// Nothing at the moment
	this.running = true;
	this.pawns_nb = pawns_number;
	this.timer = timer;

	this.pause()
};

Game.prototype.pause = function() {
	var me = this;

	if(this.running) {
		if(this.interval) {
			clearInterval(this.interval);
			this.interval = null;
		} else
			this.interval = setInterval(function() { me.nextTurn() }, this.timer);
	}
};

Game.prototype.nextTurn = function() {
	console.log(this);
	// If the game is running
	if(this.running) {
		this.results = [];

		// Move all the pawns on the map
		for(var i = 0; i < this.pawns.length; i++) {
			var pawn = this.pawns[i];

			// No time to wait
			if(pawn.time_to_wait <= 0) {
				// Get the path
				var result = this.graph.dijkstraImproved(pawn.node, null, this.turn, pawn);

				// If not bloqued, update the position
				if(result) {
					this.results.push(result);
					pawn.updatePosition(result);
				}
			} else {
				pawn.time_to_wait--;
			}
		}

		// Delete the pawns that have arrived
		for(var i = 0; i < this.pawns.length; i++) {
			if(this.pawns[i].node.exit) {
				var removed = this.pawns.remove(i);
			
				if(this.pawn_exited)
					this.pawn_exited(removed);
			}
		}

		// Spawn new pawns if neeeded
		if(this.pawns_nb > 0) {
			// For each spawn on the graph
			for(var j = 0; j < this.graph.spawns.length && this.pawns_nb > 0; j++) {
				var free_node;
				while(this.pawns_nb > 0 && (free_node = this.graph.spawns[j].getEmptyNeighbour()) != null) {
					// Push a new pawn on the free node next to the exit
					this.pawns.push(new Pawn(this.pawns_nb+"", free_node, {}));
					this.pawns_nb--;

					if(this.new_pawn)
						this.new_pawn(this.pawns.last());
				}
			}
		}

		this.turn++;
	}

	// Need to redraw the game
	if(this.needredraw)
		this.needredraw(this);
};