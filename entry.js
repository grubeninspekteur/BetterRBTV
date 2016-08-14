function addOtherCSS(items) {

    var css = '';

    if (items.hideAvatars == true) {
        css += ".comment .avatar {display: none !important;}";
    }

    addCssToHead(css);
}

function addFaceEmotes(settings) {
    if (settings.faceEmotes == true) {
        chrome.storage.local.get("emotePack", function(items) {
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
            if (!addCssToHead(css)) console.warn("BRBTV error: Could not add style to head");
        });
    }
}



// Entry point
chrome.storage.sync.get(default_settings, function (settings) {
    if (settings.twitchKeywordReplacement) {
        include_keyword_replacement();
    }

    addOtherCSS(settings);
    addFaceEmotes(settings);

    if (settings.suggestUser) {
        include_user_suggestions();
    }

    if (settings.showTimestamp) {
        include_timestamp();
    }

    include_chat_filter(settings);
});