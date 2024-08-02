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
  for (var i = 0; i < mutationsList.length; i++) {
    var mutation = mutationsList[i];
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      // Get all child elements within the .captions-text container
      var captionLines = captionsContainer.children;

      // Get the last child element
      var lastCaptionLine = captionLines[captionLines.length - 1];

      // Get the text content of the last caption line
      var latestText = lastCaptionLine.innerText || lastCaptionLine.textContent;
      var wordsArray = latestText.split(' ');


      var ctext = document.querySelector('#captionConrtol_2')?.textContent.split(' ') || [];

      var yPlayer = document.getElementById('ytd-player');
      var burger = document.createElement('span');
      burger.id = 'animated';
      document.querySelectorAll('#animated').forEach(element => element.remove());

      if (wordsArray.length < ctext.length) {
        // Initial injection of content
        burger.innerHTML = ctext.map((item) => {
          return `<span style='color:teal;'>${item}</span>`;
        }).join(' ');

        // Insert the content into the DOM
        yPlayer.insertBefore(burger, yPlayer.firstChild);

        // Add lime class to the specified wordsArray position

      } else {
        animated.remove();
      }
    }
  }
};

// Create an instance of MutationObserver
var observer = new MutationObserver(mutationCallback);

// Start observing the container node for configured mutations
observer.observe(captionsContainer, observerConfig);
