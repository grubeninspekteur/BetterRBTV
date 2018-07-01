// Due to usntable sync storage in Firefox, we rely only on local storage
if (BRBTV_IS_FIREFOX) {
  chrome.storage.sync = chrome.storage.local;
}

// localization
document.querySelectorAll("[data-i18n]").forEach(function(elem) {
  elem.innerText = chrome.i18n.getMessage(elem.getAttribute("data-i18n"));
});

document
  .getElementById("select-pack")
  .setAttribute("value", chrome.i18n.getMessage("Opt_EmotePackButton"));
// END localization

// Tabbing
function showTab(tabId) {
  const tabs = document.querySelectorAll("[id^='tabs-']");
  for (tab of tabs) {
    const id = tab.getAttribute("id");
    if (id == tabId) {
      tab.classList.remove("hid");
    } else {
      tab.classList.add("hid");
    }
  }

  document.querySelectorAll(".tab-button").forEach(elem => {
    if (elem.getAttribute("data-opentab") == tabId) {
      elem.classList.remove("tab-inactive");
      elem.classList.add("tab-active");
    } else {
      elem.classList.remove("tab-active");
      elem.classList.add("tab-inactive");
    }
  });
}

document.querySelectorAll(".tab-button").forEach(elem => {
  const tabName = elem.getAttribute("data-opentab");
  elem.addEventListener("click", () => {
    showTab(tabName);
  });
  elem.classList.add("tab-inactive");
});

// open first tab
showTab("tabs-1");

// Saves options to chrome.storage.sync.
function save_blocked_terms() {
  chrome.storage.sync.set(
    {
      blockedTerms: {
        termString: document.getElementById("blocked-terms").value.trim(),
        isRegex: document.getElementById("blocked-terms-is-regex").checked
      }
    },
    function() {
      // Update status to let user know options were saved.
      var status = document.getElementById("status");
      status.textContent = chrome.i18n.getMessage("optionsSaved");
      setTimeout(function() {
        status.textContent = "";
      }, 750);
    }
  );
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.sync.get(default_settings, function(items) {
    document.querySelectorAll(".auto-saving").forEach(function(elem) {
      elem.checked = items[elem.getAttribute("data-storage-key")];
      elem.addEventListener("change", function() {
        let query = {};
        query[elem.getAttribute("data-storage-key")] = elem.checked;
        chrome.storage.sync.set(query);
      });
    });

    document.getElementById("blocked-terms").value =
      items.blockedTerms.termString;
    document.getElementById("blocked-terms-is-regex").checked =
      items.blockedTerms.isRegex;

    listFilteredUsers(
      items.ignoredUsers,
      "ignoredUsers",
      document.getElementById("no-muted-users"),
      document.getElementById("muted-users")
    );
    listFilteredUsers(
      items.highlightedUsers,
      "highlightedUsers",
      document.getElementById("no-highlighted-users"),
      document.getElementById("highlighted-users")
    );
    var customHighlightInput = document.getElementById(
      "add-custom-highlight-id"
    );
    var customHighlightButton = document.getElementById(
      "add-custom-highlight-button"
    );

    customHighlightButton.addEventListener("click", function() {
      var theId = customHighlightInput.value.trim();
      if (theId) {
        customHighlightButton.setAttribute("disabled", true);
        chrome.storage.sync.get({ highlightedUsers: [] }, function(items) {
          var updatedHighlightedUsers = items.highlightedUsers;
          updatedHighlightedUsers.push({
            name: "custom-added",
            id: theId,
            addedTime: Date.now()
          });
          chrome.storage.sync.set(
            { highlightedUsers: updatedHighlightedUsers },
            function() {
              customHighlightInput.value = "";
              customHighlightButton.setAttribute("disabled", false);
              listFilteredUsers(
                updatedHighlightedUsers,
                "highlightedUsers",
                document.getElementById("no-highlighted-users"),
                document.getElementById("highlighted-users")
              );
            }
          );
        });
      }
    });
  });
  showStoredEmotePack();
}

function listFilteredUsers(
  filteredUsersArray,
  storageKey,
  noUsersFiltered,
  filteredUsers
) {
  if (filteredUsersArray.length) {
    noUsersFiltered.classList.add("hid");
    filteredUsers.classList.add("hid");
    removeChildNodes(filteredUsers);

    for (let i = 0; i < filteredUsersArray.length; i++) {
      let filteredUser = filteredUsersArray[i];
      let li = document.createElement("li");
      li.textContent = filteredUser.name + " (" + filteredUser.id + ") ";
      li.setAttribute("data-yt-user-id", filteredUser.id);
      let btn = document.createElement("button");
      btn.classList.add("remove-user-button");
      btn.textContent = chrome.i18n.getMessage("filterListRemove");
      btn.addEventListener("click", function(e) {
        let query = {};
        query[storageKey] = [];
        chrome.storage.sync.get(query, function(items) {
          var updatedFilteredUsers = items[storageKey].filter(
            u => u.id != filteredUser.id
          );
          let query = {};
          query[storageKey] = updatedFilteredUsers;
          chrome.storage.sync.set(query, function() {
            const elements = filteredUsers.querySelectorAll(
              "li[data-yt-user-id='" + filteredUser.id + "']"
            );
            for (elem of elements) {
              elem.parentNode.remove(elem);
            }
            if (!updatedFilteredUsers.length) {
              noUsersFiltered.classList.remove("hid");
            }
          });
        });
      });
      li.appendChild(btn);
      filteredUsers.append(li);
    }
  }
}

