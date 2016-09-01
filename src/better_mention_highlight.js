function handleMention(commentElem) {
	
	var mention = $(commentElem).find('.mention');
	
    if (mention.length) {
        mention.removeClass('mention');
		mention.parents('li.comment').addClass('brbtv-highlight-mention');
    }
}

function include_better_mention_highlight() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(`
			.live-chat-widget .comment.brbtv-highlight-mention,
			.live-chat-widget .comment.alternate_row.brbtv-highlight-mention,
			.live-chat-widget .comment.dark.brbtv-highlight-mention,
			.live-chat-widget .comment.alternate-row.brbtv-highlight-mention {
				background-color: #00796b;
				border-top: 0 !important;
				border-bottom: 0 !important;
			}
			.live-chat-widget .comment.brbtv-highlight-mention .comment-text,
			.live-chat-widget .comment.alternate_row.brbtv-highlight-mention .comment-text,
			.live-chat-widget .comment.dark.brbtv-highlight-mention .comment-text,
			.live-chat-widget .comment.alternate-row.brbtv-highlight-mention .comment-text {
				color: rgba(255,255,255,0.87);
			}
			.live-chat-widget .comment.brbtv-highlight-mention .comment-time,
			.live-chat-widget .comment.alternate_row.brbtv-highlight-mention .comment-time,
			.live-chat-widget .comment.dark.brbtv-highlight-mention .comment-time,
			.live-chat-widget .comment.alternate-row.brbtv-highlight-mention .comment-time,
			.live-chat-widget .comment.brbtv-highlight-mention .byline,
			.live-chat-widget .comment.alternate_row.brbtv-highlight-mention .byline,
			.live-chat-widget .comment.dark.brbtv-highlight-mention .byline,
			.live-chat-widget .comment.alternate-row.brbtv-highlight-mention .byline {
				color: rgba(255,255,255,0.54);
			}
			
			.live-chat-widget .comment.brbtv-highlight-mention .content a.yt-user-name {
				color: #fff !important;
			}
		`);
        youtube.registerChatMessageObserver(handleMention, true);
    });
}