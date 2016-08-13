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
            var whatWasReplaced = '';
            var theInnerHTML = textInput.innerHTML.replace(emotePattern, function(token) {
                replaced = true;
                whatWasReplaced = token;
                return emote_map[token];
            });
            if (replaced) {
                var replacedPosition = textInput.innerHTML.indexOf(whatWasReplaced);
                textInput.innerHTML = theInnerHTML;
                placeCaretAtPosition(textInput, replacedPosition + 1);
            }
        });
      }
      clearInterval(comment_add_timer);
    }
}


http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
 function placeCaretAtPosition(el, position) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

