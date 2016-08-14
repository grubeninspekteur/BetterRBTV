function addTimestampToExistingComments() {
    $("#all-comments").find(".comment").each(function (idx, elem) {
        addTimestamp(elem);
    });
}

var jHidingMessage;
var jCommentsScroller = null;

function addTimestamp(commentElem) {
    if (commentElem.hasAttribute("data-timestamp")) {
        var date = new Date(parseInt(commentElem.getAttribute("data-timestamp")) * 1000);
        // http://stackoverflow.com/questions/12802722/how-to-check-if-two-dates-not-on-the-same-calendar-day
        if (jHidingMessage.length && jCommentsScroller.length) {
            var wasScrolling = !jHidingMessage.hasClass("hid");
            $(commentElem).find(".avatar").before('<span class="comment-time" title="' + date.format() + '">' + date.format("HH:MM") + '</span>');
            if (!wasScrolling) {
                jCommentsScroller.scrollTop(jCommentsScroller[0].scrollHeight);
            }
        }
    }
}

// http://stackoverflow.com/questions/542938/how-do-i-get-the-number-of-days-between-two-dates-in-javascript
function daydiff(first, second) {
    return Math.round(Math.abs(second - first) / (1000 * 60 * 60 * 24));
}

function include_timestamp() {
    onChatLoaded(function () {
        jHidingMessage = $("#live-comments-setting-bottom-scroll");
        jCommentsScroller =  $("#comments-scroller");
        addCssToHead(".comment-time {color:grey; font-size: 12px}");
        addTimestampToExistingComments();
        registerChatObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                for (var i = 0; i < mutation.addedNodes.length; i++) {
                    if ($(mutation.addedNodes[i]).hasClass("comment")) {
                        addTimestamp(mutation.addedNodes[i]);
                    }
                }
            });
        });
    });
}