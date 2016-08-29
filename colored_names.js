function include_colored_names() {
    // palette generated at http://tools.medialab.sciences-po.fr/iwanthue/
    // excluded dark colors so they work better on the dark YT gaming chat background
    var colorPalette = ["#ff2219",
        "#02fe85",
        "#c72ee0",
        "#5bf643",
        "#f84efe",
        "#18e53d",
        "#fc38e3",
        "#80fb38",
        "#9156f8",
        "#5ce421",
        "#d360ff",
        "#01c910",
        "#a350eb",
        "#b4f400",
        "#6f6aff",
        "#8fe700",
        "#7b64ee",
        "#f4ff25",
        "#3a7bff",
        "#d2ef00",
        "#b471ff",
        "#40ff6b",
        "#e549cf",
        "#02e65a",
        "#c341c7",
        "#60d000",
        "#b24dd5",
        "#01d039",
        "#ff68ed",
        "#27b600",
        "#995cda",
        "#cdff3f",
        "#676ee5",
        "#ffee00",
        "#7c88ff",
        "#fffa44",
        "#9673e6",
        "#85ff67",
        "#b254bf",
        "#5aff78",
        "#f92888",
        "#00e485",
        "#f90062",
        "#70ff8b",
        "#d85ac4",
        "#b9ff5a",
        "#e189ff",
        "#38a900",
        "#b689ff",
        "#8dc200",
        "#ed81eb",
        "#02b437",
        "#ff0038",
        "#00d175",
        "#f6004b",
        "#91ff83",
        "#ff4987",
        "#009a19",
        "#fc2b02",
        "#88ff95",
        "#ff4a4b",
        "#a1ff72",
        "#e33b19",
        "#58d879",
        "#ff5e1c",
        "#11aa51",
        "#e24a4f",
        "#339a00",
        "#ff712e",
        "#2d8d0f",
        "#d05b00",
        "#9cee7a",
        "#ef7a00",
        "#6dc557",
        "#f68541",
        "#459626",
        "#ff9221",
        "#5b9e00",
        "#ffa239",
        "#6cae00",
        "#c17500",
        "#c9ff77",
        "#f5a900",
        "#9ee067",
        "#d4a100",
        "#b2ef73",
        "#c69800",
        "#8ec042",
        "#e1ac32",
        "#749c15",
        "#ffd04c",
        "#9fb22a",
        "#f2ff63",
        "#b19a00",
        "#cfe35d",
        "#d9d200",
        "#bbc63f",
        "#ffeb57",
        "#bfbf00",
        "#d2c43e"];

    function nameToColor(name) {
        var hash = hashStr(name);
        var index = hash % colorPalette.length;
        return colorPalette[index];
    }

    //very simple hash
    function hashStr(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            var charCode = str.charCodeAt(i);
            hash += charCode;
        }
        return hash;
    }

    function colorUsername(commentElem) {

        var userNameElem = $(commentElem).find('a.yt-user-name');

        var userId = userNameElem.data('ytid');

        // not using .css() here because I want to apply !important to the styling, so names in VIP notices etc. are also colored
        userNameElem.attr('style', function (i, s) {
            return (s || '') + 'color: ' + nameToColor(userId) + ' !important;'
        });
    }

    YouTubeLive.onChatLoaded(function (youtube) {
        youtube.registerChatMessageObserver(colorUsername, true);
    });
}