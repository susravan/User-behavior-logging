document.addEventListener('DOMContentLoaded', function() {
  var checkPageButton = $('#checkPage');
  checkPageButton.on('click', function() {
      // console.log("Cliked on checkPage");
      window.open('https://localhost:5000', '_blank');
      win.focus();

  });
}, false);