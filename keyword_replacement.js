function include_keyword_replacement() {

    YouTubeLive.onChatLoaded(function (youtube) {
        var emote_map = {
            "ANELE": "👳",
            "AngelThump": "👼",
            "4Head": "😺",
            "BabyRage": "😨",
            "BudiRage": "😱",
            "BibleThump": "😭",
            "BrokeBack": "😝",
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
            "KAPOW": "💥",
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
            "OMGScoots": "📙",
            "OpieOP": "🍧",
            "PanicBasket": "🔥",
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
            "TTours": "📷",
            "TwitchRPG": "🔨",
            "VoHiYo": "💠",
            "VoteNay": "❌",
            "VoteYea": "⭕",
            "WutFace": "😧",
            "WutMon": "🙀"
        };

        var emotePattern = new RegExp(Object.keys(emote_map).join("|"));

        var textInput = youtube.getChatInputField();
        if (textInput) {
            textInput.addEventListener("keyup", function (event) {
                var replaced = false;
                var replacement = '';
                var whatWasReplaced = '';
                var theInnerHTML = textInput.innerHTML.replace(emotePattern, function (token) {
                    replaced = true;
                    whatWasReplaced = token;
                    replacement = emote_map[token];
                    return replacement;
                });
                if (replaced) {
                    var replacedPosition = textInput.innerHTML.indexOf(whatWasReplaced);
                    textInput.innerHTML = theInnerHTML;
                    setCaretPosition(textInput, replacedPosition + replacement.length);
                }
            });
        }
    });
}