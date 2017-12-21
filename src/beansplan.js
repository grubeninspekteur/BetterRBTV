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
            self._circle = $("<div>", {"id": "brbtv-next-show-circle"});
            $("#picker-buttons").after(self._circle);

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
                        hourMinutes[0] = 23;
                        hourMinutes[1] = 25;
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
                            self._circle.text("▶ " + timeShowStarts);
                            self._circle.css("transform", "");
                            self._circle.show(100);
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
            var degree = 360 - Math.floor((diffMilli / Beansplan.DISPLAY_THRESHOLD) * 360);
            console.log("DEBUG: degree = " + degree);
            this._circle.css("transform", "rotate("+degree.toString()+"deg)");
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
        this._circle.hide(100);
    }
}