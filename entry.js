function addOtherCSS(items) {

    var css = '';

    if (items.hideAvatars == true) {
        css += ".comment .avatar {display: none !important;}";
    }

    if (items.saveSpace == true) {
        css += ".live-chat-widget .author-is-moderator .byline, " +
            ".live-chat-widget .author-is-member .byline, " +
            ".live-chat-widget .author-is-owner .byline, " +
            ".live-chat-widget .comment.fan-funding-tip .byline, " +
            ".live-chat-widget .comment.new-member-announcement .byline {display: inline !important;}";
        css += ".live-chat-widget .author-is-moderator .avatar, " +
            ".live-chat-widget .author-is-member .avatar, " +
            ".live-chat-widget .author-is-owner .avatar, " +
            ".live-chat-widget .comment.fan-funding-tip .avatar {width: 24px !important; height: 24px !important; padding-left: 4px !important; padding-right: 4px !important;}";
        // we know our name, thank you very much.
        css += "#live-comments-controls .byline {display: none !important;}";
    }

    addCssToHead(css);
}

function addFaceEmotes(settings) {
    if (settings.faceEmotes == true) {
        chrome.storage.local.get("emotePack", function (items) {
            if (items.emotePack == null) return;
            var css = '';
            for (var i = 0; i < items.emotePack.images.length; i++) {
                var img = items.emotePack.images[i];
                css += '.yt-emoji-'
                    + img.emote.codePointAt(0).toString(16)
                    + ' {background: no-repeat url( data:image/png;base64,'
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

function addEmojiTooltips() {
    $(".live-comments-emoji-picker").find(".yt-emoji-icon").each(function (index, elem) {
        keyword = emoji_to_keyword[elem.getAttribute("key")];
        if (keyword) {
            elem.setAttribute("title", keyword);
        } else {
            elem.setAttribute("title", "-no keyword-");
        }
    });
}

// *** ENTRY POINT ***
chrome.storage.sync.get(default_settings, function (settings) {
    if (settings.twitchKeywordReplacement) {
        include_keyword_replacement(settings);
    }

    // only bother inserting css if we are on YouTube Live
    YouTubeLive.onChatLoaded(function (youtube) {
        addOtherCSS(settings);
        addFaceEmotes(settings);
        addEmojiTooltips();
    });

    if (settings.suggestUser) {
        include_user_suggestions();
    }

    if (settings.showTimestamp) {
        include_timestamp();
    }

    include_chat_filter(settings);
});