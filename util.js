var _chatObservers = [];
var observer = null;

function addCssToHead(css) {
    if (css != null && css != '') {
        var brbtvStyle = document.getElementById('rbtv-style-optional');

        if (brbtvStyle != null) {
            brbtvStyle.innerHTML += " " + css;
            return true;
        } else {
            var style = document.createElement('style');
            var head = document.getElementsByTagName('head')[0];
            style.innerHTML = css;
            if (head) {
                head.appendChild(style);
                return true;
            } else {
                return false;
            }
        }
    }
}

function registerChatObserver(callback) {
    _chatObservers.push(callback);

    if (observer == null) {
        observer = new MutationObserver(function (mutations) {
            for (var i = 0; i < _chatObservers.length; i++) {
                _chatObservers[i](mutations);
            }
        });
    }

    observer.observe(document.getElementById("all-comments"), {childList: true});
}

//http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
function setCaretPosition(el, position) {
    var range = document.createRange();
    var sel = window.getSelection();
    range.setStart(el.childNodes[0], position);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}

// http://stackoverflow.com/questions/3972014/get-caret-position-in-contenteditable-div
function getCaretPosition(editableDiv) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}