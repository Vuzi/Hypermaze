
function hasClass(elem, className) {
    return (" " + elem.className + " ").indexOf(" "+className+" ") > -1;
}

function openWindow(e) {
	var selector = e.target.getAttribute("target");
	var dest = document.querySelectorAll(selector)[0];

	if(dest) {
		// Create the nodes
		var elements = dest.childNodes;
		var window_back = document.createElement("div");
		var window_frame = document.createElement("div");
		var window_close = document.createElement("a");

		// Classes
		window_back.className = "window_back";
		window_frame.className = "window_frame";
		window_close.className = "window_close";
		window_close.innerHTML = "X";

		// Closing event
		var close = function(e) {
			// Give back all the nodes to the element
			while (window_frame.childNodes.length > 0) {
				dest.appendChild(window_frame.childNodes[0]);
			}

			// Delete everything
			window_back.remove();
		}

		window_close.onclick = close;
		window_back.onclick = close;
		window_frame.onclick = function(e) {
			e.stopPropagation();
		}

		// Add the content here
		while (elements.length > 0) {
			/*
			if(hasClass(elements[0], "close")) {
				if(elements[0].onclick) {
					elements[0].previous = elements[0].onclick;
					elements[0].onclick = function(e) {
						this.previous(e);
						close();
					}
				} else
					elements[0].onclick = close;
			}*/
			window_frame.appendChild(elements[0]);
		}
		window_frame.appendChild(window_close);
		window_back.appendChild(window_frame);

		// Add on the window
		document.body.appendChild(window_back);
	}

	return false;
}

var elems = document.getElementsByClassName("window");

for (var i = elems.length - 1; i >= 0; i--) {
	elems[i].onclick = openWindow;
};
