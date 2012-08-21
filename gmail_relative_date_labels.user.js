// ==UserScript==
// @name           Gmail Relative Date Labels
// @namespace      http://www.geoffreyarnold.com/
// @description    Adds labels to Gmail for filtering by relative dates (today, yesterday, ...)
// @include        http*://mail.google.com/*
// ==/UserScript==

(function(){

	function addLabelsIfReady() {
		var composeButtonNavigationDiv = findComposeButtonNavigationDiv();
		if (composeButtonNavigationDiv) {
	        var style = document.createElement('style');
	        style.type = 'text/css';
	        style.innerHTML = '#gmail_relative_date_labels { margin: 8px 0 8px 0px; line-height: 17px; font-size: 13px; }' +
				' #gmail_relative_date_labels a { color: #000; text-decoration: none; display: block; }'+
				' #gmail_relative_date_labels .active_filter a { font-weight: bold; }';
				
			document.getElementsByTagName('head')[0].appendChild(style);

	        var div = document.createElement("div");
			div.id = 'gmail_relative_date_labels';
			div.appendChild(createAnchor('Today', 0, 1));
			div.appendChild(createAnchor('Yesterday', -1, 0));
			div.appendChild(createAnchor('Last 7 days', -7, 1));
			div.appendChild(createAnchor('Last 30 days', -30, 1));
			div.appendChild(createAnchor('Last 365 days', -365, 1));

	        composeButtonNavigationDiv.insertBefore(div, composeButtonNavigationDiv.firstChild.nextSibling);
		}
		else {
			window.setTimeout(function() {
				addLabelsIfReady();
			}, 250);
		}
	}

    function findComposeButtonNavigationDiv() {
        var navigationDivs = document.querySelectorAll('div[role="navigation"]');
        for (var i = 0; i < navigationDivs.length; i++) {
            var navigationDiv = navigationDivs[i];
            if (navigationDiv.innerHTML.indexOf('COMPOSE') !== -1) {
                return navigationDiv;
            }
        }

        return false;
    }

	function createAnchor(name, afterOffset, beforeOffset) {
		var div = document.createElement('div');
		div.innerHTML = '<div class="aim"><div class="TN"><div class="aio"><a href="#">' + name + '</a></div></div></div>';
		div.onclick = function() {
			var activeLinks = document.querySelectorAll('#gmail_relative_date_labels div.TN.active_filter');
			if (activeLinks && activeLinks.length == 1) {
				activeLinks[0].className = 'TN';
			}
			
			this.querySelectorAll('.TN')[0].className = 'TN active_filter';
			
			applyFilter(afterOffset, beforeOffset);
		}
		
		return div;
	}

	function applyFilter(afterOffset, beforeOffset) {
	    var searchInput = document.getElementById('gbqfq');
	    var searchButton = document.getElementById('gbqfb');
	    if (searchInput && searchButton) {
			var after = 'after:' + formatDate(createDate(afterOffset));
			var before = beforeOffset > 0 ? '' : 'before:' + formatDate(createDate(beforeOffset));

			var query = searchInput.value;
			if (query.match(/ ?after:.+ ?/)) {
				query = query.replace(/after:[^ ]+/, after);
			}
			else {
				query += ' ' + after;
			}
			if (query.match(/ ?before:.+ ?/)) {
				query = query.replace(/before:[^ ]+/, before);
			}
			else {
				query += ' ' + before;
			}

			searchInput.value = query;
			searchButton.click();
	    }
	}

	function createDate(dateOffset) {
		var date = new Date();
		date.setDate(date.getDate() + dateOffset);
		
		return date;
	}

	function formatDate(date) {
		return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
	}

    window.setTimeout(function() {
		addLabelsIfReady();
    }, 250);

})();

