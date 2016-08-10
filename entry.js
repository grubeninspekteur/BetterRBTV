function include_face_emotes() {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.id = 'betterrbtv';
    style.media = 'all';
    style.href = chrome.extension.getURL('emotes.css');
    style.type = 'text/css';
    var head = document.getElementsByTagName('head')[0];
	if (head) {
    head.appendChild(style);
    }
}

chrome.storage.sync.get(default_settings, function(settings) {
    if (settings.twitchKeywordReplacement) {
        include_keyword_replacement();
    }
    
    if (settings.faceEmotes) {
        include_face_emotes();
    }
});