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
            "FailFish": "🤦",
            "FeelsAmazingMan": "😄",
            "FeelsAndreasMan": "🗿",
            "FeelsBadMan": "😖",
            "FeelsGoodMan": "🐸",
            "FrankerZ": "🐶",
            "GunnarRich": "🤑",
            "haHAA": "😹",
            "HeyGuys": "🙋",
            "KAPOW": "💥",
            "KappaClaus": "🎅",
            "KappaNils": "😼",
            "KappaPride": "🌈",
            "KappaRoss": "💂",
            "Keepo": "😏",
            "KKona": "👦",
            "Kreygasm": "😚",
            "Larsgasm": "😽",
            "LaserRage": "💢",
            "LUL": "😂",
            "MingLee": "🐯",
            "MrDestructoid": "🤖",
            "MVGame": "😕",
            "NicenStein": "😸",
            "NotLikeGregor": "😵",
            "NotLikeThis": "🙈",
            "OhMyDog": "🐕",
            "OMGScoots": "📙",
            "OpieOP": "🍧",
            "panicBasket": "🔥",
            "PedoBear": "🐻",
            "PJSalt": "🍚",
            "PogChamp": "😯",
            "rbtv10": "💶",
            "rbtv50": "💷",
            "ZehnMarkFünfzig": "💶 💷",
            "rbtv64k": "💰",
            "rbtvApfelschorle": "🍺",
            "rbtvAvatar": "👤",
            "rbtvAwkward": "😅",
            "rbtvBastard": "🐵",
            "rbtvBohne": "🍆",
            "rbtvBudi": "😱",
            "rbtvChick": "🐥",
            "rbtvClown": "👺",
            "rbtvColin": "😫",
            "rbtvEddy": "💤",
            "rbtvFischkarte": "🐟",
            "rbtvGeier": "🐓",
            "rbtvGino": "😾",
            "rbtvGregor": "😵",
            "rbtvGunnar": "😅",
            "rbtvHannes": "😪",
            "rbtvHebel": "⤵",
            "rbtvHeMan": "👱",
            "rbtvKrogi": "😸",
            "rbtvKuchen": "🍰",
            "rbtvLars": "😽",
            "rbtvLaser": "💢",
            "rbtvLogo": "⬜",
            "rbtvMarco": "😿",
            "rbtvMTV": "⬛",
            "rbtvNils": "😼",
            "rbtvReinke": "🤴",
            "rbtvRoyalBudi": "😇",
            "rbtvRoyalEddy": "😣",
            "rbtvRoyalNils": "☺",
            "rbtvRoyalSimon": "😓",
            "rbtvSchroeck": "🎬",
            "rbtvSimon": "🙀",
            "rbtvSofia": "😮",
            "rbtvSupaa": "☝",
            "rbtvTim": "😙",
            "rbtvVogel": "🐦",
            "rbtvWombo": "🎉",
            "rbtvAxt": "⚔",
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
                var result = emotePattern.exec(textInput.textContent);
                if (result) {
                    var keyword = result[0];
                    // find first text node containing the position
                    let lengthPassed = 0;
                    for (let i = 0; i < textInput.childNodes.length; i++) {
                        if (textInput.childNodes[i].nodeType != 3) continue;
                        if (result.index > textInput.childNodes[i].nodeValue.length + lengthPassed) {
                            lengthPassed += textInput.childNodes[i].nodeValue.length;
                        } else {
                            replacement = emote_map[keyword];
                            textInput.childNodes[i].nodeValue = textInput.childNodes[i].nodeValue.replaceBetween(
                                result.index - lengthPassed,
                                result.index - lengthPassed + keyword.length,
                                replacement);
                            setCaretPosition(textInput, result.index + replacement.length);
                            // fire input change event so the polymer can update its internal copy of the comment text
                            textInput.dispatchEvent(new CustomEvent("input"));

                            return;
                        }
                    }
                }
            });
        }
    });
}