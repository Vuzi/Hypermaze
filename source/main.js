var ctx = document.getElementById("Canvas").getContext("2d");
var map = new Map(ctx);

var graph = new Graph(map.terrain, true);

var pawns = [];

// A bench to mesure the background cache optimisation

setInterval(function() {

	var start = new Date().getTime();
	
	map.drawBackground();
	// var x = parseInt(Math.random() * map.width);
	// var y = parseInt(Math.random() * map.height);
	// pawns.push({x:x, y:y});

	// for (var i=0; i < pawns.length; i++)
	// 	map.drawTileAt(ctx, "P", pawns[i].x, pawns[i].y);

	var time = new Date().getTime() - start;

	document.getElementById('timer').innerHTML = '( in '+time+' ms)';

}, 10);

