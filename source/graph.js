
/**
 * A graph node class.
 * @param {number} value
 * @param {number} x
 * @param {number} y
 */
Node = function(value, x, y, spawn, exit, checkpoint) {
	this.value = value;
	this.x = x;
	this.y = y;
	this.edges = [];
	this.pawn = null;

	// Two turn previsions
	this.prevision_path = {};

	this.spawn = spawn || false;
	this.exit = exit || false;
	this.checkpoint = checkpoint || false;
};

/**
 * Set prevision at the turn specified, for the specified turn and pawn.
 * @param {number} turn           The turn the prevision is made at.
 * @param {number} prevision_turn The turn when the pawn will be at the node.
 * @param {Pawn} pawn             The pawn at the position.
 */
Node.prototype.setPrevisions = function(turn, pawn) {
	if(!this.prevision_path)
		this.prevision_path = {};

	// Register the path for the given node at the turn 'turn'
	this.prevision_path[turn] = pawn;
};

/**
 * Test if a node is empty at a given turn.
 * @param  {number}  turn           The actual turn.
 * @param  {number}  prevision_turn The turn to test.
 * @return {Boolean}                True if the node is empty, false otherwise.
 */
Node.prototype.isEmpty = function(turn, pawn) {

	// Previsions from previous turn
	if(this.prevision_path) {
		if(this.prevision_path[turn] &&
           this.prevision_path[turn] != pawn)
			return false;
	}

	return true;
};

/**
 * Test if this node is a spawn point.
 * @return {boolean}
 */
Node.prototype.isSpawn = function() {
	return this.spawn;
};

/**
 * Test if this node is an exit point.
 * @return {boolean}
 */
Node.prototype.isExit = function() {
	return this.exit;
};

/**
 * Test if this node is a checkpoint.
 * @return {boolean}
 */
Node.prototype.isCheckpoint = function() {
	return this.checkpoint;
};

/**
 * Add an edge to the node.
 * @param {Edge} edge
 */
Node.prototype.addEdge = function(edge) {
	this.edges.push(edge);
};

/**
 * Get an empty neighbour node.
 * @return {Node} The first empty neighbour node, or null if there is none empty.
 */
Node.prototype.getEmptyNeighbour = function() {
	// Look in all the edges to an empty neighbour
	for(var i = 0; i < this.edges.length; i++) {
		var neighbour = this.edges[i].getOther(this);
		if(neighbour.pawn == null && !neighbour.spawn)
			return neighbour;
	}

	//  No empty neighbour
	return null;
};

/**
 * Return the distance between the current node and the given node. The is the carthesian distance.
 * @param  {Node} node The node to meusure the distance with.
 * @return {number}    The distance between node and the current object.
 */
Node.prototype.distanceFrom = function(node) {
	return Math.sqrt(Math.pow(node.x - this.x, 2) + Math.pow(node.y - node.y, 2));
};

/**
 * Test if the given node object is 
 * equals to the current node.
 * @param  {Object} node
 * @return {boolean}
 */
Node.prototype.equals = function(node) {

	// Is node ?
	if(!(node instanceof Node))
		return false;

	// Has the same x and y ?
	if(this.x == node.x && this.y == node.y)
		return true;
	else
		return false;
};

/**
 * Return the nearest node given.
 * @param  {Array} nodes Array of nodes to be tested.	
 * @return {Node}        The nearest node, or null if none could be found.      
 */
Node.prototype.nearest = function(nodes) {

	if(!nodes || !nodes.length)
		return null;

	var nearest = nodes[0];
	var length = this.distanceFrom(nodes[0]);

	for(var i = 1; i < nodes.length; i++) {
		var tmp = this.distanceFrom(nodes[i]);

		// Found a nearest node
		if(tmp < length) {
			length = tmp;
			nearest = nodes[i];
		}
	}

	return nearest;
};

// ==================================================================

/**
 * Edge between two nodes.
 * @param {Node} nodeA   The first node.
 * @param {Node} nodeB   The second node.
 * @param {number} value The value of the edge.
 */
Edge = function(nodeA, nodeB, value) {
	this.nodeA = nodeA;
	this.nodeB = nodeB;
	this.value = value;

	nodeA.addEdge(this);
	nodeB.addEdge(this);
};

