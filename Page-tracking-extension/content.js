// Question click event handler
$(document).ready(function(evt) {
	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";
	
	var today = new Date();
	var date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var evtData = {
		"userId": user_id,
		"evt_type": "Visited",
		"pageHTML": document.URL,
		"object_id": ques_id,
		"evt_datetime": date + ' ' + time,
		"evt_timestamp": Date.now()
	};

	var tagListChildren = document.getElementsByClassName("post-taglist")[0].children;
	var tags = ""

	for(var i=0; i < tagListChildren.length; i++) {
		tags += tagListChildren[i].innerHTML + "^";
	}

	if($(".subheader.answers-subheader")[0].childNodes[1].childNodes[1] === undefined)
		answers = 0
	else
		answers = $(".subheader.answers-subheader")[0].childNodes[1].childNodes[1].innerHTML;

	var quesData = {
		"object_type": "Question",
		"object_id": ques_id,
		"pageHTML": document.URL,
		"votes": $(".vote-count-post")[0].innerHTML,
		"answers": answers,
		"views": parseInt($(".label-key")[3].childNodes[1].innerHTML.split(' ')[0].split(',').join('')),
		"DateTime": $(".label-key")[1].getAttribute("title"),
		"Tags": tags
	};

	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': quesData}, function(response) {
	  // console.log(response.BgResponse);
	});
});


// Post answer tracking
$('#submit-button').on('click', function() {

	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

	var today = new Date();
	var date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var evtData = {
		"userId": user_id,
		"evt_type": "Posted Answer to",
		"pageHTML": document.URL,
		"object_id": ques_id,
		"evt_datetime": date + ' ' + time,
		"evt_timestamp": Date.now()
	};

	var tagListChildren = document.getElementsByClassName("post-taglist")[0].children;
	var tags = ""

	for(var i=0; i < tagListChildren.length; i++) {
		tags += tagListChildren[i].innerHTML + "^";
	}

	if($(".subheader.answers-subheader")[0].childNodes[1].childNodes[1] === undefined)
		answers = 0
	else
		answers = $(".subheader.answers-subheader")[0].childNodes[1].childNodes[1].innerHTML;

	var quesData = {
		"object_type": "Question",
		"object_id": ques_id,
		"pageHTML": document.URL,
		"votes": $(".vote-count-post")[0].innerHTML,
		"answers": answers,		"views": parseInt($(".label-key")[3].childNodes[1].innerHTML.split(' ')[0].split(',').join('')),
		"DateTime": $(".label-key")[1].getAttribute("title"),
		"Tags": tags
	};
	
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': quesData}, function(response) {
			  // console.log(response.BgResponse);
	});

	// Tried to actually send data only after the constraints are removed. But facing problem to check the updated HTML after
	// the answer validation is done
		// if($('.wmd-input processed validation-error').length == 0 && $('.message-text').length == 0) {
			// Sending data to background.js
			// console.log("Sending the data");
			// chrome.runtime.sendMessage({'evtData': evtData, 'quesData': quesData}, function(response) {
			//   // console.log(response.BgResponse);
			// });
		// }
		// else {
		// 	console.log("Did not send the data");
		// }
});


// Share the question tracking
$('.short-link').on('click', function() {
	
	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

	var today = new Date();
	var date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var evtData = {
		"userId": user_id,
		"evt_type": "Shared",
		"pageHTML": document.URL,
		"object_id": this.getAttribute('href').split('/')[2],
		"evt_datetime": date + ' ' + time,
		"evt_timestamp": Date.now()
	};

	// Question details
	var tagListChildren = document.getElementsByClassName("post-taglist")[0].children;
	var tags = ""

	for(var i=0; i < tagListChildren.length; i++) {
		tags += tagListChildren[i].innerHTML + "^";
	}

	if($(".subheader.answers-subheader")[0].childNodes[1].childNodes[1] === undefined)
		answers = 0
	else
		answers = $(".subheader.answers-subheader")[0].childNodes[1].childNodes[1].innerHTML;

	var quesData = {
		"object_type": "Q/A",
		"object_id": ques_id,
		"pageHTML": document.URL,
		"votes": $(".vote-count-post")[0].innerHTML,
		"answers": answers,
		"views": parseInt($(".label-key")[3].childNodes[1].innerHTML.split(' ')[0].split(',').join('')),
		"DateTime": $(".label-key")[1].getAttribute("title"),
		"Tags": tags
	};
	
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': quesData}, function(response) {
	  // console.log(response.BgResponse);
	});
});


// Upvote eventhandler
$(".vote-up-off").on('click', function() {
	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

	var today = new Date();
	var date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var evtData = {
		"userId": user_id,
		"evt_type": "UpVoted",
		"pageHTML": document.URL,
		"object_id": this.previousElementSibling.getAttribute('value'),
		"evt_datetime": date + ' ' + time,
		"evt_timestamp": Date.now()
	};

	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': null}, function(response) {
	  // console.log(response.BgResponse);
	});
});


// Downvote eventhandler
$(".vote-down-off").on('click', function() {
	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

	var today = new Date();
	var date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var evtData = {
		"userId": user_id,
		"evt_type": "DownVoted",
		"pageHTML": document.URL,
		"object_id": this.previousElementSibling.previousElementSibling.previousElementSibling.getAttribute('value'),
		"evt_datetime": date + ' ' + time,
		"evt_timestamp": Date.now()
	};
	
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': null}, function(response) {
	  // console.log(response.BgResponse);
	});
});

// Ask Question Handler
$('.btn').on('click', function() {
	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";
	
	var today = new Date();
	var date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var evtData = {
		"userId": user_id,
		"evt_type": "Asked Question",
		"pageHTML": document.URL,
		"object_id": 0,
		"evt_datetime": date + ' ' + time,
		"evt_timestamp": Date.now()
	};
	console.log(evtData);
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': null}, function(response) {
	  // console.log(response.BgResponse);
	});
});
