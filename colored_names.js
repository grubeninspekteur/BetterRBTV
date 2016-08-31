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
		.live-chat-widget .comment .content a.yt-user-name {font-weight:500;}
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCA"] { color: #47d288 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCB"] { color: #b94ff1 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCC"] { color: #3cdc36 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCD"] { color: #df44dc !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCE"] { color: #6bd432 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCF"] { color: #8c69f1 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCG"] { color: #a3d12d !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCH"] { color: #b35dd5 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCI"] { color: #5edb62 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCJ"] { color: #ca46bb !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCK"] { color: #3daa27 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCL"] { color: #ef67d5 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCM"] { color: #83cc3f !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCN"] { color: #d978eb !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCO"] { color: #97bd12 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCP"] { color: #5c7af1 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCQ"] { color: #dfc71b !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCR"] { color: #4c8ae7 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCS"] { color: #f02f14 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCT"] { color: #2dd3ad !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCU"] { color: #ee3034 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCV"] { color: #44c357 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCW"] { color: #ab76dc !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCX"] { color: #c5bf30 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCY"] { color: #6d7ddb !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCZ"] { color: #eca821 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCa"] { color: #3295e9 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCb"] { color: #ed5e25 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCc"] { color: #a694f2 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCd"] { color: #488a16 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCe"] { color: #8c75d2 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCf"] { color: #aabf3d !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCg"] { color: #bc63b3 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCh"] { color: #2e9c42 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCi"] { color: #e68ee0 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCj"] { color: #75a52a !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCk"] { color: #e83f5d !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCl"] { color: #78d47c !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCm"] { color: #e44924 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCn"] { color: #46ad68 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCo"] { color: #e84c4b !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCp"] { color: #3d8d47 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCq"] { color: #e5656a !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCr"] { color: #95c858 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCs"] { color: #dc5a4a !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCt"] { color: #95cf73 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCu"] { color: #ce6552 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCv"] { color: #589034 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCw"] { color: #f37f60 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCx"] { color: #79af55 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCy"] { color: #e57e20 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCz"] { color: #b4b853 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC0"] { color: #cc6a35 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC1"] { color: #858b23 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC2"] { color: #f09464 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC3"] { color: #bca527 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC4"] { color: #e7964d !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC5"] { color: #ac850f !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC6"] { color: #e1b655 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC7"] { color: #bb7722 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC8"] { color: #aa852e !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC9"] { color: #de9b36 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC-"] { color: #e57e20 !important; }
		.live-chat-widget .comment .content .comment-text a.yt-user-name { color: #fff !important;}
		`);
	});
}
