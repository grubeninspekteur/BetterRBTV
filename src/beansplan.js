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
                        // DEBUG
                        hourMinutes[0] = 21;
                        hourMinutes[1] = 15;
                        hourMinutes[1] = parseInt(hourMinutes[1]);
                        var then = new Date();
                        var now = new Date();
                        then.setHours(hourMinutes[0]);
                        then.setMinutes(hourMinutes[1]);
                        console.log("DEBUG: nextShow " + showTitle + " at " + then);
                        // when will then be now?
                        var diffMilli = then - now;
                        console.log("diffMilli " + diffMilli);
                        // Did we already miss it?
                        if (diffMilli < 0) {
                            self.clearNextShowDisplay();

                        } else {
                            self._nextShow = showTitle;
                            self._startTime = then;
                            self._nextshowContainer.find('.nextshow-time').text( timeShowStarts );
                            
							/* TODO: Titel-Attribut dynamisch anpassen */
							self._nextshowContainer.attr('title', 'NEXT SHOW WILL BEGIN IN XX MINUTES');
							
                            // self._circle.css("transform", "");
                            self._nextshowContainer.addClass('visible');
                            self._interval = youtube.setInterval(function() {self.timerFired();}, 2000);
                            
                            // Update now
                            self.timerFired();
                        }
                    }
                }
            }, true);
        });
    }

    timerFired() {
        console.log("DEBUG: Timer fired, start time is " + this._startTime);
        if (!this._startTime) {
            return;
        }
        

        var diffMilli =  this._startTime - (new Date());
        if (diffMilli < 0) {
            this.clearNextShowDisplay();
        } else if (diffMilli < Beansplan.DISPLAY_THRESHOLD) {
            // var degree = 360 - Math.floor((diffMilli / Beansplan.DISPLAY_THRESHOLD) * 360);
            // console.log("DEBUG: degree = " + degree);
            // this._circle.css("transform", "rotate("+degree.toString()+"deg)");
			
			/* TODO: Keine Gradzahlen mehr errechnen.
				Stattdessen eine Prozentzahl errechnen
				und dann this._circle eine entsprechende Klasse geben,
				.p1, .p2, .p3, ..., .p99, .p100
				(alte Klasse entfernen)
			*/
			
        }
    }

    clearNextShowDisplay() {
        console.log("DEBUG: Clearing Next Show");
        if (this._interval) {
            clearInterval(this._interval);
            this._interval = null;
        }
        this._nextShow = null;
        this._startTime = null;
        this._nextshowContainer.removeClass('visible');
    }
}