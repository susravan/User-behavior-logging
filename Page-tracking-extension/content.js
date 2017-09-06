
// Get number of votes, answers and views for each question
var question_summary = $(".question-summary")
var question_stats_arr = []

// Get to know clearly about the html parsering using javascript

for (var i=0; i < question_summary.length-13; i++) {
	question_stats = {
		"question_id": question_summary.get(i).id.split('-')[2],
		"votes": question_summary[i].getElementsByClassName("vote-count-post")[0].childNodes[0].innerHTML,
		"answers": question_summary[i].getElementsByClassName("status answered-accepted")[0].childNodes[1].innerHTML,
		"views": question_summary[i].getElementsByClassName("views supernova")[0].innerHTML.trim().split(' ')[0]
	};
	question_stats_arr.push(question_stats);
}

$(document).ready(function(evt) {
	var ques_id = document.URL.split('/')[4];

	// console.log(typeof($(".subheader.answers-subheader")));
	// console.log(typeof($(".subheader.answers-subheader").eq(0)));
	// console.log(typeof($(".subheader.answers-subheader")[0].childNodes));
	// console.log(typeof($(".subheader.answers-subheader")[0].childNodes[0]));
	// console.log(typeof($(".subheader.answers-subheader")[0].childNodes[0].nextSibling));
	// console.log(typeof($(".subheader.answers-subheader")[0].childNodes[0].nextSibling.innerHTML));
	// console.log(typeof($(".subheader.answers-subheader")[0].childNodes[0].nextSibling.innerHTML.trim().split(' ')[0]));

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
		"userId": "abc",
		"evt_type": "click",
		"pageHTML": document.URL,
		"question_id": ques_id,
		"evt_datetime": Date.now()
	};

	var tagListChildren = document.getElementsByClassName("post-taglist")[0].children;
	var tags = ""

	for(var i=0; i < tagListChildren.length; i++) {
		tags += tagListChildren[i].innerHTML + "^";
	}

	var quesData = {
		"question_id": ques_id,
		"pageHTML": document.URL,
		"votes": $(".vote-count-post")[0].innerHTML,
		"answers": $(".subheader.answers-subheader")[0].childNodes[1].childNodes[1].innerHTML,
		"views": parseInt($(".label-key")[3].childNodes[1].innerHTML.split(' ')[0].split(',').join('')),
		"DateTime": $(".label-key")[1].getAttribute("title"),
		"Tags": tags
	};

	// Sending data to background.js
	chrome.runtime.sendMessage({'evtData': evtData, 'quesData': quesData}, function(response) {
	  // console.log(response.BgResponse);
	});
});


// // Sending data to background.js
// chrome.runtime.sendMessage({"QuestionDetails": question_stats_arr}, function(response) {
//   console.log(response.BgResponse);
// });
