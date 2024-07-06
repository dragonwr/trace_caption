let observer = null;
let observeInterval = null;
let lastFullCaption = '';
let captionHistory = [];
const MAX_HISTORY = 10;

function observeCaptions() {
  if (observer) {
    console.log('Already observing captions.');
    return;
  }

  const captionsContainer = document.querySelector('.caption-window, .ytp-caption-window-container');
  if (!captionsContainer) {
    console.error('Captions container not found. Will retry in 5 seconds.');
    setTimeout(observeCaptions, 5000);
    return;
  }

  const callback = function(mutationsList) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        processCaption(captionsContainer);
      }
    }
  };

  observer = new MutationObserver(callback);
  observer.observe(captionsContainer, { childList: true, subtree: true });
  console.log('Started observing captions.');

  observeInterval = setInterval(() => {
    if (!document.querySelector('.caption-window, .ytp-caption-window-container')) {
      console.log('Captions container lost. Restarting observation.');
      stopObservingCaptions();
      observeCaptions();
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
  cpContent.id = "cp_content";
  cpDiv.appendChild(cpContent);
  captionControl2Parent.insertAdjacentElement('afterbegin', cpDiv);
}

function processCaption(container) {
  const captionText = container.innerText.trim().replace(/\n/g, ' ');
  if (captionText && captionText !== lastFullCaption) {
    lastFullCaption = captionText;
    updateCaptionHistory(captionText);
    const words = captionText.split(/\s+/);
    const lastWord = words[words.length - 1];
    console.log('Last word:', lastWord);
            var subway = document.createElement('span');
    subway.textContent=lastWord;
    subway.classList.add('pickle')
    subway.style='color:pink;padding:0 .113em;'
            cp_content.appendChild(subway)
          var rolling = captionWindow.classList.contains('ytp-rollup-mode');
    if(rolling){
 let timeoutId = setTimeout(function() {
            cp_content.remove();
          }, 80);
    }
    //console.log('Full caption:', captionText);
  }
}

function updateCaptionHistory(caption) {
  captionHistory.push(caption);
  if (captionHistory.length > MAX_HISTORY) {
    captionHistory.shift();
  }
  console.log('Caption History:', captionHistory);
}

function stopObservingCaptions() {
  if (observer) {
    observer.disconnect();
    observer = null;
    console.log('Stopped observing captions.');
  }
  if (observeInterval) {
    clearInterval(observeInterval);
    observeInterval = null;
  }
}

function getCaptionHistory() {
  return captionHistory;
}

function getFullTranscript() {
  return captionHistory.join(' ');
}

observeCaptions();

// Usage:
// stopObservingCaptions() - to stop observing
// observeCaptions() - to restart observing
// getCaptionHistory() - to get recent caption history
// getFullTranscript() - to get full transcript of observed captions
