/**
 * Created by jayantbhawal on 13/11/15.
 */

(function () {
    var terms = [];
    ready(function () {
        getSavedTerms();
        renderGraph();
        document.querySelector("#new-nterm-icon").onclick = addTerm;
        document.querySelector("#new-nterm").onkeydown = addTermAfterEnter;
        getSelectedText();
        cleanInputField();
    });

    var addTermAfterEnter = function () {
        if(event.keyCode == 13) {
            addTerm();
        }
    };
    var addTerm = function () {
        var newTerm = document.querySelector("#new-nterm").value;
        if (newTerm.length) {
            terms.push(newTerm);
            if(!checkTermsList(terms))
                setTerm(newTerm);
            saveAndRender();
        }
    };

    function renderGraph() {
        removeGraph();
        console.log("rendering");
        var query = terms.join();
        var el = document.createElement("iframe");
        el.src = "http://www.google.com/trends/fetchComponent?q=" + query + "&cid=TIMESERIES_GRAPH_0&export=5";
        el.id = "ngram-frame"
        document.querySelector("#ngram-graph").appendChild(el);
    }

    function removeGraph() {
        var ng = document.querySelector("#ngram-frame");
        if (ng) {
            document.querySelector("#ngram-graph").removeChild(ng);
        }
    }

    function setTerm(term) {
        var nterm = document.createElement("span");
        nterm.className = "nterm";
        nterm.innerText = term;
        nterm.onclick = function () {
            terms.splice(Array.from(document.querySelectorAll(".nterm")).indexOf(nterm),1);
            console.log(Array.from(document.querySelectorAll(".nterm")).indexOf(nterm));
            nterm.parentNode.removeChild(nterm);
            saveAndRender();
        };
        var nterms = document.querySelector(".nterms");
        nterms.insertBefore(nterm, nterms.childNodes[nterms.childElementCount - 1]);
        document.querySelector("#new-nterm").value = "";
    }

    function setTermsList(terms) {
        terms.forEach(function (term, i) {
            setTerm(term);
        });
    }

    function checkTermsList(terms){
        terms.forEach(function (term, i) {
            if(term == document.querySelector("#new-nterm").value){
                return true;
            }
            return false;
        });
    }

    function cleanInputField(){
        if(checkTermsList(terms)){
            document.querySelector("#new-nterm").value = "";
        }
    }

    function getSelectedText() {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function (response) {
                //console.log(response.selectedText);
                if(response) {
                    document.querySelector("#new-nterm").value = response.selectedText;
                }
            });
        });
    }

    function saveChanges() {
        if (terms.length == 0 || terms.length > 5) {
            if (terms.length == 0) {
                deleteTerms();
            }
            return;
        }
        chrome.storage.sync.set({'nterms': terms}, function () {
            // Notify that we saved.
        });
    }

    function saveAndRender(){
        if (terms.length == 0 || terms.length > 5) {
            if (terms.length == 0) {
                deleteTerms();
            }
        }
        chrome.storage.sync.set({'nterms': terms}, function () {
            renderGraph();
        });
    }

    function deleteTerms() {
        chrome.storage.sync.set({'nterms': null}, function () {
            // Notify that we deleted.
        });
    }

    function getSavedTerms() {
        chrome.storage.sync.get('nterms', function (data) {
            if (data) {
                terms = data.nterms || [];

                if (terms.length) {
                    setTermsList(terms);
                    renderGraph();
                }
            }
        });
    }
})();