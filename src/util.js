class Some {
    constructor(value) {
        this._value = value;
    }

    get() {
        return this._value;
    }

    isEmpty() {
        return false;
    }

    forEach(f) {
        f(this._value);
    }

    orElse(default_value) {
        return this._value;
    }

    toArray() {
        return [this._value];
    }
}

class None {
    get() {
        throw "Called get() on empty Option";
    }

    isEmpty() {
        return true;
    }

    forEach(f) {
        // pass
    }

    orElse(default_value) {
        return default_value;
    }

    toArray() {
        return [];
    }
}

function loadAndAddCssFile(fileName) {
    var styleId = "brbtv-style-" + fileName.substring(0,fileName.length - 4);
    if (document.getElementById(styleId)) return true;
    var style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('type', 'text/css');
    style.setAttribute("id", styleId);
    style.setAttribute("href", chrome.extension.getURL("css/"+fileName));
    var head = document.getElementsByTagName('head')[0];
    if (head) {
        head.appendChild(style);
        return true;
    } else {
        return false;
    }
}

function addCssToHead(css) {
    if (css != null && css != '') {
        var brbtvStyle = document.getElementById('brbtv-style-optional');

        if (brbtvStyle != null) {
            brbtvStyle.textContent += css;
            return true;
        } else {
            var style = document.createElement('style');
            style.id = 'brbtv-style-optional';
            var head = document.getElementsByTagName('head')[0];
            style.textContent = css;
            if (head) {
                head.appendChild(style);
                return true;
            } else {
                return false;
            }
        }
    }
}

function removeCssFromHead() {
    $("#brbtv-style-optional").remove();
}

//http://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
function setCaretPosition(el, position) {
    var range = document.createRange();
    var sel = window.getSelection();
    // find first text node containing the position
    let lengthPassed = 0;
    for (let i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType != 3) continue;
        if (position > el.childNodes[i].nodeValue.length + lengthPassed) {
            lengthPassed += el.childNodes[i].nodeValue.length;
        } else {
            range.setStart(el.childNodes[i], position - lengthPassed);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            return;
        }
    }
}

//stackoverflow.com/questions/4811822/get-a-ranges-start-and-end-offsets-relative-to-its-parent-container/4812022#4812022
function getCaretPosition(element) {
    var caretOffset = 0;
    var doc = element.ownerDocument || element.document;
    var win = doc.defaultView || doc.parentWindow;
    var sel;
    if (typeof win.getSelection != "undefined") {
        sel = win.getSelection();
        if (sel.rangeCount > 0) {
            var range = win.getSelection().getRangeAt(0);
            var preCaretRange = range.cloneRange();
            preCaretRange.selectNodeContents(element);
            preCaretRange.setEnd(range.endContainer, range.endOffset);
            caretOffset = preCaretRange.toString().length;
        }
    } else if ((sel = doc.selection) && sel.type != "Control") {
        var textRange = sel.createRange();
        var preCaretTextRange = doc.body.createTextRange();
        preCaretTextRange.moveToElementText(element);
        preCaretTextRange.setEndPoint("EndToEnd", textRange);
        caretOffset = preCaretTextRange.text.length;
    }
    return caretOffset;
}

//http://stackoverflow.com/questions/4467539/javascript-modulo-not-behaving
// JavaScript's modulo operator does not work as intended...
function fixedModulo(x, y) {
    return ((x % y) + y) % y;
}

// http://stackoverflow.com/questions/14880229/how-to-replace-a-substring-between-two-indices
String.prototype.replaceBetween = function (start, end, what) {
    return this.substring(0, start) + what + this.substring(end);
};