/**
 * Return the other node using the references to tests the nodes
 * @param  {Node} node The node to test
 * @return {Node}      The other node
 */
Edge.prototype.getOther = function(node) {
	if(this.nodeA == node)
		return this.nodeB;
	else if(this.nodeB == node)
		return this.nodeA;
	else
		return null;
};

/**
 * Test if the given object is equal to the
 * current edge.
 * @param  {Object} edge
 * @return {boolean}
 */
Edge.prototype.equals = function(edge) {

	// Is edge ?
	if(!(node instanceof Edge))
		return false;

	// Sames nodes ?
	if((this.nodeA == edge.nodeA && this.nodeB == edge.nodeB) ||
	   (this.nodeB == edge.nodeA && this.nodeA == edge.nodeB))
		return true;
	else
		return false;
};

// ==================================================================

/**
 * Graph class, used for tha pathfinding algorithm.
 * @param {Array} data           An array of strings, representing the maze.
 * @param {boolean} avoid_corner If true, avoid corners path when creating the graph.
 */
Graph = function(data, avoid_corner) {
	this.init(data, (typeof avoid_corner !== 'undefined' ? avoid_corner : true));
};

/**
 * Definition of node data according to a character
 * @type {Object}
 */
Graph.prototype.node_definitions = {
		' ' : [ 0, false, false, false ],

		'G' : [ 1, false, false, false ],
		'-' : [ 1, false, false, false ],

		'+' : [ 2, false, false, false ],

		'D' : [ 0, true , false, false ],
		'S' : [ 0, true , false, false ],

		'A' : [ 0, false, true , false ],
		'E' : [ 0, false, true , false ],

		'1' : [ 0, false, false, 1 ],
		'2' : [ 0, false, false, 2 ],
		'3' : [ 0, false, false, 3 ],
		'4' : [ 0, false, false, 4 ],
		'5' : [ 0, false, false, 5 ],
		'6' : [ 0, false, false, 6 ],
		'7' : [ 0, false, false, 7 ],
		'8' : [ 0, false, false, 8 ],
		'9' : [ 0, false, false, 9 ],
	};

/**
 * Initialise the graph with the given data.
 * @param {Array} data           An array of strings, representing the maze.
 * @param {boolean} avoid_corner If true, avoid corners path when creating the graph.
 */
Graph.prototype.init = function(data, avoid_corner) {
	
	// All the edges and nodes
	this.edges = [];
	this.nodes = [];

	// Special nodes (also referenced in the nodes array)
	this.spawns = [];
	this.exits = [];
	this.checkpoints = [];

	delete this.nodes_debug;

	// First pass, create all the nodes
	for (var i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].length; j++) {
			var tmp = this.node_definitions[data[i][j]];

			if(tmp) {
				var new_node = new Node(tmp[0], i, j, tmp[1], tmp[2], tmp[3]);

				if(new_node.isSpawn())
					this.spawns.push(new_node);

				if(new_node.isExit())
					this.exits.push(new_node);

				if(new_node.isCheckpoint())
					this.checkpoints.push(new_node);

				this.nodes.push(new_node);
			}
		}
	}

	// Second pass, create the edges
	for (var k = this.nodes.length - 1; k >= 0; k--) {
		var node = this.nodes[k];

		var up = this.getNodeAt(node.x, node.y+1);
		var right = this.getNodeAt(node.x+1, node.y);
		var link = null;

		// Up
		if(up)
			this.edges.push(new Edge(node, up, 1));

		// Right
		if(right)
			this.edges.push(new Edge(node, right, 1));

		if(avoid_corner) {
			// Up Right
			if(up && right) {
				if((link = this.getNodeAt(node.x+1, node.y+1))) {
					this.edges.push(new Edge(node, link, 1.41));
				}
			}

			// Down Right
			if(this.getNodeAt(node.x, node.y-1) && right) {
				if((link = this.getNodeAt(node.x+1, node.y-1))) {
					this.edges.push(new Edge(node, link, 1.41));
				}
			}
		} else {
			// Up Right
			if((link = this.getNodeAt(node.x+1, node.y+1))) {
				this.edges.push(new Edge(node, link, 1.41));
			}			

			// Down Right
			if((link = this.getNodeAt(node.x+1, node.y-1))) {
				this.edges.push(new Edge(node, link, 1.41));
			}
		}
	}
};

