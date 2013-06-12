(function () {

    function addLabelsIfReady() {
        var composeButtonNavigationDiv = findComposeButtonNavigationDiv();
        if (composeButtonNavigationDiv) {
            var div = document.createElement('div');
            div.id = 'gmail_relative_date_labels';
            div.appendChild(createAnchor('Today', '1d', null));
            div.appendChild(createAnchor('Yesterday', '2d', '1d'));
            div.appendChild(createAnchor('Past week', '7d', null));
            div.appendChild(createAnchor('Past month', '1m', null));
            div.appendChild(createAnchor('Past year', '1y', null));

            composeButtonNavigationDiv.insertBefore(div, composeButtonNavigationDiv.firstChild.nextSibling);
        }
        else {
            window.setTimeout(function () {
                addLabelsIfReady();
            }, 250);
        }
    }

    function findComposeButtonNavigationDiv() {
        var navigationDivs = document.querySelectorAll('div[role=navigation]');
        for (var i = 0; i < navigationDivs.length; i++) {
            var navigationDiv = navigationDivs[i];
            if (navigationDiv.innerHTML.indexOf('COMPOSE') !== -1) {
                return navigationDiv;
            }
        }

        return false;
    }

    function createAnchor(name, newerThanOffset, olderThanOffset) {
        var div = document.createElement('div');
        div.innerHTML = '<div class="aim"><div class="TN"><div class="aio"><a href="#" class="J-Ke n0">' + name + '</a></div></div></div>';
        div.onclick = function () {
            var activeLinks = document.querySelector('#gmail_relative_date_labels div.TN.active_filter');
            if (activeLinks) {
                activeLinks.className = 'TN';
            }

            this.querySelector('.TN').className = 'TN active_filter';

            applyFilter(newerThanOffset, olderThanOffset);
        };

        return div;
    }

    function applyFilter(newerThanOffset, olderThanOffset) {
        var searchInput = document.getElementById('gbqfq');
        var searchButton = document.getElementById('gbqfb');
        if (searchInput && searchButton) {
            var newerThan = 'newer_than:' + newerThanOffset;
            var olderThan = olderThanOffset ? 'older_than:' + olderThanOffset : '';

            var query = searchInput.value;
            if (query.match(/ ?newer_than:.+ ?/)) {
                query = query.replace(/newer_than:[^ ]+/, newerThan);
            }
            else {
                query += ' ' + newerThan;
            }
            if (query.match(/ ?older_than:.+ ?/)) {
                query = query.replace(/older_than:[^ ]+/, olderThan);
            }
            else {
                query += ' ' + olderThan;
            }

            searchInput.value = query;
            searchButton.click();
        }
    }

    window.setTimeout(function () {
        addLabelsIfReady();
    }, 250);
})();

