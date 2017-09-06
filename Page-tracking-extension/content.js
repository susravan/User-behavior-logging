
// Get number of votes, answers and views for each question
var question_summary = $(".question-summary")
var question_stats_arr = []

// Get to know clearly about the html parsering using javascript

for (var i=0; i < question_summary.length-13; i++) {
	question_stats = {
		"object_id": question_summary.get(i).id.split('-')[2],
		"votes": question_summary[i].getElementsByClassName("vote-count-post")[0].childNodes[0].innerHTML,
		"answers": question_summary[i].getElementsByClassName("status answered-accepted")[0].childNodes[1].innerHTML,
		"views": question_summary[i].getElementsByClassName("views supernova")[0].innerHTML.trim().split(' ')[0]
	};
	question_stats_arr.push(question_stats);
}


// Logging time spent on a page
$(document).ready(function() {
  	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

  	var start = new Date().getTime();
  	var end;

    $(window).on('unload', function() {
        end = new Date().getTime();
    });

	var time_spent = parseInt(end - start)
	console.log(time_spent)

    var evtData = {
		"userId": user_id,
		"evt_type": "Time Spent",
		"pageHTML": document.URL,
		"object_id": 0,
		"evt_datetime": time_spent
	};
	
	console.log(evtData);

	// Sending data to background.js
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': null}, function(response) {
	  // console.log(response.BgResponse);
	});
});


// Question click event handler
$(document).ready(function(evt) {
	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

	// console.log($(".subheader.answers-subheader"));
	// console.log($(".subheader.answers-subheader")[0]);
	// console.log($(".subheader.answers-subheader")[0].childNodes);
	// console.log($(".subheader.answers-subheader")[0].childNodes[1]);
	// console.log($(".subheader.answers-subheader")[0].childNodes[1].childNodes[1].innerHTML);

	// console.log($(".subheader.answers-subheader"));
	// console.log($(".subheader.answers-subheader").eq(0));
	// console.log($(".subheader.answers-subheader").eq(0).children('h2').eq(0).children('span').eq(0));
	// console.log($(".subheader.answers-subheader")[0].childNodes[1]);
	// console.log($(".subheader.answers-subheader")[0].childNodes[1].childNodes[1].innerHTML);

	var evtData = {
		"userId": user_id,
		"evt_type": "Visit",
		"pageHTML": document.URL,
		"object_id": ques_id,
		"evt_datetime": Date.now()
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
	setTimeout(function() {}, 500);

	var ques_id = document.URL.split('/')[4];
	var user_id = "dummy";

	var evtData = {
		"userId": user_id,
		"evt_type": "Post Answer",
		"pageHTML": document.URL,
		"object_id": ques_id,
		"evt_datetime": Date.now()
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

	var evtData = {
		"userId": user_id,
		"evt_type": "Share Question",
		"pageHTML": document.URL,
		"object_id": ques_id,
		"evt_datetime": Date.now()
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

	var evtData = {
		"userId": user_id,
		"evt_type": "UpVote",
		"pageHTML": document.URL,
		"object_id": this.previousElementSibling.getAttribute('value'),
		"evt_datetime": Date.now()
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

	var evtData = {
		"userId": user_id,
		"evt_type": "DownVote",
		"pageHTML": document.URL,
		"object_id": this.previousElementSibling.previousElementSibling.previousElementSibling.getAttribute('value'),
		"evt_datetime": Date.now()
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
