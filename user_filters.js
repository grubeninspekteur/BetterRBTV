function include_user_filter(settings) {
    function createMenuButton(group, label) {
        return $('<a href="#" class="brbtv-user-actions-item yt-ui-menu-item '+group+'">' + label + '</a>');
    }

    YouTubeLive.onChatLoaded(function (youtube) {
        var theCss = ".brbtv-user-actions-menu {" +
            "background-color: white;" +
            "display: none;}\n";
        theCss += ".brbtv-user-actions-item {color: black !important;}";
        theCss += ".show-brbtv-user-actions-menu {display: block !important;}";
        theCss += ".brbtv-highlighted-message .accent-bar {background-color: rgb(204, 0, 0) !important;}";
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

        youtube.registerChatMessageObserver(function (message) {
                let jMessage = $(message);
                // don't show menu for yourself or VIP announcements
                if (jMessage.hasClass("author-viewing") || jMessage.hasClass("new-member-announcement")) return;
                var jUserLink = jMessage.find("a.yt-user-name");
                if (!jUserLink.length) return;
                let ytId = jUserLink.attr('data-ytid');

                function addHighlightUserButton(jMessage) {
                    let jHighlightUser = createMenuButton("brbtv-highlight-button", "Hervorheben");
                    jHighlightUser.click(function (e) {
                        if (!highlightedUsers.has(ytId)) {
                            highlightedUsers.add(ytId);
                            chrome.storage.sync.get({highlightedUsers: []}, function (items) {
                                var highlightedUsers = items.highlightedUsers;
                                highlightedUsers.push({
                                    name: jUserLink.text(),
                                    id: ytId,
                                    addedTime: Date.now()
                                });
                                chrome.storage.sync.set({"highlightedUsers": highlightedUsers});
                            });

                            youtube.iteratePastChatMessages(function (message) {
                                let jIteratedMessage = $(message);
                                if (jIteratedMessage.find("a.yt-user-name[data-ytid='" + ytId + "']").length) {
                                    jIteratedMessage.addClass("brbtv-highlighted-message");
                                    jIteratedMessage.find(".brbtv-highlight-button").remove();
                                    addUnHighlightUserButton(jIteratedMessage);
                                }
                            });
                        }
                        e.preventDefault();
                    });
                    jMessage.find(".brbtv-user-actions-menu").find(".brbtv-visit-button").after(jHighlightUser);
                }

                function addUnHighlightUserButton(jMessage) {
                    let jUnhighlightUser = createMenuButton("brbtv-unhighlight-button", "Nicht hervorheben");
                    jUnhighlightUser.click(function (e) {
                        if (highlightedUsers.has(ytId)) {
                            highlightedUsers.delete(ytId);
                            chrome.storage.sync.get({highlightedUsers: []}, function (items) {
                                var highlightedUsers = items.highlightedUsers.filter(u => u.id != ytId);
                                chrome.storage.sync.set({"highlightedUsers": highlightedUsers});
                            });

                            youtube.iteratePastChatMessages(function (message) {
                                let jIteratedMessage = $(message);
                                if (jIteratedMessage.find("a.yt-user-name[data-ytid='" + ytId + "']").length) {
                                    jIteratedMessage.removeClass("brbtv-highlighted-message");
                                    jIteratedMessage.find(".brbtv-unhighlight-button").remove();
                                    addHighlightUserButton(jIteratedMessage);
                                }
                            });
                        }
                        e.preventDefault();
                    });
                    jMessage.find(".brbtv-user-actions-menu").find(".brbtv-visit-button").after(jUnhighlightUser);
                }

                if (mutedUsers.has(ytId)) {
                    jMessage.remove();
                } else {
                    var jActionsBox = $('<div class="brbtv-user-actions-menu yt-uix-menu-content yt-ui-menu-content"></div>');
                    jUserLink.before(jActionsBox);
                    jUserLink.click(function (e) {
                        jActionsBox.addClass("show-brbtv-user-actions-menu");
                        var hideMenuFunction = function (e) {
                            if (e.target != jUserLink[0]) {
                                jActionsBox.removeClass("show-brbtv-user-actions-menu");
                                $(this).off("click", hideMenuFunction);
                            }
                        };
                        $("body").on("click", hideMenuFunction);
                        e.preventDefault();
                    });

                    var userIsHighlighted = highlightedUsers.has(ytId);
                    if (userIsHighlighted) {
                        jMessage.addClass("brbtv-highlighted-message");
                    }

                    let jVisitProfile = createMenuButton("brbtv-visit-button", "Profil besuchen");
                    jVisitProfile.attr("href", jUserLink.attr('href'));
                    jActionsBox.append(jVisitProfile);

                    if (!userIsHighlighted) {
                        addHighlightUserButton(jMessage);
                    } else {
                        addUnHighlightUserButton(jMessage);
                    }

                    let jMuteUser = createMenuButton("brbtv-mute-button", "Stummschalten");
                    jMuteUser.click(function (e) {
                        if (!mutedUsers.has(ytId)) {
                            mutedUsers.add(ytId);
                            chrome.storage.sync.get({ignoredUsers: []}, function (items) {
                                var ignoredUsers = items.ignoredUsers;
                                ignoredUsers.push({
                                    name: jUserLink.text(),
                                    id: ytId,
                                    addedTime: Date.now()
                                });
                                chrome.storage.sync.set({"ignoredUsers": ignoredUsers});
                            });
                            addCssToHead('a.yt-user-name[data-ytid="' + ytId + '"] {text-decoration: line-through;}');
                        }
                        e.preventDefault();
                    });
                    jActionsBox.append(jMuteUser);
                }
            },
            true);

    })
}