/**
 * A convenient object to interact with the YouTube Live page. <b>Do not instantiate an object using the constructor.
 * The page may not yet have been loaded</b>. Instead, use the static methods onChatLoaded and onVideoLoaded. Their
 * respective callbacks will only be called when the specific part has been found on the page.
 * <p/>
 * Remember that YouTube Live pages may have their chat in a separate frame, or the video was embedded on another
 * site. To check which part of the page you're on, use the isLoaded() method. However, the best way is to assume
 * you only have access to one part of the page, and communicate with the other via messages sent to the
 * extension's background script.
 * <p/>
 * A last word on naming conventions: Whenever you request a unique object (i.e., one with an ID), you may either
 * use the getJ<name> variant to get the JQuery-extended version, or get<name> to get the DOM element. If not
 * specified otherwise, all iterators will call callbacks with DOM elements.
 *
 * TODO currently only chat is detected; implement page and detection
 */
class YouTubeLive {

    constructor() {
        this._chatObservers = [];
        this._intervals = [];
        this._storageListeners = [];
        this._chatMutationObserver = null;
        this._type = 0; // we are using bit flags internally
    }

    // static _instance = null - defined at end of file

    static get CHAT() {
        return 1;
    }

    static get MAIN_VIDEO() {
        return 2;
    }

    /**
     * Returns whether the specific portion of a YouTube Live page is loaded and accessible via this object. Using
     * this method is discouraged. Rather, use the asynchronous static loaders onChatLoaded() and onVideoLoaded().
     *
     * @param {number} type one of YouTubeLive.CHAT or YouTubeLive.MAIN_VIDEO
     */
    isLoaded(type) {
        return Boolean(type & this._type);
    }

    static resetPage() {
        $("body").off(); // removes the event handler added to the body for hiding the user action menu

        if (YouTubeLive._instance != null) {
            if (YouTubeLive._instance._chatMutationObserver != null) {
                YouTubeLive._instance._chatMutationObserver.disconnect();
                delete YouTubeLive._instance._chatMutationObserver;
            }
            for (let interval of YouTubeLive._instance._intervals) {
                clearInterval(interval);
            }

            for (let listener of YouTubeLive._instance._storageListeners) {
                chrome.storage.onChanged.removeListener(listener);
            }

            YouTubeLive._instance._intervals = [];
            YouTubeLive._instance._storageListeners = [];
            YouTubeLive._instance._chatObservers = [];
            delete YouTubeLive._instance.jHidingMessage;
            delete YouTubeLive._instance.jCommentsScroller;

            SuggestionBox.removeAllInstances();
        }
        YouTubeLive._instance = null;
        YouTubeLive._tried_loading = 0; // which parts of the page have already been checked for
        YouTubeLive._currently_loading = 0; // which parts of the page are currently checked for
        YouTubeLive._on_chat_loaded_callbacks = [];
    }

    static onVideoLoaded(callback) {
        // TODO implement
        throw "NOT YET IMPLEMENTED";
    }

    /**
     * Calls the provided callback function with the singleton YouTubeLive instance once the chat has been loaded. If
     * there is no chat, the function will never be called.
     *
     * @param [YouTubeLive~onPagePartLoaded} callback will be called when the chat has been loaded
     */
    static onChatLoaded(callback) {
        if (YouTubeLive._instance && YouTubeLive._instance.isLoaded(YouTubeLive.CHAT)) {
            callback(YouTubeLive._instance);
        } else if (YouTubeLive._currently_loading & YouTubeLive.CHAT) {
            YouTubeLive._on_chat_loaded_callbacks.push(callback);
        } else if (!(YouTubeLive._tried_loading & YouTubeLive.CHAT)) {
            YouTubeLive._on_chat_loaded_callbacks.push(callback);
            YouTubeLive._startLoadingChat();
        }
    }

    _initializeUniqueChatElements() {
        this.jHidingMessage = $('#contents > paper-icon-button[icon="yt-icons:down_arrow"]');
        this.jCommentsScroller = $("yt-live-chat-renderer #chat #items");

    }

