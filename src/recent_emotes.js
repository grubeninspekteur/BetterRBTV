/* Adds another tab to the youtube emoji picker menu
*  with all recently used emojis.
*  Depends heavily on the infrastructure used by YouTube,
*  so if that'll change someday, this will need to be changed for sure.
*/

function include_recent_emotes() {

	function updateChromeRecentEmotes(emoteIds) {
		
		// debug quick tool: uncomment this next line and comment the code afterwards to clear your history when you insert an emote
		// chrome.storage.sync.remove("brbtvRecentEmotes");

		
		let query = {};
		let storageKey = "brbtvRecentEmotes";
		query[storageKey] = [];
		chrome.storage.sync.get(query, function (items) {			
				var theUpdatedArray = items[storageKey];
        
				theUpdatedArray = theUpdatedArray.concat(emoteIds);
        
				query[storageKey] = $.unique( theUpdatedArray );
		
				chrome.storage.sync.set(query);
        
		});
		

	};

	
	function addEmoteToRecent(commentElem) {		
		
		if( Math.round( ((new Date) - 60000) / 1000 ) < $(commentElem).data('timestamp') ) {
			
			// only work on your own comments, of course
			if( $(commentElem).hasClass('author-viewing') ) {
				
				//collect emoji IDs
				var emojiClasses = [];
				
				// for each found emoji in the comment
				$(commentElem).find('.yt-emoji-icon').map(function(){
					
					// 
					var codeStart = "yt-emoji-";
					
					var testikus = $.grep( this.className.split(/\s+/), function(a) {
						
						return a !== 'yt-emoji-icon' && a.indexOf(codeStart) !== -1;
						
					})[0];
					
					emojiClasses = emojiClasses.concat( testikus.split('-')[2] );
					
				});

				uniqueClassNames = $.unique( emojiClasses ); // returns an array of unique class names
				uniqueClassObjects = [];
				
				// save each class name in storage
				for (var i = 0; i < uniqueClassNames.length; i++) {
					
					uniqueClassObjects.push({
						emoteCode: uniqueClassNames[i],
						emoteTitle: $( '.yt-emoji-' + uniqueClassNames[i] ).first().attr('title'),
						addedTime: Date.now()
					})
					
				}
				
				updateChromeRecentEmotes( uniqueClassObjects );
			}
			
			
		} 

	};


    YouTubeLive.onChatLoaded(function (youtube) {
		
		var emotesHTML = $('<div class="live-comments-emoji-pane live-comments-emoji-pane-brbtvRecent" key="brbtvRecent"></div>');
		
		chrome.storage.sync.get("brbtvRecentEmotes", function (items) {
			
			if(items["brbtvRecentEmotes"].length ) {
				
				// we count downwards to simply add the latest emote as the first item in list
				recentEmotes = new Set();
				for (let i = items["brbtvRecentEmotes"].length - 1; i >= 0; i--) {
					
					if( items["brbtvRecentEmotes"][i].emoteCode && items["brbtvRecentEmotes"][i].emoteTitle ) {
						recentEmotes.add(JSON.stringify({ emoteCode: items["brbtvRecentEmotes"][i].emoteCode, emoteTitle: items["brbtvRecentEmotes"][i].emoteTitle}));
					}
					
				}
				
				for (let item of recentEmotes) {
					let parsedItem = JSON.parse(item);
					if( parsedItem.emoteCode && parsedItem.emoteTitle ) {
						$(emotesHTML).append('<button class="live-comments-emoji-button" id="recent-'+ parsedItem.emoteCode +'" key="'+ parsedItem.emoteCode +'"><span class="yt-emoji-icon yt-emoji-'+ parsedItem.emoteCode +'" key="'+ parsedItem.emoteCode +'" title="'+ parsedItem.emoteTitle +'"></span></button>');
					}
				};
				
			}
			
		});
		
		chrome.storage.onChanged.addListener(function (changes, namespace) {

            if( changes["brbtvRecentEmotes"].newValue.length ) {
				
				// we count downwards to simply add the latest emote as the first item in list
				recentEmotes = new Set();
				for (let i = changes["brbtvRecentEmotes"].newValue.length - 1; i >= 0; i--) {
					
					if( changes["brbtvRecentEmotes"].newValue[i].emoteCode && changes["brbtvRecentEmotes"].newValue[i].emoteTitle ) {
						recentEmotes.add(JSON.stringify({ emoteCode: changes["brbtvRecentEmotes"].newValue[i].emoteCode, emoteTitle: changes["brbtvRecentEmotes"].newValue[i].emoteTitle}));
					}
					
				}
				
				// empty the emotes tab, because we will populate it with the updated emotes
				$(emotesHTML).empty();
				
				for (let item of recentEmotes) {
					let parsedItem = JSON.parse(item);
					if( parsedItem.emoteCode && parsedItem.emoteTitle ) {
						$(emotesHTML).append('<button class="live-comments-emoji-button" id="recent-'+ parsedItem.emoteCode +'" key="'+ parsedItem.emoteCode +'"><span class="yt-emoji-icon yt-emoji-'+ parsedItem.emoteCode +'" key="'+ parsedItem.emoteCode +'" title="'+ parsedItem.emoteTitle +'"></span></button>');
					}
				};
				
			}
        });
		
		$('.live-comments-emoji-picker .live-comments-emoji-type-button').removeClass('active');
		$('.live-comments-emoji-picker .live-comments-emoji-pane-people').addClass('hid');
		$('.live-comments-emoji-picker .live-comments-emoji-picker-tab-cell').prepend( $('<button class="yt-uix-button yt-uix-button-size-default yt-uix-button-default yt-uix-button-empty live-comments-emoji-type-button emoji_brbtvRecent active" type="button" onclick=";return false;" key="brbtvRecent"></button>') );
		$('.live-comments-emoji-picker .live-comments-emoji-tab-pane-bucket').prepend( emotesHTML );
				
		// inject CSS
		addCssToHead(`
		.live-comments-emoji-type-button.emoji_brbtvRecent {
			height: 30px;
			width: 30px;
			background: no-repeat url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDk3LjE2IDk3LjE2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA5Ny4xNiA5Ny4xNjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00OC41OCwwQzIxLjc5MywwLDAsMjEuNzkzLDAsNDguNThzMjEuNzkzLDQ4LjU4LDQ4LjU4LDQ4LjU4czQ4LjU4LTIxLjc5Myw0OC41OC00OC41OFM3NS4zNjcsMCw0OC41OCwweiBNNDguNTgsODYuODIzICAgIGMtMjEuMDg3LDAtMzguMjQ0LTE3LjE1NS0zOC4yNDQtMzguMjQzUzI3LjQ5MywxMC4zMzcsNDguNTgsMTAuMzM3Uzg2LjgyNCwyNy40OTIsODYuODI0LDQ4LjU4UzY5LjY2Nyw4Ni44MjMsNDguNTgsODYuODIzeiIgZmlsbD0iIzAwMDAwMCIvPgoJCTxwYXRoIGQ9Ik03My44OTgsNDcuMDhINTIuMDY2VjIwLjgzYzAtMi4yMDktMS43OTEtNC00LTRjLTIuMjA5LDAtNCwxLjc5MS00LDR2MzAuMjVjMCwyLjIwOSwxLjc5MSw0LDQsNGgyNS44MzIgICAgYzIuMjA5LDAsNC0xLjc5MSw0LTRTNzYuMTA3LDQ3LjA4LDczLjg5OCw0Ny4wOHoiIGZpbGw9IiMwMDAwMDAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K) center center;
			background-size: 16px 16px;
		}
		.live-comments-emoji-type-button.emoji_brbtvRecent.active {
			background-image: url(data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjI0cHgiIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDk3LjE2IDk3LjE2IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA5Ny4xNiA5Ny4xNjsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnPgoJCTxwYXRoIGQ9Ik00OC41OCwwQzIxLjc5MywwLDAsMjEuNzkzLDAsNDguNThzMjEuNzkzLDQ4LjU4LDQ4LjU4LDQ4LjU4czQ4LjU4LTIxLjc5Myw0OC41OC00OC41OFM3NS4zNjcsMCw0OC41OCwweiBNNDguNTgsODYuODIzICAgIGMtMjEuMDg3LDAtMzguMjQ0LTE3LjE1NS0zOC4yNDQtMzguMjQzUzI3LjQ5MywxMC4zMzcsNDguNTgsMTAuMzM3Uzg2LjgyNCwyNy40OTIsODYuODI0LDQ4LjU4UzY5LjY2Nyw4Ni44MjMsNDguNTgsODYuODIzeiIgZmlsbD0iI0ZGRkZGRiIvPgoJCTxwYXRoIGQ9Ik03My44OTgsNDcuMDhINTIuMDY2VjIwLjgzYzAtMi4yMDktMS43OTEtNC00LTRjLTIuMjA5LDAtNCwxLjc5MS00LDR2MzAuMjVjMCwyLjIwOSwxLjc5MSw0LDQsNGgyNS44MzIgICAgYzIuMjA5LDAsNC0xLjc5MSw0LTRTNzYuMTA3LDQ3LjA4LDczLjg5OCw0Ny4wOHoiIGZpbGw9IiNGRkZGRkYiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K);
		}
		`);
		
        youtube.registerChatMessageObserver(addEmoteToRecent, true);
    });
}