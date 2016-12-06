function include_user_filter(settings) {
    function createMenuButton(group, label) {
        return $("<a>", {
            "href": "#",
            "class": "brbtv-user-actions-item yt-ui-menu-item " + group
        }).text(label);
    }

    const ADD_ACTION = true;
    const REMOVE_ACTION = false;

    YouTubeLive.onChatLoaded(function (youtube) {
        var theCss = "#brbtv-user-actions-menu {" +
            "background-color: rgba(0, 0, 0, 0.498039);" +
            "display: none;" +
            "position: absolute;" +
            "outline: none; position: fixed; left: 1747.39px; top: 315px; z-index: 103;}\n";
        theCss += "#brbtv-user-actions-menu ytg-menu-popup-renderer {outline: none; box-sizing: border-box; max-width: 160.609px; max-height: 96px;}";
        theCss += ".brbtv-user-actions-item {color: white; font-family: Roboto, Arial, sans-serif; font-size: 15px; display: block;}";
        theCss += ".show-brbtv-user-actions-menu {display: block !important;}";
        theCss += ".brbtv-highlighted-message {background-color: rgb(204, 0, 0) !important; border-top: 0 !important; border-bottom: 0 !important;}";
        theCss += ".brbtv-highlighted-message .comment-time, .brbtv-highlighted-message .byline {color: rgba(255,255,255,0.54) !important;}";
        theCss += ".brbtv-highlighted-message .mention {background-color: transparent !important;}";
        theCss += ".brbtv-highlighted-message .comment-text {color: #fff !important;}";
        theCss += ".brbtv-highlighted-message .accent-bar {background-color: rgb(204, 0, 0) !important;}";
        theCss += ".brbtv-highlighted-message #author-name a {color: #fff !important;}";
        theCss += ".brbtv-muted-message .yt-user-name {text-decoration: line-through !important;}";

        theCss += ".brbtv-author-link {cursor: pointer; color: inherit;}";
        addCssToHead(theCss);

        var mutedUsers = new Set();
        for (let i = 0; i < settings.ignoredUsers.length; i++) {
            mutedUsers.add(settings.ignoredUsers[i].id);
        }

        var highlightedUsers = new Set();
        for (let i = 0; i < settings.highlightedUsers.length; i++) {
            highlightedUsers.add(settings.highlightedUsers[i].id);
        }

        youtube.addStorageListener(function (changes, namespace) {
            var ignoredUserChange = changes["ignoredUsers"];
            if (ignoredUserChange) {
                mutedUsers = new Set();
                for (let i = 0; i < ignoredUserChange.newValue.length; i++) {
                    mutedUsers.add(ignoredUserChange.newValue[i].id);
                }
            }

            var highlightedUserChange = changes["highlightedUsers"];
            if (highlightedUserChange) {
                highlightedUsers = new Set();
                for (let i = 0; i < highlightedUserChange.newValue.length; i++) {
                    highlightedUsers.add(highlightedUserChange.newValue[i].id);
                }
            }
        });

        if (!$("#brbtv-user-actions-menu").length) {
            let jUserMenu = $("<div>", {
                "id": "brbtv-user-actions-menu"
            });
            $("yt-live-chat-renderer").prepend(jUserMenu);
            delete jUserMenu;
        }

        function updateChromeStore(jUserLink, ytId, storageKey, isAddToList) {
            let query = {};
            query[storageKey] = [];
            chrome.storage.sync.get(query, function (items) {
                var theUpdatedArray = items[storageKey];
                if (isAddToList) {
                    theUpdatedArray.push({
                        name: jUserLink.text().trim(),
                        id: ytId,
                        addedTime: Date.now()
                    });
                } else {
                    theUpdatedArray = theUpdatedArray.filter(u => u.id != ytId);
                }

                query[storageKey] = theUpdatedArray;

                chrome.storage.sync.set(query);
            });
        }

        function isMessageByUser(jChatMessage, userId) {
            let parts = userId.split(" ");
            let photoSrc = parts[0];
            let authorName = parts.slice(1).join(" ");

            return jChatMessage.find('#author-photo[src="' + photoSrc + '"]').length && jChatMessage.find("#author-name").text() == authorName;
        }

        function addHighlightUserButton(ytId, jUserLink) {
            let jHighlightUser = createMenuButton("brbtv-highlight-button", chrome.i18n.getMessage("userActionHighlight"));
            jHighlightUser[0].addEventListener('click', function (e) {
                if (!highlightedUsers.has(ytId)) {
                    highlightedUsers.add(ytId);
                    updateChromeStore(jUserLink, ytId, "highlightedUsers", ADD_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (isMessageByUser(jIteratedMessage, ytId)) {
                            jIteratedMessage.addClass("brbtv-highlighted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            addMenuItem(jHighlightUser);
        }

        function addMenuItem(jItem) {
            $("#brbtv-user-actions-menu").append(jItem);
        }

        function addUnhighlightUserButton(ytId, jUserLink) {
            let jUnhighlightUser = createMenuButton("brbtv-unhighlight-button", chrome.i18n.getMessage("userActionUnHighlight"));
            jUnhighlightUser[0].addEventListener('click', function (e) {
                if (highlightedUsers.has(ytId)) {
                    highlightedUsers.delete(ytId);
                    updateChromeStore(jUserLink, ytId, "highlightedUsers", REMOVE_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (isMessageByUser(jIteratedMessage, ytId)) {
                            jIteratedMessage.removeClass("brbtv-highlighted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            addMenuItem(jUnhighlightUser);
        }

        function addMuteButton(ytId, jUserLink) {
            let jMuteUser = createMenuButton("brbtv-mute-button", chrome.i18n.getMessage("userActionMute"));
            jMuteUser[0].addEventListener('click', function (e) {
                if (!mutedUsers.has(ytId)) {
                    mutedUsers.add(ytId);
                    updateChromeStore(jUserLink, ytId, "ignoredUsers", ADD_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (isMessageByUser(jIteratedMessage, ytId)) {
                            jIteratedMessage.addClass("brbtv-muted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            addMenuItem(jMuteUser);
        }

        function addUnmuteButton(ytId, jUserLink) {
            let jMuteUser = createMenuButton("brbtv-unmute-button", chrome.i18n.getMessage("userActionUnMute"));
            jMuteUser[0].addEventListener('click', function (e) {
                if (mutedUsers.has(ytId)) {
                    mutedUsers.delete(ytId);
                    updateChromeStore(jUserLink, ytId, "ignoredUsers", REMOVE_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (isMessageByUser(jIteratedMessage, ytId)) {
                            jIteratedMessage.removeClass("brbtv-muted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            addMenuItem(jMuteUser);
        }

        function addHideMenuFunction(jUserLink) {
            var hideMenuFunction = function (e) {
                if (e.target != jUserLink[0]) {
                    $("#brbtv-user-actions-menu").removeClass("show-brbtv-user-actions-menu");
                    $(this).off("click", hideMenuFunction);
                }
            };
            $("body").on("click", hideMenuFunction); // necessary exception from no-jQuery-handlers rule: we have to detach it globally after page change
        }

        function insertDoubleclickedAuthor(e) {
            $("#brbtv-user-actions-menu").removeClass("show-brbtv-user-actions-menu");

            var replacement = '@' + $(e.currentTarget).text();

            replacement += "\u00A0";
            var jTextInput = youtube.getJChatInputField();
            if (jTextInput.length) {
                let caretPosition = getCaretPosition(jTextInput[0]);
                jTextInput[0].normalize();

                // next, find the text node containing the caret
                // by this, we can safely skip other DOM elements created by YT (like img for emotes)
                var lengthPassed = 0;
                var replacementPerformed = false;


                jTextInput.contents().filter(function () {
                    return this.nodeType === 3; // i.e. this.nodeType == TEXT_NODE
                }).each(function (idx, elem) {
                    if (replacementPerformed) return;
                    if (caretPosition >= elem.nodeValue.length + lengthPassed) {
                        lengthPassed += elem.nodeValue.length;
                    } else {
                        elem.nodeValue = elem.nodeValue.replaceBetween(
                            caretPosition - lengthPassed,
                            caretPosition - lengthPassed,
                            replacement);
                        replacementPerformed = true;
                    }
                });

                if (!replacementPerformed) jTextInput.append(document.createTextNode(replacement));
                setCaretPosition(jTextInput[0], caretPosition + replacement.length);
                jTextInput.focus();
                jTextInput[0].dispatchEvent(new CustomEvent("input"));
            }
        }

        function showActionMenu(e) {
            let jUserLink = $(e.target);
            let jMessage = jUserLink.closest("yt-live-chat-text-message-renderer");
            let jUserMenu = $("#brbtv-user-actions-menu");
            let authorPhotoSrc = jMessage.find('img[id="author-photo"]').attr("src");
            let authorName = jMessage.find("#author-name").text();
            let ytId = authorPhotoSrc + " " + authorName;
            jUserMenu.empty();

            //let jVisitProfile = createMenuButton("brbtv-visit-button", chrome.i18n.getMessage("userActionVisitProfile"));
            //jVisitProfile.attr("href", jUserLink.attr('href'));
            //jUserMenu.append(jVisitProfile);

            if (highlightedUsers.has(ytId)) {
                addUnhighlightUserButton(ytId, jUserLink);
            } else {
                addHighlightUserButton(ytId, jUserLink);
            }

            if (!mutedUsers.has(ytId)) {
                addMuteButton(ytId, jUserLink);
            } else {
                addUnmuteButton(ytId, jUserLink);
            }
            e.preventDefault();
            addHideMenuFunction(jUserLink);

            let linkPosition = jUserLink.offset();
            let topPosition = linkPosition.top + jUserLink.height();
            if (topPosition + jUserMenu.height() > $("body").height()) topPosition = linkPosition.top - jUserMenu.height() - jUserLink.height();
            jUserMenu.css("top", topPosition + "px");
            jUserMenu.css("left", linkPosition.left + "px");

            jUserMenu.addClass("show-brbtv-user-actions-menu");
        }

        youtube.registerChatMessageObserver(function (message) {
            let jMessage = $(message);

            // TODO find new-member-announcement equivalent in new chat
            if (jMessage.hasClass("new-member-announcement")) return;

            let authorPhotoSrc = jMessage.find('img[id="author-photo"]').attr("src");
            let authorName = jMessage.find("#author-name").text();
            let ytId = authorPhotoSrc + " " + authorName;

            // don't show menu if we don't have a photo to work with
            if (authorPhotoSrc == "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7") {
                return;
            }

            if (mutedUsers.has(ytId)) {
                jMessage.remove();
                return;
            }

            let jUserLink = $("<a>", {
                href: "#",
                class: "brbtv-author-link"
            }).text(authorName);

            jMessage.find("#author-name").html(jUserLink);

            if (highlightedUsers.has(ytId)) {
                jMessage.addClass("brbtv-highlighted-message");
            }

            jUserLink[0].addEventListener('click', showActionMenu);


            // insert the name as a mention on doubleclick
            jUserLink[0].addEventListener('dblclick', insertDoubleclickedAuthor);

            jUserLink = null;

        }, true);
    });
}