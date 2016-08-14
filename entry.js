function include_face_emotes() {
    chrome.storage.local.get("emotePack", function (items) {
            if (items.emotePack != null) {
                var style = document.createElement('style');
                var head = document.getElementsByTagName('head')[0];
                var css = '';
                for (var i = 0; i < items.emotePack.images.length; i++) {
                    var img = items.emotePack.images[i];
                    css += '.yt-emoji-icon[title="'
                        + img.emote
                        + '"] {background: no-repeat url( data:image/png;base64,'
                        + img.base64
                        + ') !important; width: '
                        + img.width
                        + 'px !important; height: '
                        + img.height + 'px !important;} ';
                }
                style.innerHTML = css;
                if (head) {
                    head.appendChild(style);
                }
            }
        }
    )
    ;
}

// Entry point
chrome.storage.sync.get(default_settings, function (settings) {
    if (settings.twitchKeywordReplacement) {
        include_keyword_replacement();
    }

    if (settings.faceEmotes) {
        include_face_emotes();
    }

    if (settings.suggestUser) {
        include_user_suggestions();
    }
});