function handleMention(commentElem) {

    var jCommentElem = $(commentElem);
    var mention = jCommentElem.find('.mention');
	
    if (mention.length) {
        mention.removeClass('mention');
		jCommentElem.addClass('brbtv-highlight-mention');
    }
}

function include_better_mention_highlight() {
    YouTubeLive.onChatLoaded(function (youtube) {
        loadAndAddCssFile('mention-highlight.css');
        youtube.registerChatMessageObserver(handleMention, true);
    });
}