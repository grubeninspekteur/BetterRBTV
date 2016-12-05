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
			yt-live-chat-text-message-renderer #message.brbtv-highlight-mention,
			yt-live-chat-text-message-renderer #message.alternate_row.brbtv-highlight-mention,
			yt-live-chat-text-message-renderer #message.dark.brbtv-highlight-mention,
			yt-live-chat-text-message-renderer #message.alternate-row.brbtv-highlight-mention {
				background-color: #00796b;
				border-top: 0 !important;
				border-bottom: 0 !important;
			}
			yt-live-chat-text-message-renderer #message.brbtv-highlight-mention .comment-text,
			yt-live-chat-text-message-renderer #message.alternate_row.brbtv-highlight-mention .comment-text,
			yt-live-chat-text-message-renderer #message.dark.brbtv-highlight-mention .comment-text,
			yt-live-chat-text-message-renderer #message.alternate-row.brbtv-highlight-mention .comment-text {
				color: rgba(255,255,255,0.87);
			}
			yt-live-chat-text-message-renderer #message.brbtv-highlight-mention .comment-time,
			yt-live-chat-text-message-renderer #message.alternate_row.brbtv-highlight-mention .comment-time,
			yt-live-chat-text-message-renderer #message.dark.brbtv-highlight-mention .comment-time,
			yt-live-chat-text-message-renderer #message.alternate-row.brbtv-highlight-mention .comment-time,
			yt-live-chat-text-message-renderer #message.brbtv-highlight-mention .byline,
			yt-live-chat-text-message-renderer #message.alternate_row.brbtv-highlight-mention .byline,
			yt-live-chat-text-message-renderer #message.dark.brbtv-highlight-mention .byline,
			yt-live-chat-text-message-renderer #message.alternate-row.brbtv-highlight-mention .byline {
				color: rgba(255,255,255,0.54);
			}
			
			.live-chat-widget .comment.brbtv-highlight-mention .content a.yt-user-name {
				color: #fff !important;
			}
		`);
        youtube.registerChatMessageObserver(handleMention, true);
    });
}