/**
 * Return a specific node by its position.
 * @param  {number} x.
 * @param  {number} y.
 * @return {Node}   The node at x:y.
 */
Graph.prototype.getNodeAt = function(x, y) {
	var tmp = new Node(0, x, y);

	for(var i = 0; i < this.nodes.length; i++) {
		if(this.nodes[i].equals(tmp))
			return this.nodes[i];
	}

	return null;
};

/**
 * Return a specific esdge by its endpoints.
 * @param  {Node} nodeA.
 * @param  {Node} nodeB.
 * @return {Edge} The edge between nodeA and nodeB.
 */
Graph.prototype.getEdgeByNodes = function(nodeA, nodeB) {
	var tmp = new Edge(nodeA, nodeB, 0);

	for(var i = this.edges.length - 1; i >= 0; i--) {
		if(this.edges[i].equals(tmp))
			return this.edges[i];
	}

	return null;
};

/**
 * Draw the path on the given path on the graph.
 */
Graph.prototype.debugDrawPath = function(path, tile_size, canvas) {
	
	var half_size = tile_size / 2;
	var x, y, x1, y1, x2, y2;
	var ctx = canvas.getContext("2d");

	// Draw the path
	if(path) {
		if(!(path instanceof Array)) {
			path = [ path ];
		}

		for(var l = 0; l < path.length; l++) {
			if(path[l]) {
				var paths = path[l].getPath();
				var color;

				if(l === 0)
					color = 'red';
				else if(l == 1)
					color = 'green';
				else if(l == 2)
					color = 'blue';
				else
					color = 'orange';

				for (var k = paths.length - 1; k >= 2; k--) {
					var elem = paths[k];
					
					if(elem instanceof Node) {
						x = elem.y * tile_size + half_size;
						y = elem.x * tile_size + half_size;

						ctx.beginPath();
						ctx.arc(x+(l*1), y+(l*1), 10, 0, 2*Math.PI, false);
						if(k == 2) {
							ctx.fillStyle = color;
							ctx.fill();
						}
						ctx.lineWidth = 2;
						ctx.strokeStyle = color;
						ctx.stroke();

						ctx.font = "13px Arial";
						ctx.fillText(elem.y+"-"+elem.x, x+10, y+12);
						ctx.closePath();

					} else if(elem instanceof Edge) {
						x1 = elem.nodeA.y * tile_size + half_size;
						y1 = elem.nodeA.x * tile_size + half_size;

						x2 = elem.nodeB.y * tile_size + half_size;
						y2 = elem.nodeB.x * tile_size + half_size;

						ctx.beginPath();
						ctx.moveTo(x1+(l*1), y1+(l*1));
						ctx.lineTo(x2+(l*1), y2+(l*1));
						ctx.lineWidth = 2;
						ctx.strokeStyle = color;
						ctx.stroke();
					}
				}
			}
		}
	}
};

/**
 * Reset the cached debug draw.
 */
Graph.prototype.debugResetDraw = function() {
	delete this.nodes_debug;
}

/**
 * Draw the view of the map.
 */
