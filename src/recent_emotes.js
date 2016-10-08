/* Adds another tab to the youtube emoji picker menu
 *  with all recently used emojis.
 *  Depends heavily on the infrastructure used by YouTube,
 *  so if that'll change someday, this will need to be changed for sure.
 */

function include_recent_emotes() {
    const STORAGE_KEY = "brbtvRecentEmotes";
    const MAX_EMOJI_COUNT = 100;
    var emojiClassPattern = /yt-emoji-([0-9a-fA-F]+)/;

    function updateRecentEmojisInStore(emoteIds) {
        if (!emoteIds.length) return;

        // debug quick tool: uncomment this next line and comment the code afterwards to clear your history when you insert an emote
        // chrome.storage.sync.remove("brbtvRecentEmotes");


        let query = {};
        query[STORAGE_KEY] = {};
        chrome.storage.sync.get(query, function (items) {
            var theUpdatedObject = items[STORAGE_KEY];

            for (let emoteId of emoteIds) {
                theUpdatedObject[emoteId] = Date.now();
            }

            query[STORAGE_KEY] = theUpdatedObject;
            chrome.storage.sync.set(query);
        });
    }


    function addEmoteToRecent(commentElem) {
        if (Math.round(((new Date) - 60000) / 1000) < $(commentElem).data('timestamp')) {

            if ($(commentElem).hasClass('author-viewing')) {
                var emojiIds = [];

                $(commentElem).find('.yt-emoji-icon').map(function () {
                    var match = emojiClassPattern.exec(this.className);
                    if (match) {
                        emojiIds.push(match[1]);
                    }
                });

                updateRecentEmojisInStore(emojiIds);
            }
        }
    }


    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(`
		.live-comments-emoji-type-button.emoji-brbtvRecent {
			height: 30px;
			width: 30px;
			background: no-repeat url(` + chrome.extension.getURL('img/icon_clock_black.png') + `) center center;
			background-size: 16px 16px;
		}
		
		.live-comments-emoji-type-button.emoji-brbtvRecent.active {
			background-image: url(` + chrome.extension.getURL('img/icon_clock_white.png') + `);
		}
		`);

        var emotesHTML = $('<div>', {
            'class': "live-comments-emoji-pane live-comments-emoji-pane-brbtvRecent",
            'key': "brbtvRecent"
        });

        $('.live-comments-emoji-picker .live-comments-emoji-picker-tab-cell').prepend($('<button>',
            {
                'class': "yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty live-comments-emoji-type-button emoji-brbtvRecent",
                'type': "button",
                'onclick': ";return false;",
                'key': "brbtvRecent"
            }));
        $('.live-comments-emoji-picker .live-comments-emoji-tab-pane-bucket').prepend(emotesHTML);

        function updateRecentEmojisTab(emojiToTimestamp) {
            emotesHTML.empty();
            let emojiIds = Object.keys(emojiToTimestamp);

            if (emojiIds.length) {
                emojiIds.sort(function (x, y) {
                    return emojiToTimestamp[x] < emojiToTimestamp[y];
                });

                emojiIds = emojiIds.slice(0, Math.min(emojiIds.length, MAX_EMOJI_COUNT));


                for (let emojiId of emojiIds) {
                    emotesHTML.append($('<button>', {
                            'class': "live-comments-emoji-button",
                            'id': 'recent-' + emojiId,
                            'key': emojiId
                        }).append(
                        $('<span>', {
                            'class': "yt-emoji-icon yt-emoji-" + emojiId
                        })
                        )
                    );
                }
            } else {
                emotesHTML.append($('<div>').append($('<em>').text(chrome.i18n.getMessage("recentEmojisNone"))).css("padding", "5px 5px 5px 5px"));
                emotesHTML.css("display", "none");
            }
        }

        let query = {};
        query[STORAGE_KEY] = {};
        chrome.storage.sync.get(query, function (items) {
            updateRecentEmojisTab(items[STORAGE_KEY]);
            if (Object.keys(items[STORAGE_KEY]).length) {
                $('.live-comments-emoji-picker .live-comments-emoji-type-button').removeClass('active');
                $('.live-comments-emoji-picker .live-comments-emoji-pane-people').addClass('hid');
                $('.live-comments-emoji-picker .live-comments-emoji-type-button .emoji-brbtvRecent').addClass('active');
            }
        });
        youtube.addStorageListener(function (changes, namespace) {

            if (changes[STORAGE_KEY]) {
                updateRecentEmojisTab(changes[STORAGE_KEY].newValue);
            }
        });

        youtube.registerChatMessageObserver(addEmoteToRecent, true);
    });
}