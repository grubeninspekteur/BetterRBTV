var messageIndex = 0;

function handleComment(commentElem) {
	
	// too performance hungry and unreliable, see below
	/*
	 messageIndex++;
	 	
	 let $comment = $(commentElem);
	 
	 if ($comment.length && messageIndex % 2 == 0) {
	 	$comment.addClass('brbtv-alternate');
	 }
	*/
	
}

function include_better_seperate_messages() {
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(`
		.yt-live-chat-text-message-renderer-0 {
			border-top: 1px solid #bbb;
			background: linear-gradient(to bottom, rgba(0,0,0,0.06) 00%, rgba(0,0,0,0) 50%);
		}
		.ytg-watch-page .yt-live-chat-text-message-renderer-0 {
			border-bottom: 1px solid #111;
			border-top: 1px solid #333;
			background: linear-gradient(to bottom, rgba(255,255,255,0) 50%, rgba(255,255,255,0.03) 100%);
		}
		

		
		`);
        
		/* disable any comment coloring for the moment. 
		 * the CSS only method would not let the colors
		 * "travel" with the chat,
		 * the javascript method of getting the index of each
		 * message seems to be too performance-hungry
		 * and too quirky (not reliable enough).
		 * Instead, we add a suble background gradient via css.
		*/
		// youtube.registerChatMessageObserver(handleComment, true);
    });
}