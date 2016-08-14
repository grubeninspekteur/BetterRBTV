var authors = new Set();
const MAX_SUGGESTIONS = 5;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_TAB = 9;

function resetAuthors() {
    authors = new Set();
    $("#all-comments").find("span.author a.yt-user-name").each(function (i, elem) {
        authors.add(elem.innerHTML);
    });
}

var highlightedAuthor = '';

function suggestAuthors(name) {
    var suggestBox = $("#brbtv-user-suggest");
    suggestBox.empty();
    if (name.length > 0) {
        var suggestions = 0;
        var name_lower = name.toLowerCase();
        var authorElements = [];
        var highlightedAuthorFound = false;
        for (let author of authors) {
            if (author.toLowerCase().startsWith(name_lower)) {
                var authorElement = $("<span class='suggested-author'>" + author + "</span>");
                if (author == highlightedAuthor) {
                    highlightedAuthorFound = true;
                    authorElement.addClass("highlighted-suggested-author");
                }
                authorElements.push(authorElement);
                suggestions++;
            }
            if (suggestions == MAX_SUGGESTIONS) break;
        }

        if (!highlightedAuthorFound) {
            highlightedAuthor = '';
            if (authorElements.length > 0) {
                highlightedAuthor = authorElements[0].html();
                authorElements[0].addClass("highlighted-suggested-author");
            }
        }

        // show list alphabetically
        authorElements.sort(function (a, b) {
            a.html().localeCompare(b.html())
        });

        for (var i = 0; i < authorElements.length; i++) {
            suggestBox.append(authorElements[i]);
        }
    }
}

function findPositionOfAtBeforeCaret(jTextInput) {
    var caretPos = getCaretPosition(jTextInput[0]);
    var innerHTML = jTextInput.html();
    var theAtPos = -1;
    for (var i = 0; i < innerHTML.length; i++) {
        if (innerHTML[i] == "@" && i < caretPos) {
            theAtPos = i;
        }
    }
    return theAtPos;
}
function resetSuggestions() {
    $("#brbtv-user-suggest").empty();
    highlightedAuthor = '';
}
function include_user_suggestions() {
    onChatLoaded(function () {
        $("head").append("<style>.highlighted-suggested-author {background-color: blue; width: 100%; color: white;} .suggested-author {display: block;}</style>");

        // fetch initial authors
        resetAuthors();

        // make sure we remove authors from time to time so we don't get a list of x-thousand users
        setInterval(resetAuthors, 60000); // 1 minute

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                var count = 0;
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    authors.add($(mutation.addedNodes[i]).find("a.yt-user-name").html());
                    count++;
                }
            });
        });

        observer.observe(document.getElementById("all-comments"), {childList: true});

        $("#live-comments-controls").prepend("<div id='brbtv-user-suggest'></div>");

        var textInput = $("#live-comments-input-field");

        textInput.keyup(function (e) {
            var indexOfAt = findPositionOfAtBeforeCaret(textInput);
            if (indexOfAt != -1) {
                var caret = getCaretPosition(textInput[0]);
                if (caret > indexOfAt) {
                    var namePart = textInput.html().substring(indexOfAt + 1, caret);
                    suggestAuthors(namePart);
                }
            } else {
                resetSuggestions();
            }
        });

        textInput.keydown(function (e) {
            if (e.keyCode == KEY_UP) {
                moveHighlightedAuthor(-1);
                e.preventDefault();
            } else if (e.keyCode == KEY_DOWN) {
                moveHighlightedAuthor(+1);
                e.preventDefault();
            } else if (e.keyCode == KEY_TAB) {
                if (completeAuthorSuggestion()) {
                    e.preventDefault();
                }
            }
        });
    });
}

//http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
// JavaScript's modulo operator does not work as intended...
function fixedModulo(x,y) {
    return ((x%y)+y)%y;
}

function moveHighlightedAuthor(by) {
    var authorElements = $("#brbtv-user-suggest").find(".suggested-author");

    if (authorElements.length == 0) return;

    var highlightedAuthorIdx = -1;

    //Why is this giving wrong results once I changed the highlighted class? -> var highlightedAuthorIdx = authorElements.index(".highlighted-suggested-author");
    for (var i = 0; i < authorElements.length; i++) {
        if (authorElements.eq(i).hasClass("highlighted-suggested-author")) {
            highlightedAuthorIdx = i;
        }
    }


    console.log("highlightIdx: "+ highlightedAuthorIdx);

    if (highlightedAuthorIdx == -1) {
        console.log("Warning: moving highlight cursor failed because there was nothing highlighted. This should not happen.");
    } else {
        authorElements.eq(highlightedAuthorIdx).removeClass("highlighted-suggested-author");
        highlightedAuthorIdx = fixedModulo((highlightedAuthorIdx + by), authorElements.length);
        authorElements.eq(highlightedAuthorIdx).addClass("highlighted-suggested-author");
        highlightedAuthor = authorElements.eq(highlightedAuthorIdx).html();
    }
}

function completeAuthorSuggestion() {
    var highlightedAuthorElement = $("#brbtv-user-suggest").find(".highlighted-suggested-author");
    if (highlightedAuthorElement.length) {
        var textInput = $("#live-comments-input-field");
        var indexOfAt = findPositionOfAtBeforeCaret(textInput);
        var indexOfCaret = getCaretPosition(textInput[0]);
        textInput.html(textInput.html().replaceBetween(indexOfAt+1,indexOfCaret, highlightedAuthor + ",&nbsp;"));
        setCaretPosition(textInput[0], indexOfAt + highlightedAuthor.length + 3);
        resetSuggestions();
        return true;
    } else {
        return false;
    }
}

// http://stackoverflow.com/questions/14880229/how-to-replace-a-substring-between-two-indices
String.prototype.replaceBetween = function(start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};