Graph.prototype.debugDraw = function(tile_size, canvas) {
	
	var half_size = tile_size / 2;
	var x, y, x1, y1, x2, y2;
	var ctx_dest = canvas.getContext("2d");

	if(!this.nodes_debug) {

		this.nodes_debug = document.createElement('canvas');
		this.nodes_debug.width = canvas.width;
		this.nodes_debug.height = canvas.height;
		var ctx = this.nodes_debug.getContext("2d");

		// Draw the edges
		for (var i = this.edges.length - 1; i >= 0; i--) {
			var edge = this.edges[i];

			x1 = edge.nodeA.y * tile_size + half_size;
			y1 = edge.nodeA.x * tile_size + half_size;

			x2 = edge.nodeB.y * tile_size + half_size;
			y2 = edge.nodeB.x * tile_size + half_size;

			ctx.beginPath();
			ctx.moveTo(x1, y1);
			ctx.lineTo(x2, y2);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#333';
			ctx.stroke();
			ctx.closePath();
		}

		// Draw the nodes
		for (var j = this.nodes.length - 1; j >= 0; j--) {
			var node = this.nodes[j];

			x = node.y * tile_size + half_size;
			y = node.x * tile_size + half_size;

			ctx.beginPath();
			ctx.arc(x, y, 10, 0, 2*Math.PI, false);

			if(node.isSpawn())
				ctx.fillStyle = 'lightblue';
			else if(node.isExit())
				ctx.fillStyle = 'pink';
			else if(node.isCheckpoint())
				ctx.fillStyle = 'yellow';
			else if(node.value === 0)
				ctx.fillStyle = 'lightgreen';
			else if(node.value == 1)
				ctx.fillStyle = "orange";
			else
				ctx.fillStyle = 'red';

			ctx.fill();
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#333';
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();

			ctx.fillStyle = 'black';
			ctx.font = "12px Arial";

			if(node.isSpawn())
				ctx.fillText("S", x-3, y+3);
			else if(node.isExit())
				ctx.fillText("E", x-3, y+3);
			else if(node.isCheckpoint())
				ctx.fillText("C"+node.checkpoint, x-3, y+3);
			else
				ctx.fillText(node.value, x-3, y+3);

			ctx.fillStyle = 'black';
			ctx.font = "13px Arial";
			ctx.fillText(node.y+"-"+node.x, x+10, y+12);
			ctx.closePath();
		}
	}

	ctx_dest.drawImage(this.nodes_debug, 0, 0);
};

/**
 * Compute the shortest path between start and dest using the dijkstra algorithm.
 * 
 * @param  {Node} start   The start node.
 * @param  {number} turn  The actual turn number.
 * @return {Path}         The list of edges and nodes taken.
 */
Graph.prototype.dijkstra = function(start, turn, pawn) {
	// Create the stack & visited nodes
	var stack = new OrderedStack(function(path1, path2) {
		if(path1.value > path2.value)
			return 1;
		else if(path1.value < path2.value)
			return -1;
		else
			return 0;
	});
	var visited = [start];
	stack.push(new Path(start));
	stack.peek().turn += pawn.time_to_wait;

	// If not at an exit
	while(stack.peek() !== null && !stack.peek().node.exit) {
		var path = stack.pop();

		// For each edge of the road
		for(var i  = 0; i < path.node.edges.length; i++) {
			// If we haven't visited the next node && node is empty 
			var next_node = path.node.edges[i].getOther(path.node);

			if(!visited.contains(next_node) && !next_node.spawn && next_node.isEmpty(turn + path.turn, pawn)) {
				visited.push(next_node);
				stack.push(path.nextStep(path.node.edges[i], next_node));
			}
		}
	}

	// Unregister the previous path of the node, then
	// register the new one on the graph.
	this.unregisterPath(pawn.path, pawn);
	this.registerPath(stack.peek(), pawn, turn);
	return stack.pop();
};

/**
 * Compute the shortest path between start and dest using the A* algorithm.
 * 
 * @param  {Node} start   The start node.
 * @param  {number} turn  The actual turn number.
 * @return {Path}         The list of edges and nodes taken.
 */
Graph.prototype.A_Star = function(start, turn, pawn) {
	// Compute the nearest exit
	var dest = start.nearest(this.exits);

	// Create the stack & visited nodes
	var stack = new OrderedStack(function(path1, path2) {
		var dist1 = path1.node.distanceFrom(dest) / 4;
		var dist2 = path2.node.distanceFrom(dest) / 4;

		if(path1.value + dist1 > path2.value + dist2)
			return 1;
		else if(path1.value + dist1 < path2.value + dist2)
			return -1;
		else
			return 0;
	});
	var visited = [start];
	stack.push(new Path(start));
	stack.peek().turn += pawn.time_to_wait;

	// If not at an exit
	while(stack.peek() !== null && !stack.peek().node.exit) {
		var path = stack.pop();

		// For each edge of the road
		for(var i  = 0; i < path.node.edges.length; i++) {
			// If we haven't visited the next node && node is empty 
			var next_node = path.node.edges[i].getOther(path.node);

			if(!visited.contains(next_node) && !next_node.spawn && next_node.isEmpty(turn + path.turn, pawn)) {
				visited.push(next_node);
				stack.push(path.nextStep(path.node.edges[i], next_node));
			}
		}
	}

	// Unregister the previous path of the node, then
	// register the new one on the graph.
	this.unregisterPath(pawn.path, pawn);
	this.registerPath(stack.peek(), pawn, turn);
	return stack.pop();
};

