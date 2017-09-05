
// Get number of votes, answers and views for each question
var question_summary = $(".question-summary")
var question_stats_arr = []

// Get to know clearly about the html parsering using javascript
console.log(question_summary.get(0))
for (var i=0; i < question_summary.length-13; i++) {
	question_stats = {
		"question_id": question_summary.get(i).id.split('-')[2],
		"votes": question_summary[i].getElementsByClassName("vote-count-post")[0].childNodes[0].innerHTML,
		"answers": question_summary[i].getElementsByClassName("status answered-accepted")[0].childNodes[1].innerHTML,
		"views": question_summary[i].getElementsByClassName("views supernova")[0].innerHTML.trim().split(' ')[0]
	};
	question_stats_arr.push(question_stats);

	console.log("Question Id = ", question_summary.get(i).id.split('-')[2])
	console.log("Votes = ", question_summary[i].getElementsByClassName("vote-count-post")[0].childNodes[0].innerHTML)
	console.log("Answers = ", question_summary[i].getElementsByClassName("status answered-accepted")[0].childNodes[1].innerHTML)
	console.log("Views = ", question_summary[i].getElementsByClassName("views supernova")[0].innerHTML.trim().split(' ')[0])

}

// $.each($question_summary, function(index, ele){
// 	$temp_ele = $question_summary.get(index);
// })

// Sending data to background.js
chrome.runtime.sendMessage({"QuestionDetails": question_stats_arr}, function(response) {
  console.log(response.BgResponse);
});