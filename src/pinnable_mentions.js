function include_pinnable_mentions() {
    function createPinnedMention(commentElem) {

        let message = $(commentElem);

        if ($.contains(document, message[0])) {

            // search for mentions inside comment
            var mention = message.find('.mention');
            if (mention.length) {

                var userName = message.find('#author-name').text().trim();
                var commentMsg = message.find('#message').text().trim();

                let pinnedMention = $("<li>", {class: "pinnedMention"}).append(
                    $("<div>", {class: "content-pinnedMention"}).text(userName + ': ' + commentMsg)
                ).append(
                    $("<div>", {class: "remove-pinnedMention"}).text("×")
                );

                // create pinned mention and attach it to the container
                $("#brbtv-pinnedMentions-container").append(pinnedMention);
                pinnedMention[0].addEventListener('click', function (pinnedMention) {
                    return function (e) {
                        $(pinnedMention).remove();
                    }
                }(pinnedMention[0]));
            }
        }

        message = null;
    }


    YouTubeLive.onChatLoaded(function (youtube) {

        // attach the container to the chat
        // doesn't really matter where to prepend, I just chose a DIV that has already position: relative
        if (!$("#brbtv-pinnedMentions-container").length) {
            $('#chat-messages #contents').prepend('<ul id="brbtv-pinnedMentions-container"></ul>');
        } else {
            $("#brbtv-pinnedMentions").empty();
        }

        // inject CSS
        addCssToHead(`
		#brbtv-pinnedMentions-container {
			position: absolute;
			top: 55px;
			left: 14px;
			z-index: 30000000;
			right: 14px;
			max-height: 75%;
			overflow-x: hidden;
			overflow-y: auto;
			margin: 0;
			padding: 0;
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
			padding: 4px;
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

        youtube.registerChatMessageObserver(createPinnedMention, false);
    });
}