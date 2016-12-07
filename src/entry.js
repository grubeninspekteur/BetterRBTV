const BRBTV_DEBUG = true;
const BRBTV_COMMIT_VERSION = 174; // last commit # for which a message was generated containing useful information

function addOtherCSS(items) {

    var css = '';

    // small workaround: prevent text rendering issues when hovering over username badges
    css += ".live-chat-widget {-webkit-backface-visibility: hidden;}";

    if (items.hideAvatars == true) {
        css += "#author-photo {display: none;}";
    }

    if (items.saveSpace == true) {
		css += 
		`
		.yt-live-chat-text-message-renderer-0 {
			padding: 6px 24px 6px 10px;
		}
		.yt-live-chat-text-message-renderer-0 #author-photo.yt-live-chat-text-message-renderer {
			width: 24px;
			height: 24px;
			margin-right: 10px;
		}

		/** Message Input **/

		.yt-live-chat-message-input-renderer-0 {
			padding: 6px 10px;
		}

		.yt-live-chat-message-input-renderer-0 #top.yt-live-chat-message-input-renderer,
		.yt-live-chat-message-input-renderer-0 #pickers.yt-live-chat-message-input-renderer,
		.yt-live-chat-message-input-renderer-0 #error-message.yt-live-chat-message-input-renderer {
			margin: 0;
		}
		/* smaller avatar */
		.yt-live-chat-message-input-renderer-0 #avatar.yt-live-chat-message-input-renderer {
			height: 24px;
			width: 24px;
		}
		/* remove own user name */
		.yt-live-chat-message-input-renderer-0 #author.yt-live-chat-message-input-renderer {
			display: none;
		}
		`;
    }

    if (items.noGreenMemberAccent == true) {
        css += ".live-chat-widget.enable-memberships .comment.author-is-member:not(.brbtv-highlighted-message) .accent-bar  {display: none !important;}";
    }

    if (items.lessVipHighlight == true) {
        css += ".live-chat-widget .comment.fan-funding-tip, .live-chat-widget .comment.new-member-announcement, .live-chat-widget.dark .comment.fan-funding-tip, .live-chat-widget.dark .comment.new-member-announcement {background-color: initial !important;}";
        css += ".live-chat-widget .comment.fan-funding-tip.pinned, .live-chat-widget .comment.new-member-announcement.pinned {background-color: #fff !important;}";
        css += ".live-chat-widget.dark .comment.fan-funding-tip.pinned, .live-chat-widget.dark .comment.new-member-announcement.pinned {background-color: #1b1b1b !important;}";
        css += ".live-chat-widget .comment.new-member-announcement .byline {color: #0f9d58 !important;}";
        css += ".live-chat-widget .comment.fan-funding-tip, .live-chat-widget .comment.fan-funding-tip .comment-text, .live-chat-widget .comment.new-member-announcement .comment-text {color: rgba(0,0,0,0.54) !important;}";
        css += ".live-chat-widget.dark .comment.fan-funding-tip, .live-chat-widget.dark .comment.fan-funding-tip .comment-text, .live-chat-widget.dark .comment.new-member-announcement .comment-text {color: rgba(255,255,255,0.54) !important;}";
        css += ".live-chat-widget .comment.fan-funding-tip:not(:hover) .comment-text a, .live-chat-widget .comment.new-member-announcement .comment-text a {color:#000 !important;}";
        css += ".live-chat-widget.dark .comment:not(:hover) .comment-text a {color:#fff !important;}";
        css += ".live-chat-widget.dark .comment:hover .comment-text a {color:#fff !important;}";
    }
    if (items.betterSeperateMessages == true) {
        css += 
		`
		.yt-live-chat-text-message-renderer-0 {
			border-bottom: 1px solid #111;
			border-top: 1px solid #333;
		}
		.yt-live-chat-text-message-renderer-0:nth-last-child(even) {
			background-color: rgba(100,100,100,0.1);
		}
		`;
    }

    addCssToHead(css);
}

