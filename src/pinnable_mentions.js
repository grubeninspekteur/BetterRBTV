// create the general mentions container
var pinnedMentionsContainer = $('<ul id="brbtv-pinnedMentions-container"></ul>');

function createPinnedMention(commentElem) {

	// when initiated and it iterates the existing comments, only check comments from within the last 60 seconds
	if( Math.round( ((new Date) - 60000) / 1000 ) < $(commentElem).data('timestamp') ) {
	
		// search for mentions inside comment
		var mention = $(commentElem).not('.author-viewing').find('.mention');
		if (mention.length) {
			
			var userName = $(commentElem).find('.yt-user-name').text().trim();
			var commentMsg = $(commentElem).find('.comment-text').text().trim();
			
			// create pinned mention and attach it to the container
			pinnedMentionsContainer.append('<li class="pinnedMention"><div class="content-pinnedMention">'+userName+': '+commentMsg+'</div><div class="remove-pinnedMention">&times;</div></li>');
			
		}
		
	}

}

function include_pinnable_mentions() {

    YouTubeLive.onChatLoaded(function (youtube) {
		
		// attach the container to the chat
		// doesn't really matter where to prepend, I just chose a DIV that has already position: relative
		$('#live-comments-section > .relative').prepend( pinnedMentionsContainer );
		
		// inject CSS
		addCssToHead(`
		#brbtv-pinnedMentions-container {
			position: absolute;
			top: 10px;
			left: 14px;
			z-index: 30000000;
			right: 14px;
			max-height: 75%;
			overflow-x: hidden;
			overflow-y: auto;
			box-shadow: 3px 3px 0px rgba(0,0,0,0.3);
		}
		#brbtv-pinnedMentions-container li.pinnedMention {
			background-color: #00796b;
			display: block;
			
			border-top: 1px solid #009c8a;
			border-left: 1px solid #009c8a;
			border-right: 1px solid #006155;
			border-bottom: 1px solid #006155;
			font-size: 85%;
			color: #fff;
			
			display: -webkit-flex;
			display: flex;
			justify-content: space-between;
		}
		#brbtv-pinnedMentions-container li.pinnedMention:hover {
			background-color: #009c8a;
			cursor: pointer;
		}
		#brbtv-pinnedMentions-container li.pinnedMention .content-pinnedMention {
			padding: 8px;
			align-self: flex-start;
		}
		#brbtv-pinnedMentions-container li.pinnedMention .remove-pinnedMention {
			font-size: 2em;
			padding: 0 0.5em;
			align-self: flex-start;
			cursor: pointer;
			opacity: 0.75;
		}
		#brbtv-pinnedMentions-container li.pinnedMention:hover .remove-pinnedMention,
		#brbtv-pinnedMentions-container li.pinnedMention .remove-pinnedMention:hover {
			opacity: 1;
		}
		`);
		
		// create an event listener, that will also work for dynamically created elements
		$('#brbtv-pinnedMentions-container').on('click', 'li.pinnedMention', function(e) {
			$(e.currentTarget).remove();
		});
		
        youtube.registerChatMessageObserver(createPinnedMention, false);
    });
}