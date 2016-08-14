function filterInitialChat(pattern) {
    $("#all-comments").find(".comment").each(function (idx, elem) {
        filterComment(pattern, elem);
    });
}

var jHidingMessage = null;
var jCommentsScroller = null;

function filterComment(pattern, comment) {
    var jComment = $(comment);
    if (jComment.hasClass('author-viewing')) return; // don't remove your own comments
    if (pattern.test(jComment.find(".comment-text").text())) {

        // removing a comment with a height of more than one line may ruin the scroll position - we scroll back to the bottom
        var wasScrolling = !jHidingMessage.hasClass("hid");
        jComment.remove();
        if (!wasScrolling) {
           jCommentsScroller.scrollTop(jCommentsScroller[0].scrollHeight);
        }
    }
}

function include_chat_filter(settings) {
    if (settings.blockedTerms.termString == '') return;
    onChatLoaded(function() {
        jHidingMessage = $("#live-comments-setting-bottom-scroll");
        jCommentsScroller =  $("#comments-scroller");
        var pattern;
        if (settings.blockedTerms.isRegex) {
            pattern = new RegExp(settings.blockedTerms.termString);
        } else {
            pattern = new RegExp(settings.blockedTerms.termString.split(/\s+/).map(escapeRegExp).join("|"));
        }

        filterInitialChat(pattern);
        registerChatObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if ($(mutation.addedNodes[i]).hasClass("comment")) {
                        filterComment(pattern, mutation.addedNodes[i]);
                    }
                }
            });
        });
    });
}

function escapeRegExp(str) {
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}