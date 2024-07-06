off()
// Function to stop the observer (optional)
function off() {
  observer.disconnect();
  console.log('MutationObserver has been stopped.');
}

// Ensure yPlayerJoint is true and the code runs only once

// Get the parent element of the player
var captionControl2Parent = document.getElementById('ytd-player').parentElement;

// Create or select the container for the caption text
var cpElement = captionControl2Parent.querySelector("#cp");
if (!cpElement) {
  var cpDiv = document.createElement("div");
  cpDiv.id = "cp";

  var cpContent = document.createElement("p");
  cpContent.id = "cp_content";
  cpDiv.appendChild(cpContent);
  captionControl2Parent.insertAdjacentElement('afterbegin', cpDiv);
}

// Select the container that holds the caption text lines
var captionsContainer = document.querySelector('.captions-text');

// Configuration for the observer (which mutations to observe)
var observerConfig = {
  childList: true,
  subtree: true,
  characterData: true
};
// Callback function to execute when mutations are observed
var mutationCallback = function(mutationsList) {
  var hasRun = false;
  for (var i = 0; i < mutationsList.length; i++) {
    var mutation = mutationsList[i];
    if (mutation.type==='childList') {
      // Get all child elements within the .captions-text container
      var captionLines = captionsContainer.children;

      // Get the last child element
      var lastCaptionLine = captionLines[captionLines.length - 1];

      // Get the text content of the last caption line
      var latestText = lastCaptionLine.innerText || lastCaptionLine.textContent;
      var wordsArray = latestText.split(' ');


      var ctext = document.querySelector('#captionConrtol_2')?.textContent.split(' ') || ['a', 'b', 'c'];

      var yPlayer = document.getElementById('ytd-player');
      var burger = document.getElementById('cp_content');

      if (!burger) {
        burger = document.createElement('span');
        burger.id = 'cp_content';
        // Optionally, you can add more attributes or content to your 'burger' element here
        cp.insertBefore(burger, cp.firstChild);
      }

      // Get the element by its ID
      var captionWindow = document.getElementById('caption-window-1');

      // Check if the element has a new class added dynamically
      var hasNewClass = captionWindow.classList.contains('ytp-rollup-mode');
      if (!hasRun) {
        hasRun = true;
        // Initial injection of content
        //         burger.innerHTML = ctext.map((item) => {
        //           return `<span class='lime' style='color:teal;padding:0 .13em;'>${item}</span>`;
        //         }).join(' ');

        var subway = document.createElement('span');

        let lastWord = wordsArray[wordsArray.length - 1];
        subway.textContent = lastWord;

        //         subway.style='color:pink;padding:0 .113em;'
//         subway.classList.add('pickle');
        subway.classList.add('swing');
        cp_content.appendChild(subway)
        if (hasNewClass) {
          hasRun=true;
          // Set a timeout and store the timeout ID
          let timeoutId = setTimeout(function() {
            cp_content.remove();
          }, 80);


          // Clear the timeout if needed
          //         end remove
        }
      }

    }
  }
};

// Create an instance of MutationObserver
var observer = new MutationObserver(mutationCallback);

// Start observing the container node for configured mutations
observer.observe(captionsContainer, observerConfig);
