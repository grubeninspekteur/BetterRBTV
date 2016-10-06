const MAX_SUGGESTIONS = 5;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_TAB = 9;

/**
 * Shows a box with a collection of suggestions, from which the user can select one.
 */
class SuggestionBox {

    static removeAllInstances() {
        for (let box of SuggestionBox._allBoxes) {
            box._jSuggestBox.remove();
        }
        SuggestionBox._allBoxes = [];
    }

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
			content: '` + chrome.i18n.getMessage("suggestBoxTabToComplete") + `';
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
        this._jSuggestBox = $("<div>", {id: "brbtv-suggest-" + boxName});
        $("#live-comments-controls").prepend(this._jSuggestBox);
        this._jSuggestBox.addClass("brbtv-suggestion-box");
        this._jSuggestBox.addClass("hid");
        jTextInput[0].addEventListener('keydown', function (e) {
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

        SuggestionBox._allBoxes.push(this);
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
        jChatInput[0].addEventListener('keyup', function (e) {
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
SuggestionBox._allBoxes = [];