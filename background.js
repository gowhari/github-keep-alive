(function() {

    'use strict';

    const request_url = 'https://github.com/opensearch.xml?n=';
    const cycle_time = 15000;
    const request_timeout = 3000;
    const states = {
        active: {
            color: '#080',
            badge_text: '\u2714',
            title: 'It seems that everything is working fine!',
        },
        inactive: {
            color: '#888',
            badge_text: ' ',
            title: 'Inactive',
        },
        interrupt: {
            color: '#f80',
            badge_text: '\u2716',
            title: 'Last request failed. No need to do anything, we will keep trying.',
        },
    };
    var is_active = true;


    var request_to_github = function() {
        if (!is_active) {
            return;
        }
        var n = parseInt(Math.random() * 1e16);
        var url = request_url + n;
        var xhttp = new XMLHttpRequest();
        xhttp.timeout = request_timeout;
        xhttp.onreadystatechange = function() {
            if (!is_active || this.readyState != 4) {
                return;
            }
            set_state(this.status == 200 ? 'active' : 'interrupt');
        };
        xhttp.open('GET', url, true);
        xhttp.send();
    };


    var toggle_activity = function() {
        is_active = !is_active;
        set_state(is_active ? 'active' : 'inactive');
        if (is_active) {
            request_to_github();
        }
    };


    var set_state = function(state_name) {
        var state = states[state_name];
        chrome.browserAction.setBadgeText({text: state.badge_text});
        chrome.browserAction.setBadgeBackgroundColor({color: state.color});
        chrome.browserAction.setTitle({title: 'Github Keep-Alive\n' + state.title});
    };


    var init = function() {
        set_state('active');
        chrome.browserAction.onClicked.addListener(toggle_activity);
        setInterval(request_to_github, cycle_time);
        request_to_github();
    };


    init();

})();
