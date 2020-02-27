/*

Folder fold/unfold
==================

*/

(function() {

	var diagramEntries = document.querySelectorAll("code.language-sequence")
	for(var i = 0; i < diagramEntries.length; i++){
		var diagramEntry = diagramEntries[i]
		var diagram = Diagram.parse(diagramEntry.textContent);
		diagramEntry.innerHTML = ""
		diagram.drawSVG(diagramEntry, {theme: "hand"})
	}

	var open_menus = JSON.parse(window.localStorage.getItem("easydb-docs-open-menus") || '[]');
	// console.debug("open menus:", open_menus)

	var menuEntries = document.querySelectorAll('.js-toggle-menu')

	for(var i = 0; i < menuEntries.length; i++){
		var menuEntry = menuEntries[i]
		var li = menuEntry.parentNode.parentNode
		var menu = li.getAttribute("menu-identifier")
		var idx = open_menus.indexOf(menu)

		// console.debug(menuEntry, menu, idx)
		if (idx > -1) {
			do {
				if (li.classList.contains("menu-entry")) {
					li.classList.add("is-open")
				}
				break
				li = li.parentNode
			} while (li != document.body)
		}

		menuEntry.addEventListener('click', onMenuToggleClick)
	}

	var currentMenuEntry = document.querySelectorAll('.menu-entry.current')
	if (currentMenuEntry.length > 0) {
		CUI.dom.scrollIntoView(currentMenuEntry[0])
	}


	function onMenuToggleClick(event){
		event.preventDefault()
		var li = event.target.parentNode.parentNode
		li.classList.toggle("is-open")
		var menu = li.getAttribute("menu-identifier")
		var idx = open_menus.indexOf(menu)
		if (li.classList.contains("is-open")) {
			if (idx == -1) {
				open_menus.push(menu)
			}
		} else {
			if (idx > -1) {
				open_menus.splice(idx, 1)
			}
		}

		window.localStorage.setItem("easydb-docs-open-menus", JSON.stringify(open_menus));
	}
})()

document.addEventListener("DOMContentLoaded", function() {
	var filter = ["apache", "apache2"];
	var nodes = document.getElementsByTagName("code");
    Array.prototype.forEach.call(nodes, function(node) {
        node.value = node.textContent;
    	var mode = node.getAttribute("data-lang");
    	if (!mode) {
    		return
		}
		
		if (filter.some((_mode) => _mode == mode)) {
			return;
		}
		
		if (mode === "bash") {
			mode = "shell"
		} else if (mode === "json") {
			mode = "javascript"
		} else if (mode === "yml") {
			mode = "yaml"
		}

        CodeMirror.fromTextArea(node, {
			mode: mode,
			json: true,
            lineNumbers: true,
            readOnly: true,
			theme: "base16-light",
            cursorBlinkRate: -1
        });
    });
});

/*

Fullscreen Image Popover
========================

*/

var images = document.querySelectorAll('main img');

for(var i=0; i<images.length; i++){
	images[i].addEventListener('click', onImageClick);
}

function onImageClick(){
	var popover = document.createElement('div');
	popover.classList.add("popover");
	var image = new Image();
	image.classList.add("popover-image");
	image.src = this.src;
	popover.appendChild(image);
	popover.addEventListener("click", function(){ this.remove(); });
	document.body.appendChild(popover);
}
