function include_keyword_replacement() {
    var comment_add_timer = setInterval(checkForCommentInput, 100);

    var emote_map = {
        "NotLikeThis" : "😱",
        "FailFish" : "😑",
        "Keepo" : "🐼",
        "KappaPride" : "👬",
        "Kreygasm" : "😚",
        "SwiftRage" : "😠",
        "OhMyDog" : "🐶",
        "ResidentSleeper" : "😴",
        "BabyRage" : "😨",
        "PogChamp" : "😯",
        "WutFace" : "😧",
        "FeelsBadMan" : "😖",
        "BibleThumb" : "😭",
        "4Head" : "😏",
        "MingLee" : "🐯",
        "EleGiggle" : "😁",
        "DansGame" : "👿"
    };

    var emotePattern = new RegExp(Object.keys(emote_map).join("|"));

    function checkForCommentInput() {
      if (document.readyState != 'complete') return;
      var textInput = document.getElementById("live-comments-input-field");
      
      // are we on Youtube live? Here, the chat loads later
      if (document.getElementById("watch-sidebar-discussion") != null && textInput == null) return;
      if (textInput != null) {
        textInput.addEventListener("keyup", function(event) {
            var replaced = false;
            var theInnerHTML = textInput.innerHTML.replace(emotePattern, function(token) {
                replaced = true;
                return emote_map[token];
            });
            if (replaced) textInput.innerHTML = theInnerHTML;
            placeCaretAtEnd(textInput);
        });
      }
      clearInterval(comment_add_timer);
    }

    // http://stackoverflow.com/questions/4233265/contenteditable-set-caret-at-the-end-of-the-text-cross-browser
}

 function placeCaretAtEnd(el) {
    el.focus();
    if (typeof window.getSelection != "undefined"
            && typeof document.createRange != "undefined") {
        var range = document.createRange();
        range.selectNodeContents(el);
        range.collapse(false);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
    } else if (typeof document.body.createTextRange != "undefined") {
        var textRange = document.body.createTextRange();
        textRange.moveToElementText(el);
        textRange.collapse(false);
        textRange.select();
    }
}
