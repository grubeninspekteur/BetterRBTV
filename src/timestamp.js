function addTimestamp(commentElem) {
    if (commentElem.hasAttribute("data-timestamp") && !commentElem.classList.contains("new-member-announcement")) {
        var date = new Date(parseInt(commentElem.getAttribute("data-timestamp")) * 1000);
        $(commentElem).find(".avatar").before(
            $("<span>", {
                "class": "comment-time",
                "title": date.format()
            }).text(date.format("HH:MM")));
    }
}

function include_timestamp() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(".live-chat-widget .comment-time {color:rgba(0,0,0,0.54); font-size: 12px; padding-top: 4px; padding-right: 4px;} .live-chat-widget.dark .comment-time {color:rgba(255,255,255,0.54);}");
        youtube.registerChatMessageObserver(addTimestamp, true);
    });
}