function addTimestamp(commentElem) {
    if (commentElem.hasAttribute("data-timestamp") && !commentElem.classList.contains("new-member-announcement")) {
        var date = new Date(parseInt(commentElem.getAttribute("data-timestamp")) * 1000);
        $(commentElem).find(".avatar").before('<span class="comment-time" title="' + date.format() + '">' + date.format("HH:MM") + '</span>');
    }
}

function include_timestamp() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(".comment-time {color:grey; font-size: 12px; padding-top: 4px; padding-right: 4px;}");
        youtube.registerChatMessageObserver(addTimestamp, true);
    });
}