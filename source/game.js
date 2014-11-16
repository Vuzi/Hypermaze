
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
Game = new function(graph, map, pawns_handler, context) {
	this.graph = graph;
	this.map = map;
	this.pawns_handler = pawns_handler;

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
Game.prototype.launch = function(pawns_number) {
	
};