function handleComment(commentElem) {
	
	let $comment = $(commentElem);
	let $commentIndex = $comment.index();
    
	if ($comment.length && $commentIndex % 2 == 0) {
        $comment.addClass('brbtv-alternate');
    }
}

function include_better_seperate_messages() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(`
		.yt-live-chat-text-message-renderer-0 {
			border-bottom: 1px solid #111;
			border-top: 1px solid #333;
		}
		.yt-live-chat-text-message-renderer-0.brbtv-alternate {
			background-color: rgba(100,100,100,0.1);
		}
		`);
        youtube.registerChatMessageObserver(handleComment, true);
    });
}