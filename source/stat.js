
Stat = function() {
	this.data_pawn = [];
	this.data_timer = [];

	this.max_pawn = 0;
	this.max_timer = 0; 
}

Stat.prototype.register = function(pawns, timer) {
	this.data_pawn.push(pawns);
	this.data_timer.push(timer);

	if(pawns > this.max_pawn)
		this.max_pawn = pawns;
	
	if(timer > this.max_timer)
		this.max_timer = timer; 
};

Stat.prototype.displayResults = function(width, height, with_time) {
	var canvas = document.createElement('canvas');
	canvas.width = width;
	canvas.height = height;

	var ctx = canvas.getContext("2d");
	var x, y, lastx, lasty;

	for(var i = 0; i < this.data_timer.length; i++) {
		y = (height - 100) - ((this.data_timer[i] * (height - 100)) / with_time);
		x = (this.data_pawn[i] * (width - 100)) / this.max_pawn;

		// If last point, line
		/*if(lastx && lasty) {
			ctx.beginPath();
			ctx.moveTo(lastx+50, lasty+50);
			ctx.lineTo(x+50, y+50);
			ctx.lineWidth = 2;
			ctx.strokeStyle = '#333';
			ctx.stroke();
			ctx.closePath();
		}*/

		lastx = x;
		lasty = y;

		// The point
		ctx.beginPath();
		ctx.arc(x+50, y+50, 3, 0, 2*Math.PI, false);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#333';
		ctx.stroke();
		ctx.closePath();

		// Value near the point
		ctx.beginPath();
		ctx.fillStyle = 'black';
		ctx.font = "10px Arial";
		ctx.fillText(this.data_pawn[i]+"p/"+this.data_timer[i]+"ms", x+60, y+62);
		ctx.closePath();
	}

	return canvas;
};