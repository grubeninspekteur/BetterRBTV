function include_keyword_replacement() {

    onChatLoaded(function () {
        var emote_map = {
            "NotLikeThis": "😱",
            "FailFish": "😑",
            "Keepo": "🐼",
            "KappaPride": "👬",
            "Kreygasm": "😚",
            "SwiftRage": "😠",
            "OhMyDog": "🐶",
            "ResidentSleeper": "😴",
            "BabyRage": "😨",
            "PogChamp": "😯",
            "WutFace": "😧",
            "FeelsBadMan": "😖",
            "BibleThump": "😭",
            "4Head": "😏",
            "MingLee": "🐯",
            "EleGiggle": "😁",
            "DansGame": "👿"
        };

        var emotePattern = new RegExp(Object.keys(emote_map).join("|"));

        var textInput = document.getElementById("live-comments-input-field");
        if (textInput != null) {
            textInput.addEventListener("keyup", function (event) {
                var replaced = false;
                var whatWasReplaced = '';
                var theInnerHTML = textInput.innerHTML.replace(emotePattern, function (token) {
                    replaced = true;
                    whatWasReplaced = token;
                    return emote_map[token];
                });
                if (replaced) {
                    var replacedPosition = textInput.innerHTML.indexOf(whatWasReplaced);
                    textInput.innerHTML = theInnerHTML;
                    setCaretPosition(textInput, replacedPosition + 1);
                }
            });
        }
    });
}