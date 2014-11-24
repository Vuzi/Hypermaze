
Array.prototype.swap = function (x, y) {
	var b = this[x];
	this[x] = this[y];
	this[y] = b;
	return this;
};

Array.prototype.last = function () {
	return this[this.length-1];
};

Array.prototype.contains = function (x) {
	return this.indexOf(x) >= 0;
};

Array.prototype.insert = function (i, v) {
	return this.splice(i, 0, v);
};

Array.prototype.empty = function() {
	while(this.length > 0) {
	    this.pop();
	}
};

Array.prototype.remove = function(i) {
	return this.splice(i, 1)[0];
};

Array.prototype.random = function() {
	return this[~~(Math.random()*this.length)];
};