function addFaceEmotes(settings) {
    if (settings.faceEmotes == true) {
        chrome.storage.local.get("emotePack", function (items) {
            if (items.emotePack != null) {
                var css = '';
                for (var i = 0; i < items.emotePack.images.length; i++) {
                    var img = items.emotePack.images[i];

                    // use CSS to push img out of box - see https://css-tricks.com/replace-the-image-in-an-img-with-css/
                    css += 'yt-live-chat-text-message-renderer #message img[alt="' + img.emote + '"], yt-emoji-picker-category-renderer #emoji img[alt="' + img.emote + '"] {' +
                        'display: inline-block !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;' +
                        'background: no-repeat url( data:image/png;base64,'
                        + img.base64
                        + ') !important; width: '
                        + img.width
                        + 'px !important; height: '
                        + img.height + 'px !important;' +
                        'padding-left: ' + img.width + 'px !important; } ';
                }
                if (!addCssToHead(css)) console.warn("BRBTV error: Could not add style to head");
            }
        });
    }
}

// *** ENTRY POINT ***
// Non Chrome browsers: if sync is not available, redirect to local storage
if (!chrome.storage.sync) {
    chrome.storage.sync = chrome.storage.local;
}

function initializeYoutube() {
    removeCssFromHead();

    chrome.storage.sync.get(default_settings, function (settings) {
        if (settings.lastMessageConfirmedVersion < BRBTV_COMMIT_VERSION) {
            chrome.storage.sync.set({"lastMessageConfirmedVersion": BRBTV_COMMIT_VERSION});

            // delete old-style ytIds
            chrome.storage.sync.set({"ignoredUsers" : []});
            chrome.storage.sync.set({"highlightedUsers" : []});

            // disable hide avatars so user sees warning about problems with mute/highlight
            chrome.storage.sync.set({"hideAvatars": false});

            // remove obsolete options
            chrome.storage.sync.remove(["showTimestamp", "suggestEmote", "suggestUser"]);

            console.log("BRBTV: Deleted unique ID based highlights & mutes, disabled hide avatars, cleared up unneeded options");
        }

        if (settings.twitchKeywordReplacement) {
            include_keyword_replacement(settings);
        }

        // only bother inserting css if we are on YouTube Live
        YouTubeLive.onChatLoaded(function (youtube) {
            addOtherCSS(settings);
            addFaceEmotes(settings);
        });

        // moved higher up so comments get filtered and removed earlier
        include_chat_filter(settings);
        include_user_filter(settings);

        /*
		if (settings.pinnableMentions) {
            include_pinnable_mentions();
        }

        // put it before mention highlighting because it searches for .mention class inside comment, which the
        // following function would already have removed
        if (settings.soundNotifications) {
            include_sound_notifications();
        }
        if (settings.pushNotifications) {
            include_push_notifications();
        }
		*/
        if (settings.coloredNames) {
            include_colored_names();
        }

        if (settings.betterMentionHighlight) {
            include_better_mention_highlight();
        }

    });
}

initializeYoutube();
// listen to AJAX change events
let page = document.getElementById("page");
let videoIdPattern = /video-[a-zA-Z0-9]+/;
var lastSeenVideoId = "";

if (page) {
    let observer = new MutationObserver(function (mutations) {
        let match = videoIdPattern.exec(page.className);
        if (match) {
            if (match[0] != lastSeenVideoId) {
                lastSeenVideoId = match[0];
                if (BRBTV_DEBUG) console.log("video changed to " + lastSeenVideoId);
                YouTubeLive.resetPage();
                initializeYoutube();
            }
        } else if (lastSeenVideoId) {
            YouTubeLive.resetPage();
            removeCssFromHead();
            lastSeenVideoId = "";
        }

    });
    observer.observe(page, {attributes: true});
}
