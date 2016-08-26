var authors = new Set();
const MAX_SUGGESTIONS = 5;

function resetAuthors(youtube) {
    // TODO use trie to not iterate over n users
    var newAuthors = new Set();
    youtube.iteratePastChatMessages(function (message) {
        $(message).not(".author-is-owner").find("span.author a.yt-user-name").each(function (i, elem) {
            newAuthors.add(elem.innerText);
        });
    });
    authors = newAuthors;
}

function include_user_suggestions() {
    function suggestAuthors(suggestBox, name) {
        var suggestedAuthorElements = [];

        if (name && name.length > 0) {
            var suggestions = 0;
            var name_lower = name.toLowerCase();
            for (let author of authors) {
                if (author.toLowerCase().startsWith(name_lower)) {
                    suggestions++;
                    let authorElement = $("<span></span>");
                    authorElement.text(author);
                    suggestedAuthorElements.push(authorElement);
                    if (suggestions == MAX_SUGGESTIONS) break;
                }

                // show list alphabetically
                suggestedAuthorElements.sort(function (a, b) {
                    a.text().localeCompare(b.text())
                });
            }

            suggestBox.setContents(suggestedAuthorElements);
        }
    }

    function completeAuthorSuggestion(suggestBox, authorName, youtube) {
        if (authorName) {
            suggestBox.replaceSuggestion(youtube.getJChatInputField(), "@", "@" + authorName + ",", true);
        }
    }

    // MAIN

    YouTubeLive.onChatLoaded(function (youtube) {
        // fetch initial authors
        resetAuthors(youtube);

        // make sure we remove authors from time to time so we don't get a list of x-thousand users
        setInterval(function () {
            resetAuthors(youtube)
        }, 60000); // 1 minute

        youtube.registerChatMessageObserver(function (message) {
            var author_name = $(message).not("author-viewing").find("a.yt-user-name").text();
            if (author_name) {
                authors.add(author_name);
            }
        });

        var suggestBox = new SuggestionBox("author", youtube.getJChatInputField(), function (authorName, suggestBox) {
            completeAuthorSuggestion(suggestBox, authorName, youtube);
        });

        suggestBox.addTrigger(youtube.getJChatInputField(), "@", function (namePart) {
            suggestAuthors(suggestBox, namePart);
        })
    });
}