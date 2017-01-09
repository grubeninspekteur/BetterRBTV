// CC0 public domain sound from http://www.freesound.org/people/pan14/sounds/263133/
var notificationSound = new Audio(chrome.extension.getURL('sounds/notification.wav'));
notificationSound.loop = false;

function include_sound_notifications() {
    function createSoundNotification(message) {
        jMessage = $(message);

        if (!jMessage.hasClass("brbtv-removed-message")) {

            // search for mentions inside comment
            var mention = jMessage.find('.mention');
            if (mention.length) {
                notificationSound.play();
            }
        }
        delete jMessage;
    }

    YouTubeLive.onChatLoaded(function (youtube) {
        youtube.registerChatMessageObserver(createSoundNotification, false);
    });
}