    static _startLoadingChat() {
        if (YouTubeLive._currently_loading & YouTubeLive.CHAT) return;
        if (BRBTV_DEBUG) {
            let url = document.location.href;
            console.log("BRBTV: Started looking for chat on "+url);
        }
        YouTubeLive._currently_loading = YouTubeLive._currently_loading | YouTubeLive.CHAT;
        function chatTimeoutOccurred(callback) {
            // the following line is necessary since we could carry over a timeout across an AJAX change on the main YouTube site
            if (!(YouTubeLive._currently_loading) & YouTubeLive.CHAT) return;

            if (document.readyState != 'complete') {
                rescheduleTimeout(callback);
                return;
            }

            var liveChats = document.getElementsByTagName("yt-live-chat-renderer");

            if (liveChats.length && !document.getElementsByTagName("yt-live-chat-text-input-field-renderer").length) {
                // input area not yet loaded
                rescheduleTimeout(callback);
                return;
            }

            if (!liveChats.length && $("ytg-watch-page[show-live-chat]").length) {
                // YT Gaming loaded in background tab
                rescheduleTimeout(callback);
                return;
            }

            if (liveChats.length) {

                if (BRBTV_DEBUG) {
                    let url = document.location.href;
                    console.log("BRBTV: chat found on "+url);
                }
                callback();
            } else {
                if (BRBTV_DEBUG) {
                    let url = document.location.href;
                    console.log("BRBTV: No chat found, scripts will not run on "+url);
                }
            }
        }

        function rescheduleTimeout(callback) {
            setTimeout(function () {
                chatTimeoutOccurred(callback)
            }, 100);
        }

        rescheduleTimeout(function () {
            if (!YouTubeLive._instance) {
                YouTubeLive._instance = new YouTubeLive();
            }
            YouTubeLive._instance._type = YouTubeLive._instance._type | YouTubeLive.CHAT;
            YouTubeLive._tried_loading = YouTubeLive._tried_loading | YouTubeLive.CHAT;
            YouTubeLive._currently_loading = YouTubeLive._currently_loading ^ YouTubeLive.CHAT;
            YouTubeLive._instance._initializeUniqueChatElements();

            for (var i = 0; i < YouTubeLive._on_chat_loaded_callbacks.length; i++) {
                YouTubeLive._on_chat_loaded_callbacks[i](YouTubeLive._instance);
            }
            YouTubeLive._on_chat_loaded_callbacks = null; // force null pointer exception - object should not be accessed after chat was loaded
        });
    }

    /**
     * Returns a JQuery version of the input div for entering live comments.
     *
     * @returns {JQuery|jQuery|HTMLElement|*}
     */
    getJChatInputField() {
        return $("yt-live-chat-text-input-field-renderer > #input");
    }

    /**
     * Returns the DOM element for entering live comments.
     *
     * @returns {HTMLElement|*}
     */
    getChatInputField() {
        return this.getJChatInputField()[0];
    }

    /**
     * Register a function that is called with each comment added to the chat. If runNow is true, the callback will
     * be called with each comment already present in the chat window.
     *
     * @param messageObserver gets called once for each comment li element added to the chat (DOM element)
     * @param {boolean} runNow whether the observer should be called with comments already in the chat
     */
    registerChatMessageObserver(messageObserver, runNow = true) {
        this._ensureChat();
        if (runNow) {
            this.iteratePastChatMessages(messageObserver);
        }

        this._chatObservers.push(messageObserver);

        if (!this._chatMutationObserver) {
            var self = this;
            this._chatMutationObserver = new MutationObserver(function (mutations) {
                var scrollbarRecord = self._recordChatScrollbar();
                mutations.forEach(function (mutation) {
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        if ($(mutation.addedNodes[i]).is("yt-live-chat-text-message-renderer")) {
                            for (let o = 0; o < self._chatObservers.length; o++) {
                                self._chatObservers[o](mutation.addedNodes[i]);
                            }
                        }
                    }
                });
                self._fixChatScrollbar(scrollbarRecord);
            });

            this._chatMutationObserver.observe($("yt-live-chat-renderer #chat-messages #item-list #items")[0], {childList: true});
        }
    }

    /**
     * Creates a timer that is automatically deleted when the chat context is left.
     */
    setInterval(callback, interval) {
        this._intervals.push(setInterval(callback, interval));
    }

    /**
     * Adds a storage listener that is automatically detached when the chat context is left.
     */
    addStorageListener(callback) {
        chrome.storage.onChanged.addListener(callback);
        this._storageListeners.push(callback);
    }

    _ensureChat() {
        if (!(this._type & YouTubeLive.CHAT)) throw "This instance has no chat loaded. Please use the onChatLoaded callback method";
    }

    /**
     * Iterates over chat messages already present in the chat window and calls the callback with each li element.
     *
     * @param messageObserver gets called once for each comment li element present in the chat (DOM element)
     */
    iteratePastChatMessages(messageObserver) {
        this._ensureChat();
        var scrollbarRecord = this._recordChatScrollbar();
        $("yt-live-chat-renderer #chat-messages #item-list #items > .yt-live-chat-item-list-renderer").each(function (idx, elem) {
            messageObserver(elem);
        });
        this._fixChatScrollbar(scrollbarRecord);
    }

    /**
     * Returns whether the chat window was scrolling before modifying its contents. Used in conjunction with
     * _fixChatScrollbar.
     * @private
     */
    _recordChatScrollbar() {
        return !this.jHidingMessage[0].hasAttribute("disabled");
    }

    /**
     * If the user was not scrolling the chat window before, resets the scrolling to the bottom after modifying the
     * chat window contents. Scrollbar state should be recorded with _recordChatScrollbar.
     * @private
     */
    _fixChatScrollbar(scrollbarRecord) {
        if (!scrollbarRecord) {
            this.jCommentsScroller.scrollTop(this.jCommentsScroller[0].scrollHeight);
        }
    }
}

YouTubeLive._instance = null;
YouTubeLive._tried_loading = 0; // which parts of the page have already been checked for
YouTubeLive._currently_loading = 0; // which parts of the page are currently checked for
YouTubeLive._on_chat_loaded_callbacks = [];

/**
 * @callback YouTubeLive~onPagePartLoaded
 * @param {YouTubeLive} singleton instance with the specific page part loaded
 */