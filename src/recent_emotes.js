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
			background: no-repeat url(`+ chrome.extension.getURL('img/icon_clock_black.png') +`) center center;
			background-size: 16px 16px;
		}
		.live-comments-emoji-type-button.emoji_brbtvRecent.active {
			background-image: url(`+ chrome.extension.getURL('img/icon_clock_white.png') +`);
		}
		`);
		
        youtube.registerChatMessageObserver(addEmoteToRecent, true);
    });
}