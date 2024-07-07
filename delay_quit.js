off()
var observer = null;
var observeInterval = null;
var lastFullCaption = '';
var captionHistory = [];
var MAX_HISTORY = 10;

function oC() {
  if (observer) {
    console.log('Already observing captions.');
    return;
  }

  var captionsContainer = document.querySelector('.caption-window');
  if (!captionsContainer) {
    console.error('Captions container not found. Will retry in 5 seconds.');
    setTimeout(oC, 5000);
    return;
  }

  var callback = function(mutationsList) {
    for (var mutation of mutationsList) {
      hr = false;
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        processCaption(captionsContainer);
      }
    }
  };

  observer = new MutationObserver(callback);
  observer.observe(captionsContainer, {
    childList: true,
    subtree: true
  });
  console.log('Started observing captions.');

  observeInterval = setInterval(function() {
    if (!document.querySelector('.caption-window, .ytp-caption-window-container')) {
      console.log('Captions container lost. Restarting observation.');
      stopObservingCaptions();
      oC();
    }
  }, 5000);
}

// Get the parent element of the player
var captionControl2Parent = document.getElementById('ytd-player').parentElement;

// Create or select the container for the caption text
var cpElement = captionControl2Parent.querySelector("#cp");
if (!cpElement) {
  var cpDiv = document.createElement("div");
  cpDiv.id = "cp";

  var cpContent = document.createElement("p");
  var partTwo = document.createElement("p");
  partTwo.id = 'pt_2';
  cpContent.id = "cp_content";
  cpDiv.appendChild(cpContent);
  cpDiv.appendChild(partTwo);
  captionControl2Parent.insertAdjacentElement('afterbegin', cpDiv);
}

function processCaption(container) {
  var captionText = container.innerText.trim().replace(/\n/g, ' ');
  var enCaptionElement = document.getElementById('en_caption');
  var enCaptionText = enCaptionElement ? enCaptionElement.innerText : '';

  if (!hr && captionText && captionText !== lastFullCaption) {
    lastFullCaption = captionText;
    updateCaptionHistory(captionText);
    var words = captionText.split(/\s+/);
    var lastWord = words[words.length - 1];
    console.log('Last word:', lastWord);

    var subway = document.createElement('span');
    subway.textContent = lastWord;
    subway.classList.add('pickle');
    subway.style = 'color:pink;padding:0 .113em;';
    cp_content.appendChild(subway);
    hr = true;
    // Check for .ytp-rollup-mode in the caption container
    if (container.classList.contains('ytp-rollup-mode')) {
      var cpContentElement = document.getElementById('cp_content');

      function quitAgain() {
        var cpContentElement = document.getElementById('cp_content');
        if (cpContentElement) {
          cpContentElement.textContent = '';
        }
        // Clear the timeout if it's set
        if (timeId) {
          clearTimeout(timeId);
          timeId = null;
        }
      }
      timeId = setTimeout(quitAgain, 200)
      hr = true;
      console.log('.ytp-rollup-mode detected in caption window.');
    }
    // Check if cp_content inner text length exceeds 20
    if (cpContentElement.children.length > 20) {}

    // Track en_caption text length
    if (enCaptionElement) {
      var enCaptionLength = enCaptionText.split(' ').length;
      console.log('Length of en_caption inner text:', enCaptionLength);

      // Clear cp_content if enCaption text length is the same
      if (cpContentElement && enCaptionLength === cpContentElement.children.length) {
        cpContentElement.textContent = '';
      }
    }
  }


}

function updateCaptionHistory(caption) {
  if (captionHistory.length >= MAX_HISTORY) {
    captionHistory.shift();
  }
  captionHistory.push(caption);
}
var timeId = null; // Declare timeId globally

// Your existing code...

function off() {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log('Stopped observing captions.');
  }
  if (observeInterval) {
    clearInterval(observeInterval);
    observeInterval = null;
  }
  // Clear the setTimeout if timeId is set
  if (timeId) {
    clearTimeout(timeId);
    timeId = null;
  }
}

// Your existing code...

function getCaptionHistory() {
  return captionHistory;
}

function getFullTranscript() {
  return captionHistory.join(' ');
}

oC();