function showStoredEmotePack() {
  chrome.storage.local.get("emotePack", function(items) {
    var pack = items.emotePack;
    var emotePackPreviewElem = document.getElementById("emote-pack-preview");
    removeChildNodes(emotePackPreviewElem);
    if (pack == null) {
      document.getElementById(
        "emote-pack-name"
      ).textContent = chrome.i18n.getMessage("noEmotePackInstalled");
    } else {
      for (let i = 0; i < pack.images.length; i++) {
        let img = pack.images[i];
        let emote = document.createElement("span");
        emote.classList.add("emote-preview-unicode");
        emote.textContent = img.emote;
        emotePackPreviewElem.appendChild(emote);
        emote.appendChild(document.createTextNode(" = "));
        const imgElem = document.createElement("img");
        imgElem.setAttribute("width", img.width);
        imgElem.setAttribute("height", img.height);
        imgElem.setAttribute("src", "data:image/png;base64," + img.base64);

        emotePackPreviewElem.appendChild(imgElem);
        emotePackPreviewElem.appendChild(document.createTextNode(" "));
        if (i + 1 < pack.images.length) {
          emotePackPreviewElem.appendChild(document.createTextNode(", "));
        }
      }
      const emotePackName = document.getElementById("emote-pack-name");
      emotePackName.textContent = pack.name;
      emotePackName.appendChild(document.createElement("br"));
    }
  });
}

function readPending() {
  document.getElementById("file-error").textContent = "";
  document.getElementById("file-success").textContent = "";
  document.getElementById("select-pack").disabled = true;
}

function readError(error) {
  document.getElementById("file-error").textContent = error;
  if (BRBTV_DEBUG) console.error(error);
  loading_complete();
}

function readSuccess(msg) {
  document.getElementById("file-success").textContent = msg;
  loading_complete();
}

function saveImages(name, emoticons, images, image_dimensions) {
  var pack = {};
  pack.name = name;
  pack.images = [];
  for (var i = 0; i < images.length; i++) {
    pack.images.push({
      emote: emoticons[i],
      base64: images[i],
      width: image_dimensions[i][0],
      height: image_dimensions[i][1]
    });
  }
  chrome.storage.local.set({ emotePack: pack }, function() {
    showStoredEmotePack();
    readSuccess(chrome.i18n.getMessage("emotePackInstalled"));
  });
}

var untrustedChars = new RegExp("[\"'<>\\$\\(\\)&/\\?\\^\\*]|expression|url");

function loadEmotePack(fileName, fileContents) {
  JSZip.loadAsync(fileContents).then(
    function(zip) {
      var mapFile = zip.file("map.txt");

      if (mapFile == null) {
        readError(chrome.i18n.getMessage("emotePackNoMapTxt"));
        return;
      }

      mapFile.async("string").then(
        function(contents) {
          var promises = [];
          var emoticons = [];

          var lines = contents.split("\n");
          for (var i = 0; i < lines.length; i++) {
            var parts = lines[i].trim().split(":");
            if (parts.length != 2 || untrustedChars.test(parts[0])) {
              readError(
                chrome.i18n.getMessage("emotePackMapTxtErrorInLine") + (i + 1)
              );
              return;
            }

            var emoticon = parts[0].trim();
            var imageFileName = parts[1].trim();
            if (!imageFileName.endsWith(".png")) {
              readError(
                chrome.i18n.getMessage("emotePackNoSupport", imageFileName)
              );
              return;
            }
            emoticons.push(emoticon);
            var zipFileImage = zip.file(imageFileName);
            if (!zipFileImage) {
              readError(
                chrome.i18n.getMessage("emotePackCantRead", imageFileName)
              );
              return;
            }
            promises.push(zipFileImage.async("base64"));
          }

          Promise.all(promises).then(
            function(encoded_images) {
              var images_dimension_promises = [];
              for (var i = 0; i < encoded_images.length; i++) {
                // get image dimensions
                var img = new Image();
                // boilerplate code to capture i and img at this moment
                (function(i, img) {
                  images_dimension_promises.push(
                    new Promise(function(resolve, reject) {
                      img.onload = function() {
                        resolve([img.width, img.height]);
                      };
                      img.src = "data:image;base64," + encoded_images[i];
                    })
                  );
                })(i, img);
              }

              Promise.all(images_dimension_promises).then(function(
                image_dimensions
              ) {
                saveImages(
                  fileName,
                  emoticons,
                  encoded_images,
                  image_dimensions
                );
              });
            },
            function(error_string) {
              readError(error_string);
              return;
            }
          );
        },
        function() {
          readError(chrome.i18n.getMessage("emotePackCantReadMapTxt"));
        }
      );
    },
    function() {
      readError(chrome.i18n.getMessage("emotePackCantUnzip"));
    }
  );
}

function loading_complete() {
  document.getElementById("select-pack").disabled = false;
}
function choose_emote_pack(evt) {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    var file = evt.target.files[0];
    readPending();
    var reader = new FileReader();
    reader.onloadend = function() {
      if (reader.error != null) {
        readError(
          chrome.i18n.getMessage("emotePackErrorLoading") + reader.error
        );
      } else {
        loadEmotePack(file.name, reader.result);
      }
    };
    reader.readAsArrayBuffer(file);
  } else {
    document.getElementById(
      "loading-spinner"
    ).textContent = chrome.i18n.getMessage("emotePackCantReadFile");
  }
}

document.addEventListener("DOMContentLoaded", restore_options);
document.getElementById("save").addEventListener("click", save_blocked_terms);
document
  .getElementById("select-pack")
  .addEventListener("change", choose_emote_pack);
