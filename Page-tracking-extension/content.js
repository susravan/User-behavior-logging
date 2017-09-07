
// Logging time spent on a page
$(document).ready(function() {
	var user_id = "dummy";

  	var start;
  	var end;
  	var time_spent;

  	window.addEventListener('focus', function() {
  		start = Date.now();
  	});
	
	console.log("start = ", start)
	
	$(window).on('blur', function() {
  		end = new Date().getTime();
  	});

	console.log("end = ", end);

	time_spent = end - start;
	console.log(time_spent/1000)

    var evtData = {
		"userId": user_id,
		"evt_type": "Time Spent",
		"pageHTML": document.URL,
		"object_id": 0,
		"evt_datetime": (time_spent/1000).toString()
	};
	
	// console.log(evtData);

	// Sending data to background.js
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': null}, function(response) {
	  // console.log(response.BgResponse);
	});
});


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
		"evt_datetime": date + ' ' + time
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

	// Sending data to background.js
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
		"evt_datetime": date + ' ' + time
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

	// var ansData = {
	// 	"question_id": ques_id,
	// 	"pageHTML": document.URL,
	// 	"content": $('#wmd-preview').eq(0).text(),
	// 	"DateTime": Date.now()
	// };

	// Check for errors and send the data
	if($('.wmd-input processed validation-error').length == 0 && $('.message-text').length == 0) {
		// Sending data to background.js
		console.log("Sending the data");
		chrome.runtime.sendMessage({'evtData': evtData, 'quesData': quesData}, function(response) {
		  // console.log(response.BgResponse);
		});
	}
	else {
		console.log("Did not send the data");
	}
});


// Share the question tracking
$('.short-link').eq(0).on('click', function() {
	// console.log("share question");
	
	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

	var today = new Date();
	var date = (today.getMonth() + 1) + '-' + (today.getDate()) + '-' + today.getFullYear();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

	var evtData = {
		"userId": user_id,
		"evt_type": "Shared Question",
		"pageHTML": document.URL,
		"object_id": ques_id,
		"evt_datetime": date + ' ' + time
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
		"evt_datetime": date + ' ' + time
	};

	console.log(evtData);
	// Sending data to background.js
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
		"evt_datetime": date + ' ' + time
	};
	
	console.log(evtData);
	// Sending data to background.js
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': null}, function(response) {
	  // console.log(response.BgResponse);
	});
});


// // Adding a comment
// var $addCommentLinks = $('.js-add-link.comments-link.disabled-link')

// for(var i=0; i < $addCommentLinks.length; i++) {

// 	// console.log($('#answer-218390').eq(i).find('span.relativetime').eq(0).attr('title'));

// 	$addCommentLinks.eq(i).on('click', function() {
		
// 		console.log($addCommentLinks.eq(i));

// 		// var DOMAnswer_id = "#answer-" + ans_id;
// 		// console.log($(DOMAnswer_id).eq(i).find('span.vote-count-post').eq(0));

// 		// var ques_id = document.URL.split('/')[4];
// 		// var user_id = "dummy";
	
// 		// var evtData = {
// 		// 	"userId": user_id,
// 		// 	"evt_type": "Add Comment",
// 		// 	"pageHTML": document.URL,
// 		// 	"question_id": ques_id,
// 		// 	"evt_datetime": Date.now()
// 		// };

// 		// var tags = null

// 		// var quesData = {
// 		// 	"object_type": "Answer",
// 		// 	"object_id": ans_id,
// 		// 	"pageHTML": document.URL,
// 		// 	"votes": $(DOMAnswer_id).eq(i).find('span.vote-count-post').eq(0).text,
// 		// 	"answers": 0,
// 		// 	"views": null,
// 		// 	"DateTime": $(DOMAnswer_id).eq(i).find('span.relativetime').eq(0).attr('title'),
// 		// 	"Tags": tags
// 		// };

// 		// console.log(quesData);
// 	});
// }

// var addCommentEventHandler = function(ans_id) {
	
// 	var ques_id = document.URL.split('/')[4];
// 	var user_id = "dummy";
// 	var DOMAnswer_id = "#answer-" + ans_id;

// 	var evtData = {
// 		"userId": user_id,
// 		"evt_type": "Add Comment",
// 		"pageHTML": document.URL,
// 		"question_id": ques_id,
// 		"evt_datetime": Date.now()
// 	};

// 	var tags = null

// 	var quesData = {
// 		"object_type": "Answer",
// 		"object_id": ans_id,
// 		"pageHTML": document.URL,
// 		"votes": $(DOMAnswer_id).eq(0).find('span.vote-count-post')[0].innerHTML,
// 		"answers": 0,
// 		"views": null,
// 		"DateTime": $(DOMAnswer_id).eq(0).find('span.relativetime').eq(0).attr('title'),
// 		"Tags": tags
// 	};

// 	console.log(quesData);
// }
