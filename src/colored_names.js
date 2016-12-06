/* Colored Usernames
*  color palette generated at http://tools.medialab.sciences-po.fr/iwanthue/
*  now works via CSS3 attribute selectors
*
*  each message and/or username has its own unique ID that can start with [A-Z|a-z|0-9]
*  So we define 62 different colors for these possible ID beginnings
*/

function include_colored_names() {
    
	// selector needs to be as long as possible to override other long CSS selectors already applied by the plugin
    YouTubeLive.onChatLoaded(function (youtube) {
        addCssToHead(
		`
.yt-live-chat-text-message-renderer-0 img[src*="/-A"] + #content #author-name a{ color: #47d288 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-B"] + #content #author-name a{ color: #b94ff1 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-C"] + #content #author-name a{ color: #3cdc36 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-D"] + #content #author-name a{ color: #df44dc ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-E"] + #content #author-name a{ color: #6bd432 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-F"] + #content #author-name a{ color: #8c69f1 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-G"] + #content #author-name a{ color: #a3d12d ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-H"] + #content #author-name a{ color: #b35dd5 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-I"] + #content #author-name a{ color: #5edb62 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-J"] + #content #author-name a{ color: #ca46bb ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-K"] + #content #author-name a{ color: #3daa27 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-L"] + #content #author-name a{ color: #ef67d5 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-M"] + #content #author-name a{ color: #83cc3f ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-N"] + #content #author-name a{ color: #d978eb ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-O"] + #content #author-name a{ color: #97bd12 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-P"] + #content #author-name a{ color: #5c7af1 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-Q"] + #content #author-name a{ color: #dfc71b ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-R"] + #content #author-name a{ color: #4c8ae7 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-S"] + #content #author-name a{ color: #f02f14 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-T"] + #content #author-name a{ color: #2dd3ad ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-U"] + #content #author-name a{ color: #ee3034 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-V"] + #content #author-name a{ color: #44c357 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-W"] + #content #author-name a{ color: #ab76dc ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-X"] + #content #author-name a{ color: #c5bf30 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-Y"] + #content #author-name a{ color: #6d7ddb ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-Z"] + #content #author-name a{ color: #eca821 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-a"] + #content #author-name a{ color: #3295e9 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-b"] + #content #author-name a{ color: #ed5e25 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-c"] + #content #author-name a{ color: #a694f2 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-d"] + #content #author-name a{ color: #488a16 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-e"] + #content #author-name a{ color: #8c75d2 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-f"] + #content #author-name a{ color: #aabf3d ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-g"] + #content #author-name a{ color: #bc63b3 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-h"] + #content #author-name a{ color: #2e9c42 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-i"] + #content #author-name a{ color: #e68ee0 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-j"] + #content #author-name a{ color: #75a52a ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-k"] + #content #author-name a{ color: #e83f5d ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-l"] + #content #author-name a{ color: #78d47c ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-m"] + #content #author-name a{ color: #e44924 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-n"] + #content #author-name a{ color: #46ad68 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-o"] + #content #author-name a{ color: #e84c4b ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-p"] + #content #author-name a{ color: #3d8d47 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-q"] + #content #author-name a{ color: #e5656a ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-r"] + #content #author-name a{ color: #95c858 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-s"] + #content #author-name a{ color: #dc5a4a ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-t"] + #content #author-name a{ color: #95cf73 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-u"] + #content #author-name a{ color: #ce6552 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-v"] + #content #author-name a{ color: #589034 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-w"] + #content #author-name a{ color: #f37f60 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-x"] + #content #author-name a{ color: #79af55 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-y"] + #content #author-name a{ color: #e57e20 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-z"] + #content #author-name a{ color: #b4b853 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-0"] + #content #author-name a{ color: #cc6a35 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-1"] + #content #author-name a{ color: #858b23 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-2"] + #content #author-name a{ color: #f09464 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-3"] + #content #author-name a{ color: #bca527 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-4"] + #content #author-name a{ color: #e7964d ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-5"] + #content #author-name a{ color: #ac850f ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-6"] + #content #author-name a{ color: #e1b655 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-7"] + #content #author-name a{ color: #bb7722 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-8"] + #content #author-name a{ color: #aa852e ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-9"] + #content #author-name a{ color: #de9b36 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/--"] + #content #author-name a{ color: #e57e20 ; }
.yt-live-chat-text-message-renderer-0 img[src*="/-_"] + #content #author-name a{ color: #46ad68 ; }
		`);
	});
}
