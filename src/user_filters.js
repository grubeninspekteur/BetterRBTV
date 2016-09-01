function include_user_filter(settings) {
    function createMenuButton(group, label) {
        return $('<a href="#" class="brbtv-user-actions-item yt-ui-menu-item ' + group + '">' + label + '</a>');
    }

    const ADD_ACTION = true;
    const REMOVE_ACTION = false;

    YouTubeLive.onChatLoaded(function (youtube) {
        var theCss = "#brbtv-user-actions-menu {" +
            "background-color: white;" +
            "display: none;" +
            "position: absolute;}\n";
        theCss += ".brbtv-user-actions-item {color: black !important;}";
        theCss += ".show-brbtv-user-actions-menu {display: block !important;}";
        theCss += ".brbtv-highlighted-message .accent-bar {background-color: rgb(204, 0, 0) !important;}";
        theCss += ".brbtv-muted-message .yt-user-name {text-decoration: line-through !important;}";
        addCssToHead(theCss);

        var mutedUsers = new Set();
        for (let i = 0; i < settings.ignoredUsers.length; i++) {
            mutedUsers.add(settings.ignoredUsers[i].id);
        }

        var highlightedUsers = new Set();
        for (let i = 0; i < settings.highlightedUsers.length; i++) {
            highlightedUsers.add(settings.highlightedUsers[i].id);
        }

        chrome.storage.onChanged.addListener(function (changes, namespace) {
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

        var jUserMenu = $('<div id="brbtv-user-actions-menu" class="yt-uix-menu-content yt-ui-menu-content"></div>');
        $("body").prepend(jUserMenu);

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

        function addHighlightUserButton(ytId, jUserLink) {
            let jHighlightUser = createMenuButton("brbtv-highlight-button", chrome.i18n.getMessage("userActionHighlight"));
            jHighlightUser.click(function (e) {
                if (!highlightedUsers.has(ytId)) {
                    highlightedUsers.add(ytId);
                    updateChromeStore(jUserLink, ytId, "highlightedUsers", ADD_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (jIteratedMessage.find("a.yt-user-name[data-ytid='" + ytId + "']").length) {
                            jIteratedMessage.addClass("brbtv-highlighted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            jUserMenu.append(jHighlightUser);
        }

        function addUnhighlightUserButton(ytId, jUserLink) {
            let jUnhighlightUser = createMenuButton("brbtv-unhighlight-button", chrome.i18n.getMessage("userActionUnHighlight"));
            jUnhighlightUser.click(function (e) {
                if (highlightedUsers.has(ytId)) {
                    highlightedUsers.delete(ytId);
                    updateChromeStore(jUserLink, ytId, "highlightedUsers", REMOVE_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (jIteratedMessage.find("a.yt-user-name[data-ytid='" + ytId + "']").length) {
                            jIteratedMessage.removeClass("brbtv-highlighted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            jUserMenu.append(jUnhighlightUser);
        }

        function addMuteButton(ytId, jUserLink) {
            let jMuteUser = createMenuButton("brbtv-mute-button", chrome.i18n.getMessage("userActionMute"));
            jMuteUser.click(function (e) {
                if (!mutedUsers.has(ytId)) {
                    mutedUsers.add(ytId);
                    updateChromeStore(jUserLink, ytId, "ignoredUsers", ADD_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (jIteratedMessage.find("a.yt-user-name[data-ytid='" + ytId + "']").length) {
                            jIteratedMessage.addClass("brbtv-muted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            jUserMenu.append(jMuteUser);
        }

        function addUnmuteButton(ytId, jUserLink) {
            let jMuteUser = createMenuButton("brbtv-unmute-button", chrome.i18n.getMessage("userActionUnMute"));
            jMuteUser.click(function (e) {
                if (mutedUsers.has(ytId)) {
                    mutedUsers.delete(ytId);
                    updateChromeStore(jUserLink, ytId, "ignoredUsers", REMOVE_ACTION);

                    youtube.iteratePastChatMessages(function (message) {
                        let jIteratedMessage = $(message);
                        if (jIteratedMessage.find("a.yt-user-name[data-ytid='" + ytId + "']").length) {
                            jIteratedMessage.removeClass("brbtv-muted-message");
                        }
                    });
                }
                e.preventDefault();
            });
            jUserMenu.append(jMuteUser);
        }

        function addHideMenuFunction(jUserLink) {
            var hideMenuFunction = function (e) {
                if (e.target != jUserLink[0]) {
                    jUserMenu.removeClass("show-brbtv-user-actions-menu");
                    $(this).off("click", hideMenuFunction);
                }
            };
            $("body").on("click", hideMenuFunction);
        }

        youtube.registerChatMessageObserver(function (message) {
            let jMessage = $(message);
            // don't show menu for yourself or VIP announcements
            if (jMessage.hasClass("author-viewing") || jMessage.hasClass("new-member-announcement")) return;

            var jUserLink = jMessage.find("a.yt-user-name");
            if (!jUserLink.length) return;
            let ytId = jUserLink.attr('data-ytid');

            if (mutedUsers.has(ytId)) {
                jMessage.remove();
                return;
            }

            if (highlightedUsers.has(ytId)) {
                jMessage.addClass("brbtv-highlighted-message");
            }

            jUserLink.click(function (e) {
                jUserMenu.empty();
                let linkPosition = jUserLink.offset();
                jUserMenu.css("top", linkPosition.top + jUserLink.height() + "px");
                jUserMenu.css("left", linkPosition.left + "px");

                let jVisitProfile = createMenuButton("brbtv-visit-button", chrome.i18n.getMessage("userActionVisitProfile"));
                jVisitProfile.attr("href", jUserLink.attr('href'));
                jUserMenu.append(jVisitProfile);

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
                jUserMenu.addClass("show-brbtv-user-actions-menu");
            });

        }, true);
    });
}