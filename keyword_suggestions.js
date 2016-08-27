function include_keyword_suggestions() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(".brbtv-emoji-preview {margin-right: 1em;}");

        var trie = new Trie();
        for (keyword in keyword_to_emoji) {
            trie.add(keyword);
        }

        // TODO remove, tis just a test
        /*var root = trie.find(":w"); // should find :whale and others
         var list = root.getWords(4);
         for (var i = 0; i < list.length; i++) {
         console.log(list[i]);
         }*/

        var suggestBox = new SuggestionBox(
            "keyword",
            youtube.getJChatInputField(),
            function (emoteKeyword, suggestBox) {
                if (emoteKeyword) {
                    suggestBox.replaceSuggestion(youtube.getJChatInputField(), ":", emoteKeyword, false);
                }
            }
        );

        suggestBox.addTrigger(youtube.getJChatInputField(), ":", function (keywordPart) {
            var contents = [];

            if (keywordPart && keywordPart.length >= 2) {
                var root = trie.find(":" + keywordPart);
                if (root != null) {
                    contents = root.getWords(MAX_SUGGESTIONS).map(function (k) {
                        return $('<span><span class="brbtv-emoji-preview yt-emoji-icon yt-emoji-' + keyword_to_emoji[k] + '"></span>' + k + '</span>')
                    });
                }
            }

            suggestBox.setContents(contents);
        });
    })
}