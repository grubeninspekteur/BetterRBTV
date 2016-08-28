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

const MAX_SUGGESTIONS = 5;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_TAB = 9;

/**
 * Shows a box with a collection of suggestions, from which the user can select one.
 */
class SuggestionBox {
    /**
     * @param boxName unique name of this box. Used to not collide with other boxes.
     * @param jTextInput the chat text input field to bind keys
     * @param callbackOnSelect will be called with the selected text and the suggestion box
     * object itself.
     */
    constructor(boxName, jTextInput, callbackOnSelect) {
        var self = this;
        this._callbackOnSelect = callbackOnSelect;
        this.highlightedSelection = -1;

        if (!SuggestionBox.ANY_BOX_CREATED) {
            // add box css only once
            var cssToAdd = `
		.brbtv-suggestion-box,
		.brbtv-suggestion-box * {
			box-sizing: border-box;
		}
		.brbtv-suggestion-box {
			margin-bottom: 8px;
		}
		.brbtv-suggestion {
			padding:5px;
			border-bottom: 1px solid rgba(0,0,0,0.3);
			border-top: 1px solid rgba(255,255,255,0.2);
			display: block;
		}
		.brbtv-suggestion:first-child {
			position: relative;
			margin-top: 2.5em;
		}
		.brbtv-suggestion:first-child::before {
			content: 'press TAB key to complete';
			display: block;
			position: absolute;
			top:0;
			left:0;
			transform: translateY(-100%);
			padding: 0 5px;
			height: 2.5em;
			line-height: 2.5em;
			color: #888;
			font-weight:500;
		}
		.brbtv-suggestion:last-child {
			border-bottom: 0;
		}
		.brbtv-highlighted-suggestion {
			background-color: #0f9d58;
			width: 100%;
			color: white;
			padding-left: 14px;
		}
		`;
            addCssToHead(cssToAdd);
            SuggestionBox.ANY_BOX_CREATED = true;
        }

        $("#live-comments-controls").prepend("<div id='brbtv-suggest-" + boxName + "'></div>");
        this._jSuggestBox = $("#brbtv-suggest-" + boxName);
        this._jSuggestBox.addClass("brbtv-suggestion-box");
        this._jSuggestBox.addClass("hid");
        jTextInput.keydown(function (e) {
            if (e.keyCode == KEY_UP) {
                if (self.highlightedSelection) {
                    self._moveHighlighted(-1);
                    e.preventDefault();
                }
            } else if (e.keyCode == KEY_DOWN) {
                if (self.highlightedSelection) {
                    self._moveHighlighted(+1);
                    e.preventDefault();
                }
            } else if (e.keyCode == KEY_TAB) {
                self._completeSuggestion();
                e.preventDefault();
            }
        });
        this._resetBox();
    }

    /**
     * Adds the specified DOM elements to the suggestion box in their order. The current user selection
     * will be reset to the top.
     *
     * @param spanElements jQuery span elements
     */
    setContents(spanElements) {
        this._jSuggestBox.empty();
        if (spanElements.length) {
            var highlightedFound = false;
            for (let i = 0; i < spanElements.length; i++) {
                spanElements[i].addClass("brbtv-suggestion");
                if (spanElements[i].text().toLowerCase() == this.highlightedSelection.toLowerCase()) {
                    highlightedFound = true;
                    spanElements[i].addClass("brbtv-highlighted-suggestion");
                }
                this._jSuggestBox.append(spanElements[i]);
            }

            if (!highlightedFound) {
                this.highlightedSelection = spanElements[0].text();
                spanElements[0].addClass("brbtv-highlighted-suggestion");
            }

            this._jSuggestBox.removeClass("hid");
        } else {
            this._resetBox();
        }
    }

