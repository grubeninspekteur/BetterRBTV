function include_keyword_replacement() {

    YouTubeLive.onChatLoaded(function (youtube) {
        var emote_map = {
            "ANELE": "👳",
            "AngelThump": "👼",
            "4Head": "😺",
            "BabyRage": "😨",
            "BudiRage": "😱",
            "BibleThump": "😭",
            "CedricSleeper": "💤",
            "CoolCat": "😎",
            "CryZer": "😿",
            "DatSheffy": "👮",
            "DansGame": "👿",
            "DansGino": "😾",
            "deIlluminati": "🔺",
            "EleGiggle": "😁",
            "FailColin": "😫",
            "FailFish": "😑",
            "FeelsAmazingMan": "😄",
            "FeelsAndreasMan": "🗿",
            "FeelsBadMan": "😖",
            "FeelsGoodMan": "🐸",
            "FrankerZ": "🐶",
            "GunnarRich": "💰",
            "haHAA": "😹",
            "HeyGuys": "🙋",
            "KappaClaus": "🎅",
            "KappaNils": "😼",
            "KappaPride": "👬",
            "KappaRoss": "💂",
            "Keepo": "😏",
            "KKona": "👦",
            "Kreygasm": "😚",
            "Larsgasm": "😽",
            "LaserRage": "💢",
            "LUL": "😂",
            "MingLee": "🐯",
            "MrDestructoid": "📟",
            "NicenStein": "😸",
            "NotLikeGregor": "😵",
            "NotLikeThis": "🙈",
            "OhMyDog": "🐕",
            "PedoBear": "🐻",
            "PJSalt": "🍚",
            "PogChamp": "😯",
            "rbtvApfelschorle": "🍺",
            "rbtvVogel": "🐦",
            "ResidentSleeper": "😴",
            "SchröckAction": "🎬",
            "SeemsGood": "👍",
            "SMOrc": "👹",
            "SMSkull": "💀",
            "SofiOh": "😮",
            "SoonerLater": "😶",
            "SwiftRage": "😠",
            "WutFace": "😧",
            "WutMon": "🙀"
        };

        var emotePattern = new RegExp(Object.keys(emote_map).join("|"));

        var textInput = youtube.getChatInputField();
        if (textInput) {
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
                    setCaretPosition(textInput, replacedPosition + 2);
                }
            });
        }
    });
}