class Beansplan {
    static get DISPLAY_THRESHOLD() {
        // show only percentage of last 30 minutes before show
        return 30 * 60 * 1000;
    }

    constructor() {
        this._interval = null;
        this._startTime = null;
        this._nextShow = null;
        var pattern = new RegExp("Um ([0-9:]+) folgt (.+)");
        var self = this;
        loadAndAddCssFile('next-show.css');
        

        YouTubeLive.onChatLoaded(function (youtube) {
			self._nextshowContainer = $("<div>", {"id": "brbtv-next-show"});
            self._circle = $("<div>", {"id": "brbtv-next-show-circle", "class": "c100 dark center green"});
            self._circle.append('<span>▶</span><div class="slice"><div class="bar"></div><div class="fill"></div></div>');
			self._nextshowContainer.prepend(self._circle);
			self._nextshowContainer.append("<span class='nextshow-time'></span>");
			
            $("#picker-buttons").after(self._nextshowContainer);

            youtube.registerChatMessageObserver(function(elem) {
                var jElem = $(elem);
                if (jElem.find("#author-name").text() == "Beansplan") {
                    var matches = pattern.exec(jElem.find("#message").text().trim());
                    if (matches && matches.length) {
                        var timeShowStarts = matches[1];
                        var showTitle = matches[2];
                        var hourMinutes = timeShowStarts.split(":")
                        hourMinutes[0] = parseInt(hourMinutes[0]);
                        hourMinutes[1] = parseInt(hourMinutes[1]);
                        var then = new Date();
                        var now = new Date();
                        then.setHours(hourMinutes[0]);
                        then.setMinutes(hourMinutes[1]);
                        
                        // when will then be now?
                        var diffMilli = then - now;

                        // Did we already miss it?
                        if (diffMilli < 0) {
                            self.clearNextShowDisplay();

                        } else {
                            // remove unneccesary period
                            if (showTitle.endsWith('.')) {
                                showTitle = showTitle.substr(0, showTitle.length - 1);
                            }
                            self._nextShow = showTitle;
                            self._startTime = then;
                            self._nextshowContainer.find('.nextshow-time').text( timeShowStarts );
                            
							self._nextshowContainer.attr('title', showTitle);
                            self._nextshowContainer.addClass('visible');
                            if (!self._interval) {
                                self._interval = youtube.setInterval(function() {self.timerFired();}, 2000);
                            }
                            
                            // Update now
                            self.removePercent();
                            self.timerFired();
                        }
                    }
                }
            }, true);
        });
    }

    timerFired() {
        if (!this._startTime) {
            return;
        }

        var diffMilli =  this._startTime - (new Date());

        // update title
        var diffMinutes = Math.floor(diffMilli / 1000 / 60);
        this._nextshowContainer.attr('title', 'In ' + diffMinutes.toString() + ' Minuten: ' + this._nextShow);

        if (diffMilli < 0) {
            this.clearNextShowDisplay();
        } else if (diffMilli < Beansplan.DISPLAY_THRESHOLD) {
            this.removePercent();
            var percent = Math.floor(100.0 * (1.0 - (diffMilli / Beansplan.DISPLAY_THRESHOLD)));
            }

            this._circle.addClass('p'+percent);
        }

    removePercent() {
        // remove old percent class
        var classes = this._circle.attr('class').split(' ');
        if (classes) {
          for (let clazz of classes) {
              if (clazz.startsWith('p')) {
                  this._circle.removeClass(clazz);
              }
          }
       }
    }

    clearNextShowDisplay() {
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        this._nextShow = null;
        this._startTime = null;
        this._nextshowContainer.removeClass('visible');
    }
}