function onChatLoaded(callback) {
    rescheduleTimeout(callback);
}

function rescheduleTimeout(callback) {
    setTimeout(function() {chatTimeoutOccurred(callback)}, 100);
}

function chatTimeoutOccurred(callback) {
    if (document.readyState != 'complete') {
        rescheduleTimeout(callback);
        return;
    }
    var textInput = document.getElementById("live-comments-input-field");

    // are we on Youtube live? Here, the chat loads later
    if (document.getElementById("watch-sidebar-discussion") != null && textInput == null) {
        rescheduleTimeout(callback);
        return;
    }

    if (textInput != null) {
        callback();
    }
}