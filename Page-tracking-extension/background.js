// Adding listener to look for msgs
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    sendResponse({"BackgroundResponse": request});

    var contentResponseData = JSON.stringify(request);
    console.log(request);

    $.ajax({
        url: 'https://localhost:5000/TrackingData',
        crossDomain: true,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: contentResponseData,
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
