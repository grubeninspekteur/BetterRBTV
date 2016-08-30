// CC0 public domain sound from http://www.freesound.org/people/pan14/sounds/263133/
var notificationSound = new Audio( chrome.extension.getURL('sounds/notification.wav') );
notificationSound.loop = false;

function createSoundNotification(commentElem) {


	
		
	// when initiated and it iterates the existing comments, only check comments from within the last 60 seconds
	if( Math.round( ((new Date) - 60000) / 1000 ) < $(commentElem).data('timestamp') ) {
	
		// search for mentions inside comment
		var mention = $(commentElem).not('.author-viewing').find('.mention');
		if (mention.length) {

			notificationSound.play();
			
		}
		
	}
	
	
}

function include_sound_notifications() {
	
	

    YouTubeLive.onChatLoaded(function (youtube) {
        youtube.registerChatMessageObserver(createSoundNotification, false);
    });
}