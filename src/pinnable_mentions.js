function include_pinnable_mentions() {
    function createPinnedMention(commentElem) {

        let message = $(commentElem);

        if (!message.hasClass("brbtv-removed-message")) {

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

        loadAndAddCssFile('pinnable-mentions.css');

        youtube.registerChatMessageObserver(createPinnedMention, false);
    });
}