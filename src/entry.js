function addOtherCSS(items) {

    var css = '';

    // small workaround: prevent text rendering issues when hovering over username badges
    css += ".live-chat-widget {-webkit-backface-visibility: hidden;}";

    if (items.hideAvatars == true) {
        css += "#author-photo {display: none !important;}";
    }

    addCssToHead(css);

    if (items.saveSpace == true) {
		loadAndAddCssFile('save-space.css');
    }

    if (items.lessVipHighlight == true) {
        loadAndAddCssFile('less-vip-highlight.css');
    }
}

function addFaceEmotes(settings) {
    if (settings.faceEmotes == true) {
        chrome.storage.local.get("emotePack", function (items) {
            if (items.emotePack != null) {
                var css = '';
                for (var i = 0; i < items.emotePack.images.length; i++) {
                    var img = items.emotePack.images[i];

                    // use CSS to push img out of box - see https://css-tricks.com/replace-the-image-in-an-img-with-css/
                    css += 'yt-live-chat-text-message-renderer #message img[alt="' + img.emote + '"], yt-emoji-picker-category-renderer #emoji img[src$="emoji_u' + img.emote.codePointAt(0).toString(16) + '.svg"] {' +
                        'display: inline-block !important; -moz-box-sizing: border-box !important; box-sizing: border-box !important;' +
                        'background: no-repeat url( data:image/png;base64,'
                        + img.base64
                        + ') !important; width: '
                        + img.width
                        + 'px !important; height: '
                        + img.height + 'px !important;' +
                        'padding-left: ' + img.width + 'px !important; } ';
                }
                succeeded = addCssToHead(css);
                if (BRBTV_DEBUG && !succeeded) console.warn("BRBTV error: Could not add style to head");
            }
        });
    }
}

// *** ENTRY POINT ***
// Due to Firefox's sync storage feature being unstable, we redirect to local sync
if (BRBTV_IS_FIREFOX) {
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

            if (BRBTV_DEBUG) console.log("BRBTV: Deleted unique ID based highlights & mutes, disabled hide avatars, cleared up unneeded options");
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
			include_better_separate_messages();
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
