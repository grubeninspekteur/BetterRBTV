function filterComment(pattern, comment) {
    var jComment = $(comment);
    if (pattern.test(jComment.find("#message").text().trim())) {
        jComment.addClass("brbtv-removed-message");
    }
}

function include_chat_filter(settings) {
    if (settings.blockedTerms.termString == '') return;
    YouTubeLive.onChatLoaded(function(youtube) {
        var ownName = $("yt-live-chat-message-input-renderer").find("#author-name").text();

        var pattern;
        if (settings.blockedTerms.isRegex) {
            pattern = new RegExp(settings.blockedTerms.termString);
        } else {
            pattern = new RegExp(settings.blockedTerms.termString.split(/\s+/).map(escapeRegExp).join("|"));
        }

        youtube.registerChatMessageObserver(function (elem) {
            // don't delete your own messages
            if ($(elem).find("#author-name").text() == ownName) return;
            filterComment(pattern, elem);
        }, true);
    });
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}