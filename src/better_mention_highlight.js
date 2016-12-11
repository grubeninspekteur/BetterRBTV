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
        addCssToHead(`
			yt-live-chat-text-message-renderer.brbtv-highlight-mention {
				background-color: #00796b !important;
				border-top: 0 !important;
				border-bottom: 0 !important;
			}
			
			yt-live-chat-text-message-renderer.brbtv-highlight-mention #author-name {
			    color: white !important;
			}
		`);
        youtube.registerChatMessageObserver(handleMention, true);
    });
}