/**
 * Created by jayantbhawal on 13/11/15.
 */
function ready(fn) {
    if (document.readyState != 'loading'){
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}
function getJSON(url){
    var request = new XMLHttpRequest();
    request.open('GET', url, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            alert(data);
            return data;
        } else {
            // We reached our target server, but it returned an error
        }
    };
    request.onerror = function(err) {
        return err;
    };
    request.send();
}