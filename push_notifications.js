function createPushNotification(commentElem) {

	// http://www.html5rocks.com/en/tutorials/pagevisibility/intro/#toc-topic
	var browser_props = ['webkitHidden','mozHidden','msHidden','oHidden'];
	function getHiddenProp(){
		// if 'hidden' is natively supported just return it
		if ('hidden' in document) return 'hidden';
		
		// otherwise loop over all the known prefixes until we find one
		for (var i = 0; i < browser_props.length; i++){
			if ((browser_props[i]) in document)
				return browser_props[i];
		}

		// otherwise it's not supported
		return null;
	}
	function isHidden() {
		var prop = getHiddenProp();
		if (!prop) return false;
		
		return document[prop];
	}

	// uses Page Visibility API
	// = fires only when tab is not visible
	if (isHidden()) {
		
		// when initiated and it iterates the existing comments, only check comments from within the last 60 seconds
		if( Math.round( ((new Date) - 60000) / 1000 ) < $(commentElem).data('timestamp') ) {
		
			// search for mentions inside comment
			var mention = $(commentElem).find('.mention');
			if (mention.length) {
				
				var commentId = $(commentElem).find('li.comment').attr('id');
				var userName = $(commentElem).find('.yt-user-name').text().trim();
				var commentMsg = $(commentElem).find('.comment-text').text().trim();
				var userIcon = $(commentElem).find('.avatar img').data('thumb');
				
				Push.create(userName, {
					body: commentMsg,
					icon: userIcon,
					tag: commentId,
					onClick: function () {
						window.focus();
						this.close();
					}
				});
				
			}
			
		}
	
	}
}

function include_push_notifications() {
	// ask for permission at startup
	if (!Push.Permission.has()) {
		Push.Permission.request();
	}

    YouTubeLive.onChatLoaded(function (youtube) {
        youtube.registerChatMessageObserver(createPushNotification, false);
    });
}