/**
 * Register a path on the graph with the given path at the given turn
 * for the given pawn.
 * @param  {Path}   path The path to register. Can be null.
 * @param  {Pawn}   pawn The pawn which will take the path.
 * @param  {number} turn The turn number for the path.
 */
Graph.prototype.registerPath = function(path, pawn, turn) {

	// TODO : optimise
	//        real values in path
	if(path) {
		var nodes = path.getPath();
		// Path
		for(var j = 0, k = 0; j < nodes.length; j++) {
			if(nodes[j] instanceof Node && !nodes[j].exit) {

				// Lock the node for the next turn
				nodes[j].setPrevisions(turn + k, pawn);
				k += 1;

				// Lock for the time to wait on the node
				// (Node value not already on the node, otherwise pawn time to wait)
				var time_to_wait = nodes[j].pawn == pawn ? pawn.time_to_wait : nodes[j].value;

				for(var l = 0; l < time_to_wait; l++) {
					nodes[j].setPrevisions(turn + k, pawn);
					k += 1;
				}
			}
		}
	} else {
		// Lock the current node for the next turn
		if(pawn.node)
			pawn.node.setPrevisions(turn + 1, pawn);
	}
};

/**
 * Unregister a path in the graph, at the given turn for the given pawn
 * with the given path.	
 * @param  {Result} path The path to erase.
 * @param  {Pawn} pawn   The pawn which has the path to erase.
 * @param  {number} turn The turn to erase at.
 */
Graph.prototype.unregisterPath = function(path, pawn) {

	// TODO : optimise
	if(path) {
		do {
			// For each prevision in the node
			for (turn in path.node.prevision_path) {
				// If this is the pawn to unregister, unregister it.
				if(path.node.prevision_path[turn] == pawn) {
					path.node.prevision_path[turn] = undefined;
				}
			}

		} while((path = path.previous) != null);

		return;
	}
};

// ==================================================================

/**
 * Path result, stocked as a linked list.
 * @param {Path} source The previous path
 */
Path = function(source) {
	this.value = source.value;
	this.edge = null;
	this.node = source;
	this.previous = null;
	this.turn = 1;
};

/**
 * Add an element to the path, and return the new
 * path.
 * @param  {Edge} edge The edge used.
 * @param  {Node} node The current node.
 * @return {Path}      The new path.
 */
Path.prototype.nextStep = function(edge, node) {
	var path = new Path(node);

	path.turn = this.turn + 1 + node.value;
	path.value = this.value + edge.value + node.value;
	path.edge = edge;
	path.previous = this;

	return path;
};

/**
 * Return the Path path in a list.
 * @return {Array} List of nodes and edges used in the path.
 */
Path.prototype.getPath = function() {
	if(!this.paths) {
		this.paths = [];
		var path = this;

		while(path) {
			this.paths.unshift(path.node);

			if(path.edge)
				this.paths.unshift(path.edge);

			path = path.previous;
		}
	}

	return this.paths;
};

// ==================================================================

/**
 * Element walking on the graph.
 * @param {String} id          The id of the pawn.
 * @param {Node} node          The node where the pawn is actually in.
 * @param {Object} checkpoints Object with checkpoint id that the pawn need to pass by.
 */
Pawn = function(id, node, checkpoints) {
	this.id = id;
	if(node)
		this.setPosition(node);
	this.time_to_wait = 0;
	this.checkpoints = checkpoints;
};

/**
 * Set the position of the pawn on the graph.
 * @param {Node} node The node where the pawn should be
 */
Pawn.prototype.setPosition = function(node) {
	if(this.node && this.node.pawn == this)
		this.node.pawn = null;
	this.node = node;
	node.pawn = this;
	this.time_to_wait = node.value;
};

/**
 * Update the position of the pawn using the
 * given result path.
 * @param  {path} path The path to use.
 */
Pawn.prototype.updatePosition = function(path) {
	// No time to wait
	if(this.time_to_wait <= 0) {
		// If not bloqued, update the position
		if(path) {
			var paths = path.getPath();

			if(paths.length >= 3) {
				this.setPosition(paths[2]);
			}
		}
	} else {
		this.time_to_wait--;
	}

	this.path = path;
};
