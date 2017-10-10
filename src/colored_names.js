function copyAvatarId(commentElem) {

    var jCommentElem = $(commentElem);
	var avatar = jCommentElem.find('#img');
	var avatarSrcParts = avatar.attr('src').split('/');
	var userName = jCommentElem.find('#author-name');
	
    if (userName.length && avatar.length) {
		userName.addClass('brbtv-color-' + avatarSrcParts[3]);
    }
}

function include_colored_names() {
    YouTubeLive.onChatLoaded(function (youtube) {
        loadAndAddCssFile('name-colors.css');
		youtube.registerChatMessageObserver(copyAvatarId, true);
	});
}