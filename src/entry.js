const BRBTV_DEBUG = true;
const BRBTV_COMMIT_VERSION = 123; // last commit # for which a message was generated containing useful information

function addOtherCSS(items) {

    var css = '';
	
	// small workaround: prevent text rendering issues when hovering over username badges
	css += ".live-chat-widget {-webkit-backface-visibility: hidden;}";

    if (items.hideAvatars == true) {
        css += ".comment .avatar {display: none !important;}";
        // without seeing avatars, you shouldn't be able to report them
        css += ".comment-action-report-profile-image {display: none !important;}";
    }

    if (items.saveSpace == true) {
        css += ".live-chat-widget .author-is-moderator .byline, " +
            ".live-chat-widget .author-is-member .byline, " +
            ".live-chat-widget .author-is-owner .byline, " +
            ".live-chat-widget .comment.fan-funding-tip .byline, " +
            ".live-chat-widget .comment.new-member-announcement .byline {display: inline !important;}";
        css += ".live-chat-widget .author-is-moderator .avatar, " +
            ".live-chat-widget .author-is-member .avatar, " +
            ".live-chat-widget .author-is-owner .avatar, " +
            ".live-chat-widget .comment.fan-funding-tip .avatar {width: 24px !important; height: 24px !important; padding-left: 4px !important; padding-right: 4px !important;}";
        // we know our name, thank you very much.
        css += "#live-comments-controls .byline {display: none !important;}";
        css += ".live-chat-widget .comment:not(.new-member-announcement) .yt-user-name:after {content: ':'}";
        css += ".live-chat-widget .byline {margin-right: 0.5ch !important;}";
        css += ".live-chat-widget .comment {padding: 4px 16px 4px 10px !important;}";
        css += ".live-chat-widget .comments-textarea { min-height: 32px !important; }";
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
        css += ".live-chat-widget .comment {border-bottom: 1px solid rgba(0,0,0,0.2);}";
        css += ".live-chat-widget.dark .comment {border-top: 1px solid rgba(255,255,255,0.2); border-bottom: 1px solid rgba(0,0,0,0.6); }";
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
                css += '.yt-emoji-'
                    + img.emote.codePointAt(0).toString(16)
                    + ' {background: no-repeat url( data:image/png;base64,'
                    + img.base64
                    + ') !important; width: '
                    + img.width
                    + 'px !important; height: '
                    + img.height + 'px !important;} ';
            }
            if (!addCssToHead(css)) console.warn("BRBTV error: Could not add style to head");

            if (settings.lastMessageConfirmedVersion < 123) {
                let theWarning = $("<div></div>");
                theWarning.css("background-color", "blue");
                theWarning.css("color", "white");
                theWarning.css("cursor", "pointer");
                theWarning.text(chrome.i18n.getMessage("Warning_Version123"));
                theWarning.click(function (e) {
                    chrome.storage.sync.set({"lastMessageConfirmedVersion": BRBTV_COMMIT_VERSION});
                    theWarning.css("display", "none");
                });
                $("body").prepend(theWarning);
            }
        } else {
                chrome.storage.sync.set({"lastMessageConfirmedVersion": BRBTV_COMMIT_VERSION}); // dismiss the warning since user has not yet installed an emote pack
        }
        });
    }
}

function addEmojiTooltips() {
    $(".live-comments-emoji-picker").find(".yt-emoji-icon").each(function (index, elem) {
        keyword = emoji_to_keyword[elem.getAttribute("key")];
        if (keyword) {
            elem.setAttribute("title", keyword);
        } else {
            elem.setAttribute("title", "-no keyword-");
        }
    });
}

// *** ENTRY POINT ***
// Non Chrome browsers: if sync is not available, redirect to local storage
if (!chrome.storage.sync) {
    chrome.storage.sync = chrome.storage.local;
}

function initializeYoutube() {
    YouTubeLive.resetPage();
    removeCssFromHead();

    chrome.storage.sync.get(default_settings, function (settings) {
        if (settings.twitchKeywordReplacement) {
            include_keyword_replacement(settings);
        }

        // only bother inserting css if we are on YouTube Live
        YouTubeLive.onChatLoaded(function (youtube) {
            addOtherCSS(settings);
            addFaceEmotes(settings);
            addEmojiTooltips();
        });

        // moved higher up so comments get filtered and removed earlier
        include_chat_filter(settings);
        include_user_filter(settings);


        if (settings.suggestUser) {
            include_user_suggestions(settings.addColonAfterInsertedUser);
        }

        if (settings.suggestEmote) {
            include_keyword_suggestions();
        }

        if (settings.recentEmotes) {
            include_recent_emotes();
        }

        if (settings.showTimestamp) {
            include_timestamp();
        }

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
if (page) {
    let observer = new MutationObserver(function (mutations) {
        if (BRBTV_DEBUG) console.log("page changed to " + document.location.href);
        initializeYoutube();
    });
    observer.observe(page, {attributes: true});
}
