var authors = new Set();
const MAX_SUGGESTIONS = 5;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_TAB = 9;

function resetAuthors(youtube) {
    // TODO use trie to not iterate over n users
    var newAuthors = new Set();
    youtube.iteratePastChatMessages(function(message) {
        $(message).not(".author-is-owner").find("span.author a.yt-user-name").each(function (i, elem) {
            newAuthors.add(elem.innerText);
        });
    });
    authors = newAuthors;
}

var highlightedAuthor = '';

function suggestAuthors(suggestBox, name) {
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
function resetSuggestions(suggestBox) {
    suggestBox.empty();
    highlightedAuthor = '';
}
function include_user_suggestions() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(".highlighted-suggested-author {background-color: blue; width: 100%; color: white;} .suggested-author {display: block;}</style>");
        $("#live-comments-controls").prepend("<div id='brbtv-user-suggest'></div>");
        var suggestBox = $("#brbtv-user-suggest");

        // fetch initial authors
        resetAuthors(youtube);

        // make sure we remove authors from time to time so we don't get a list of x-thousand users
        setInterval(function() {resetAuthors(youtube)}, 60000); // 1 minute

        youtube.registerChatMessageObserver(function (message) {
            var author_name = $(message).not("author-viewing").find("a.yt-user-name").text();
            if (author_name) {
                authors.add(author_name);
            }
        });

        youtube.getJChatInputField().keyup(function (e) {
            var indexOfAt = findPositionOfAtBeforeCaret(youtube.getJChatInputField());
            if (indexOfAt != -1) {
                var caret = getCaretPosition(youtube.getChatInputField());
                if (caret > indexOfAt) {
                    var namePart = youtube.getJChatInputField().html().substring(indexOfAt + 1, caret);
                    suggestAuthors(suggestBox, namePart);
                }
            } else {
                resetSuggestions(suggestBox);
            }
        });

        youtube.getJChatInputField().keydown(function (e) {
            if (e.keyCode == KEY_UP) {
                if (highlightedAuthor) {
                    moveHighlightedAuthor(suggestBox, -1);
                    e.preventDefault();
                }
            } else if (e.keyCode == KEY_DOWN) {
                if (highlightedAuthor) {
                    moveHighlightedAuthor(suggestBox, +1);
                    e.preventDefault();
                }
            } else if (e.keyCode == KEY_TAB) {
                completeAuthorSuggestion(suggestBox, youtube.getJChatInputField());
                e.preventDefault();
            }
        });
    });
}

//http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
// JavaScript's modulo operator does not work as intended...
function fixedModulo(x, y) {
    return ((x % y) + y) % y;
}

function moveHighlightedAuthor(suggestBox, by) {
    var authorElements = suggestBox.find(".suggested-author");

    if (authorElements.length == 0) return;

    var highlightedAuthorIdx = -1;

    for (var i = 0; i < authorElements.length; i++) {
        if (authorElements.eq(i).hasClass("highlighted-suggested-author")) {
            highlightedAuthorIdx = i;
        }
    }

    if (highlightedAuthorIdx == -1) {
        console.warn("Moving highlight cursor failed because there was nothing highlighted. This should not happen.");
    } else {
        authorElements.eq(highlightedAuthorIdx).removeClass("highlighted-suggested-author");
        highlightedAuthorIdx = fixedModulo((highlightedAuthorIdx + by), authorElements.length);
        authorElements.eq(highlightedAuthorIdx).addClass("highlighted-suggested-author");
        highlightedAuthor = authorElements.eq(highlightedAuthorIdx).html();
    }
}

function completeAuthorSuggestion(suggestBox, textInput) {
    var highlightedAuthorElement = suggestBox.find(".highlighted-suggested-author");
    if (highlightedAuthorElement.length) {
        var indexOfAt = findPositionOfAtBeforeCaret(textInput);
        var indexOfCaret = getCaretPosition(textInput[0]);
        textInput.html(textInput.html().replaceBetween(indexOfAt + 1, indexOfCaret, highlightedAuthor + ",&nbsp;"));
        setCaretPosition(textInput[0], indexOfAt + highlightedAuthor.length + 3);
        resetSuggestions(suggestBox);
        return true;
    } else {
        return false;
    }
}

// http://stackoverflow.com/questions/14880229/how-to-replace-a-substring-between-two-indices
String.prototype.replaceBetween = function (start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};