// Saves options to chrome.storage.sync.
function save_options() {
  chrome.storage.sync.set({
    twitchKeywordReplacement: document.getElementById('keywords').checked,
    faceEmotes: document.getElementById('face-emotes').checked
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Einstellungen gespeichert.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(default_settings, function(items) {
    document.getElementById('keywords').checked = items.twitchKeywordReplacement;
    document.getElementById('face-emotes').checked = items.faceEmotes;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);