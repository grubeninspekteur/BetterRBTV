function include_user_suggestions(addColon) {
    var authorTrie = new Trie();
    var authorSet = new Set();

    function resetAuthors(youtube) {
        var newAuthorTrie = new Trie();
        var newAuthorSet = new Set();

        youtube.iteratePastChatMessages(function (message) {
            $(message).not(".author-is-owner").find("span.author a.yt-user-name").each(function (i, elem) {

                var authorNameLc = elem.textContent.toLowerCase();
                if (!newAuthorSet.has(authorNameLc)) {
                    newAuthorSet.add(authorNameLc);
                    newAuthorTrie.add(authorNameLc, {name: elem.textContent});
                }
            });
        });
        authorTrie = newAuthorTrie;
        authorSet = newAuthorSet;
    }

    function suggestAuthors(suggestBox, name) {
        var suggestedAuthorElements = [];

        if (name && name.length > 0) {
            var name_lower = name.toLowerCase();

            var root = authorTrie.find(name_lower);

            if (root != null) {
                suggestedAuthorElements = root.getMetas(MAX_SUGGESTIONS).map(meta => {
                    let authorElement = $("<span></span>");
                    authorElement.text(meta.name);
                    return authorElement;
                });
            }
        }

        suggestBox.setContents(suggestedAuthorElements);

    }

    function completeAuthorSuggestion(suggestBox, authorName, youtube) {
        if (authorName) {
            var completedString = "@" + authorName;
            if (addColon) {
                completedString += ":";
            }
            suggestBox.replaceSuggestion(youtube.getJChatInputField(), "@", completedString, true);
        }
    }

    // MAIN

    YouTubeLive.onChatLoaded(function (youtube) {
        // fetch initial authorTrie
        resetAuthors(youtube);

        // make sure we remove authorTrie from time to time so we don't get a list of x-thousand users
        youtube.setInterval(function () {
            resetAuthors(youtube)
        }, 60000); // 1 minute

        youtube.registerChatMessageObserver(function (message) {
            var authorName = $(message).not(".author-viewing").find("a.yt-user-name").text();
            var authorNameLc = authorName.toLowerCase();
            if (authorName && !authorSet.has(authorNameLc)) {
                authorTrie.add(authorNameLc, {name: authorName});
                authorSet.add(authorNameLc);
            }
        });

        var suggestBox = new SuggestionBox(
            "author",
            youtube.getJChatInputField(),
            function (authorName, suggestBox) {
                completeAuthorSuggestion(suggestBox, authorName, youtube);
            });

        suggestBox.addTrigger(youtube.getJChatInputField(), "@", function (namePart) {
            suggestAuthors(suggestBox, namePart);
        })
    });
}