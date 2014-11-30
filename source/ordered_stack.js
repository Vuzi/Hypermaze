
/**
 * Ordered stack.
 * @param {function} comparator the comparator used to order the stack.
 */
OrderedStack = function(comparator) {
	this.comparator = comparator;
	this.data = [];
}

/**
 * Set the comparator.
 * @param {function} comparator Set the comparator to use.
**/
OrderedStack.prototype.setComparator = function(comparator) {
	this.comparator = comparator;
}

/**
 * Push a value in the ordered stack.
 * @param {Object} value The value to be added.
 */
OrderedStack.prototype.push = function(value) {
	if(this.data.length > 0) {
		var i = 0;

		while(i < this.data.length && this.comparator(this.data[i], value) < 0) {
			i++;
		}

		this.data.splice(i, 0, value);
	} else
		this.data[0] = value;
}

/**
 * Pop and return a value in the ordered stack.
 */
OrderedStack.prototype.pop = function() {
	if(this.data.length > 0)
		return this.data.splice(0, 1)[0];
	else
		return null;
}

/**
 * Peek the next value to be pop in the ordered stack.
 */
OrderedStack.prototype.peek = function() {
	if(this.data.length > 0)
		return this.data[0];
	else
		return null;
}