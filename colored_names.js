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
		.live-chat-widget .comment .content a.yt-user-name {font-weight: bold;}
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCA"] { color: #e0616a !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCB"] { color: #52dc41 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCC"] { color: #8e40e8 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCD"] { color: #36b935 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCE"] { color: #d432e1 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCF"] { color: #7ec943 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCG"] { color: #514fe5 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCH"] { color: #abc928 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCI"] { color: #9e37d0 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCJ"] { color: #33ce70 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCK"] { color: #e73fd7 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCL"] { color: #4f9d24 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCM"] { color: #cd5dee !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCN"] { color: #9eb22e !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCO"] { color: #7c66f7 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCP"] { color: #ddba2f !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCQ"] { color: #374fcb !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCR"] { color: #6fc565 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCS"] { color: #b427b7 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCT"] { color: #5fcf88 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCU"] { color: #a140b4 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCV"] { color: #2f812f !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCW"] { color: #e767d9 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCX"] { color: #3ba55d !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCY"] { color: #bf36a4 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCZ"] { color: #2dd3ad !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCa"] { color: #f24720 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCb"] { color: #5e74ee !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCc"] { color: #e38f26 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCd"] { color: #9a6cea !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCe"] { color: #acc25c !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCf"] { color: #834fc8 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCg"] { color: #74a142 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCh"] { color: #c17ae6 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCi"] { color: #53781a !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCj"] { color: #6f4ead !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCk"] { color: #b29c34 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCl"] { color: #3563c2 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCm"] { color: #eb6e24 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCn"] { color: #458ee8 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCo"] { color: #ce241c !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCp"] { color: #747ce1 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCq"] { color: #818521 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCr"] { color: #a590ed !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCs"] { color: #cf4b1e !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCt"] { color: #a16abe !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCu"] { color: #e0a84e !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCv"] { color: #964191 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCw"] { color: #a7741c !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCx"] { color: #e292e8 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCy"] { color: #b55824 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UCz"] { color: #d06bb8 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC0"] { color: #e98551 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC1"] { color: #e32851 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC2"] { color: #a9442c !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC3"] { color: #e54d64 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC4"] { color: #ae3028 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC5"] { color: #e77162 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC6"] { color: #dd2d35 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC7"] { color: #b32e43 !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC8"] { color: #eb5a4c !important; }
		.live-chat-widget .comment .content a.yt-user-name[data-ytid^="UC9"] { color: #c6383e !important; }
		`);
	});
}