/**
 * Created by jayantbhawal on 13/11/15.
 */
(function () {
    var graphHeight = 330;
    var graphWidth = 500;
    var grapher = function (x,y) {
        var text = window.getSelection().toString();
        //ngraph(text);
        var ng = document.querySelector("#ngram-here");
        if (ng) {
            document.body.removeChild(ng);
        }

        //x = selectedBox().x + selectedBox().width/2 - graphWidth/2;
        //y = selectedBox().y + selectedBox().height*1.5;

        x = x - graphWidth/2;
        y = y + selectedBox().height+5;

        if(text.length) {
            ngraph(x, y, text);
        }
    };
    var ngraph = function (x, y, terms) {
        //console.log(terms);
        var ng = document.createElement("iframe");
        ng.src = 'https://www.google.com/trends/fetchComponent?q=' + terms + '&cid=TIMESERIES_GRAPH_0&export=5';
        ng.height = graphHeight;
        ng.width = graphWidth;
        ng.style["border"] = "none";
        ng.style["background-color"] = "#fff";

        var ngc = document.createElement("div");
        ngc.id = "ngram-here";
        ngc.style["position"] = "absolute";
        ngc.style["left"] = x + "px";
        ngc.style["top"] = y + "px";
        ngc.style["background-color"] = "#fff";
        ngc.style["padding"] = "0px";
        ngc.style["box-shadow"] = "0px 1px 5px rgba(0,0,0,0.5)";
        //ngc.style["border-radius"] = "3px";
        ngc.appendChild(ng);

        //var el = document.createElement("div");
        //var ngram = '<iframe class="ngram-graph" src="http://www.google.com/trends/fetchComponent?q='+terms+'&cid=TIMESERIES_GRAPH_0&export=5" frameborder="0"></iframe>';
        //el.innerHTML = ngram;
        document.querySelector("body").appendChild(ngc);
    };

    document.addEventListener("dblclick", function () {
        var x = event.pageX
        var y = event.pageY;
        grapher(x,y);
    }, false);

    document.onclick = function(e) {
        //var el = e.currentTarget.closest("#ngram-here");
        var ng = document.querySelector("#ngram-here");
        if (ng) {
            document.body.removeChild(ng);
        }
    };
    document.onkeyup = function(e) {
        var ng = document.querySelector("#ngram-here");
        if (ng) {
            document.body.removeChild(ng);
        }
    };
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            sendResponse({selectedText: window.getSelection().toString()});
        });

    ready(function () {
        var css = '#ngram-here{z-index: 5;} #ngram-here:hover{z-index: 9999999999999;}';
        style = document.createElement('style');

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        document.getElementsByTagName('head')[0].appendChild(style);
    });

    function ready(fn) {
        if (document.readyState != 'loading'){
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    function selectedBox() {
        var sel = document.selection, range;
        var width = 0, height = 0, x = 0, y = 0;
        if (sel) {
            if (sel.type != "Control") {
                range = sel.createRange();
                width = range.boundingWidth;
                height = range.boundingHeight;
            }
        } else if (window.getSelection) {
            sel = window.getSelection();
            if (sel.rangeCount) {
                range = sel.getRangeAt(0).cloneRange();
                if (range.getBoundingClientRect) {
                    var rect = range.getBoundingClientRect();
                    width = rect.right - rect.left;
                    height = rect.bottom - rect.top;
                    x = rect.left;
                    y = rect.top;
                }
            }
        }
        return {width: width, height: height, x: x, y: y};
    }
})
();
