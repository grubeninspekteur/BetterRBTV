function include_user_filter(settings) {
    function createMenuButton(label) {
        return $('<a href="#" class="brbtv-user-actions-item yt-ui-menu-item">' + label + '</a>');
    }

    YouTubeLive.onChatLoaded(function (youtube) {
        var theCss = ".brbtv-user-actions-menu {" +
            "background-color: white;" +
            "display: none;}\n";
        theCss += ".brbtv-user-actions-item {color: black !important;}";
        theCss += ".show-brbtv-user-actions-menu {display: block !important;}";
        theCss += ".brbtv-highlighted-message {background-color: rgb(255, 136, 77) !important;}";
        addCssToHead(theCss);

        var mutedUsers = new Set();
        for (var i = 0; i < settings.ignoredUsers.length; i++) {
            mutedUsers.add(settings.ignoredUsers[i].id);
        }

        chrome.storage.onChanged.addListener(function (changes, namespace) {
            var ignoredUserChange = changes["ignoredUsers"];
            if (ignoredUserChange) {
                mutedUsers = new Set();
                for (var i = 0; i < ignoredUserChange.newValue.length; i++) {
                    mutedUsers.add(ignoredUserChange.newValue[i].id);
                }
            }
        });

        youtube.registerChatMessageObserver(function (message) {
                let jMessage = $(message);
                if (jMessage.hasClass("author-viewing")) return; // don't ignore yourself!
                var jUserLink = jMessage.find("a.yt-user-name");
                if (!jUserLink.length) return;
                let ytId = jUserLink.attr('data-ytid');
                if (mutedUsers.has(ytId)) {
                    jMessage.remove();
                } else {
                    var jActionsBox = $('<div class="brbtv-user-actions-menu yt-uix-menu-content yt-ui-menu-content"></div>');

                    let jVisitProfile = createMenuButton("Profil besuchen");
                    jVisitProfile.attr("href", jUserLink.attr('href'));
                    jActionsBox.append(jVisitProfile);

                    let jMuteUser = createMenuButton("Stummschalten");
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
                }
            },
            true);

    })
}