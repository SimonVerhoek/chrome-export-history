var append = function(text) {
    data.appendChild(document.createTextNode(text));
}

var download = function(format) {
    document.getElementById('content').innerText = "preparing file...";

    chrome.history.search({
        'text': '', 
        // 'maxResults': 100, 
        'maxResults': 100000, 
        'startTime': 0
    }, function(res) {
        window.res = res;

        // minimum amount of time in milliseconds that
        // the page has to be visited, in order to be
        // considered as read
        var threshold = 5000;

        var text, filename;

        append("[");

        // from the oldest to the most recent page visited
        for (var i = res.length-1; i > -1; i--) { 

            // if visit time longer than threshold, add to JSON
            if (i === 0 || res[i-1].lastVisitTime - res[i].lastVisitTime > threshold) {
                if (format === "urlsonly") {
                    filename = "urlsonly.json";
                    text = JSON.stringify(res[i].url);
                } else {
                    filename = "alldata.json";
                    text = JSON.stringify(res[i]);
                };
                if (i !== 0) text = text + ',';
                append(text);
            }  
        }
        append("]");

        window.blob = new Blob([data.innerText], {type: 'application/octet-binary'});
        window.url = URL.createObjectURL(blob);

        var pom = document.createElement('a');
        pom.setAttribute('href', url);
        pom.setAttribute('download', filename);
        pom.click();

        window.close();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    window.data = document.getElementById('data');

    document.getElementById('alldata').onclick = function() {
        download('alldata');
    };

    document.getElementById('urlsonly').onclick = function() {
        download('urlsonly');
    };
});