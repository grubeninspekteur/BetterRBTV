function deferredCheck(mutations, observer) {
	
	for (mutationRecord of mutations) {
		
		if (mutationRecord.attributeName == "src") {
			
			var jCommentElem = $(mutationRecord.target).closest("yt-live-chat-text-message-renderer");
			var avatar = jCommentElem.find('#img');
			var avatarSrcParts = avatar.attr('src').split('/');
			var userName = jCommentElem.find('#author-name');

			if (userName.length && avatar.length) {
				
				userName.addClass('brbtv-color-' + avatarSrcParts[3]);
			}

			observer.disconnect();
			return;
		}
	}

}

function copyAvatarId(commentElem) {

	const AVATAR_PLACEHOLDER_SRC = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

    var jCommentElem = $(commentElem);
	var avatar = jCommentElem.find('#img');
	
	// if photo not yet loaded, defer block/highlight actions
	if ( avatar && avatar.attr('src') == AVATAR_PLACEHOLDER_SRC) {
		let imageObserver = new MutationObserver(deferredCheck);
		imageObserver.observe(avatar[0], {"attributes": true});
	} else if (avatar && avatar.attr('src')) {
		var avatarSrcParts = avatar.attr('src').split('/');
		var userName = jCommentElem.find('#author-name');
		
		if (userName.length && avatar.length) {
			
			userName.addClass('brbtv-color-' + avatarSrcParts[3]);
		}
		
	}
	
}

function include_colored_names() {
    YouTubeLive.onChatLoaded(function (youtube) {
        loadAndAddCssFile('name-colors.css');
		youtube.registerChatMessageObserver(copyAvatarId, true);
	});
}