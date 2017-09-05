chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    sendResponse({"BgResponse": request.QuestionDetails.length});
    var QuestionDetailsString = JSON.stringify(request.QuestionDetails);

    $.ajax({
        url: 'https://localhost:5000/TrackingData',
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: QuestionDetailsString,
        type: 'POST',
        success: function(response) {
            alert(response);
            console.log("SUCCESS");
        },
        error: function(error) {
            console.log("ERROR");
        }
  });
});
