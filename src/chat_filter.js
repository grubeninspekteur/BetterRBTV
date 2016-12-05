function filterComment(pattern, comment) {
    var jComment = $(comment);
    // Fixme apparently there is no way of knowing whether this is our own message or someone else's
    //if (jComment.hasClass('author-viewing')) return; // don't remove your own comments
    if (pattern.test(jComment.find("#message").text().trim())) {
        jComment.remove();
    }
}

function include_chat_filter(settings) {
    if (settings.blockedTerms.termString == '') return;
    YouTubeLive.onChatLoaded(function(youtube) {
        var pattern;
        if (settings.blockedTerms.isRegex) {
            pattern = new RegExp(settings.blockedTerms.termString);
        } else {
            pattern = new RegExp(settings.blockedTerms.termString.split(/\s+/).map(escapeRegExp).join("|"));
        }

        youtube.registerChatMessageObserver(function (elem) {
            filterComment(pattern, elem);
        }, true);
    });
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}