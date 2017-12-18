function include_better_separate_messages() {
    YouTubeLive.onChatLoaded(function (youtube) {
		loadAndAddCssFile('separate-messages.css');
    });
}