    /**
     * Will call the callback if on a keyup event the specified triggerString was found at a
     * position before the caret with the string between the trigger (non-inclusive) and the caret. Otherwise,
     * the callback will be called with null.
     */
    addTrigger(jChatInput, triggerString, callback) {
        var self = this;
        jChatInput.keyup(function (e) {
            var indexOfTrigger = self._findPositionOfStringBeforeCaret(jChatInput, triggerString);
            if (indexOfTrigger != -1) {
                var caret = getCaretPosition(jChatInput[0]);
                if (caret > indexOfTrigger) {
                    callback(jChatInput.text().substring(indexOfTrigger + 1, caret));
                }
            } else {
                callback(null);
            }
        });
    }

    _findPositionOfStringBeforeCaret(jTextInput, s) {
        var caretPos = getCaretPosition(jTextInput[0]);
        var innerText = jTextInput.text();
        var theStringPos = -1;
        //console.log("Find "+s+" before caret pos "+caretPos);
        for (var i = 0; i < innerText.length; i++) {
            if (innerText[i] == s && i < caretPos) {
                theStringPos = i;
            }
        }
        return theStringPos;
    }

    _resetBox() {
        this._jSuggestBox.empty();
        this._jSuggestBox.addClass("hid");
        this.highlightedSelection = '';
    }

    _moveHighlighted(by) {
        var suggestions = this._jSuggestBox.find(".brbtv-suggestion");

        if (suggestions.length == 0) return;

        var highlightedSuggestionIdx = -1;

        for (var i = 0; i < suggestions.length; i++) {
            if (suggestions.eq(i).hasClass("brbtv-highlighted-suggestion")) {
                highlightedSuggestionIdx = i;
            }
        }

        if (highlightedSuggestionIdx == -1) {
            console.warn("Moving highlight cursor failed because there was nothing highlighted. This should not happen.");
        } else {
            suggestions.eq(highlightedSuggestionIdx).removeClass("brbtv-highlighted-suggestion");
            highlightedSuggestionIdx = fixedModulo((highlightedSuggestionIdx + by), suggestions.length);
            suggestions.eq(highlightedSuggestionIdx).addClass("brbtv-highlighted-suggestion");
            this.highlightedSelection = suggestions.eq(highlightedSuggestionIdx).text();
        }
    }

    _completeSuggestion() {
        var highlightedSelectionCopy = this.highlightedSelection;
        this.highlightedSelection = '';
        this._resetBox();
        this._callbackOnSelect(highlightedSelectionCopy, this);
    }

    /**
     * In the given textInput, replaces the string between the symbolBeforeCaret (inclusive)
     * and the caret with the given replacement.
     */
    replaceSuggestion(textInput, symbolBeforeCaret, replacement, insertSpace) {
        var indexOfSymbol = this._findPositionOfStringBeforeCaret(textInput, symbolBeforeCaret);
        var indexOfCaret = getCaretPosition(textInput[0]);
        var newCaret = indexOfSymbol + replacement.length;
        if (insertSpace) {
            newCaret += 1;
            replacement = replacement + "\u00A0";
        }

        //console.log(textInput.text() + " symbol: " + indexOfSymbol + " caret: " + indexOfCaret);

        // first, ensure we have no adjacent text nodes that possibly breaks our replacement
        // text into two
        textInput[0].normalize();

        // next, find the text node containing the replacement text
        // by this, we can safely skip other DOM elements created by YT (like img for emotes)
        var lengthPassed = 0;
        var replacementPerformed = false;

        textInput.contents().filter(function () {
            return this.nodeType === 3; // i.e. this.nodeType == TEXT_NODE
        }).each(function (idx, elem) {
            if (replacementPerformed) return;
            if (indexOfSymbol >= elem.nodeValue.length + lengthPassed) {
                lengthPassed += elem.nodeValue.length;
            } else {
                elem.nodeValue = elem.nodeValue.replaceBetween(
                    indexOfSymbol - lengthPassed,
                    indexOfCaret - lengthPassed,
                    replacement);
                replacementPerformed = true;
            }
        });

        setCaretPosition(textInput[0], newCaret);
    }
}

SuggestionBox.ANY_BOX_CREATED = false;