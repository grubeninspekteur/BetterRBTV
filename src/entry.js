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
		yt-live-chat-text-message-renderer.brbtv-removed-message {
		    display: none;
		}
		
		.yt-live-chat-text-message-renderer-0 {
			padding: 6px 24px 6px 8px;
		}
		.yt-live-chat-text-message-renderer-0 #author-photo.yt-live-chat-text-message-renderer {
			width: 24px;
			height: 24px;
			margin-right: 10px;
		}

		/* Message Input */

		.yt-live-chat-message-input-renderer-0 {
			padding: 8px 10px;
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

    if (items.lessVipHighlight == true) {
	
		css += `
			.yt-live-chat-legacy-paid-message-renderer-0 {
				background-color: transparent !important;
				font-size: 13px !important;
				align-items: flex-start !important;
				padding: 6px 24px 6px 8px !important;
				min-height: 32px !important;
				margin: 0 !important;
				border-radius: 0 !important;
			}
			.ytg-watch-page .yt-live-chat-legacy-paid-message-renderer-0 {
				background-color: #1b1b1b !important;
			}
			.yt-live-chat-legacy-paid-message-renderer-0 #event-text.yt-live-chat-legacy-paid-message-renderer {
				color: rgba(0,0,0, 0.5) !important;
			}
			.ytg-watch-page .yt-live-chat-legacy-paid-message-renderer-0 #event-text.yt-live-chat-legacy-paid-message-renderer {
				color: rgba(255, 255, 255, 0.7) !important;
			}
			.yt-live-chat-legacy-paid-message-renderer-0 #detail-text.yt-live-chat-legacy-paid-message-renderer {
				color: rgba(0,0,0, 0.7) !important;
			}
			.ytg-watch-page .yt-live-chat-legacy-paid-message-renderer-0 #detail-text.yt-live-chat-legacy-paid-message-renderer {
				color: rgba(255, 255, 255, 1) !important;
			}
			.yt-live-chat-legacy-paid-message-renderer-0 #detail-text.yt-live-chat-legacy-paid-message-renderer {
				font-size: 13px !important;
			}
			.yt-live-chat-legacy-paid-message-renderer-0 #author-photo.yt-live-chat-legacy-paid-message-renderer {
				width: 24px !important;
				height: 24px !important;
				-webkit-align-self: auto !important;
				align-self: auto !important;
				margin: 0 10px 0 0 !important;
			}
		`
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
            chrome.storage.sync.remove(["showTimestamp", "suggestEmote", "suggestUser", "noGreenMemberAccent"]);

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


		
		if(settings.betterSeperateMessages) {
			include_better_seperate_messages();
		}
		

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
