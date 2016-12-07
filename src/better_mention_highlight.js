function handleMention(commentElem) {
	
	var mention = $(commentElem).find('.mention');
	
    if (mention.length) {
        mention.removeClass('mention');
		mention.parents('#message').addClass('brbtv-highlight-mention');
    }
}

function include_better_mention_highlight() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(`
			yt-live-chat-text-message-renderer {
				background-color: #00796b;
				border-top: 0 !important;
				border-bottom: 0 !important;
			}
			
			yt-live-chat-text-message-renderer #author-name {
			    color: white !important;
		`);
        youtube.registerChatMessageObserver(handleMention, true);
    });
}