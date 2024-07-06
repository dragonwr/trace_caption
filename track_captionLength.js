var observer = null;
var observeInterval = null;
var lastFullCaption = '';
var captionHistory = [];
var MAX_HISTORY = 10;

function observeCaptions() {
  if (observer) {
    console.log('Already observing captions.');
    return;
  }

  var captionsContainer = document.querySelector('.caption-window, .ytp-caption-window-container');
  if (!captionsContainer) {
    console.error('Captions container not found. Will retry in 5 seconds.');
    setTimeout(observeCaptions, 5000);
    return;
  }

  var callback = function(mutationsList) {
    for (var mutation of mutationsList) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        processCaption(captionsContainer);
      }
    }
  };

  observer = new MutationObserver(callback);
  observer.observe(captionsContainer, { childList: true, subtree: true });
  console.log('Started observing captions.');

  observeInterval = setInterval(function() {
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
  var captionText = container.innerText.trim().replace(/\n/g, ' ');
  var enCaptionElement = document.getElementById('en_caption');
  var enCaptionText = enCaptionElement ? enCaptionElement.innerText : '';

  if (captionText && captionText !== lastFullCaption) {
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

    var cpContentElement = document.getElementById('cp_content');
    var cpContentWords = cpContentElement.innerText.split(/\s+/);

    // Check if cp_content inner text length exceeds 10
    if (cpContentWords.length > 10) {
      cpContentElement.textContent = '';
      // Recalculate the length after clearing
      cpContentWords = cpContentElement.innerText.split(/\s+/);
      console.log('cp_content length after clearing:', cpContentWords.length);
    }

    var rolling = container.classList.contains('ytp-rollup-mode');
    if (rolling) {
      setTimeout(function() {
        cpContentElement.textContent = '';
        // Recalculate the length after clearing
        cpContentWords = cpContentElement.innerText.split(/\s+/);
        console.log('cp_content length after clearing in rollup mode:', cpContentWords.length);
      }, 80);
    }

    // Track en_caption text length
    if (enCaptionElement) {
      var enCaptionLength = enCaptionText.split(/\s+/).length;
      var cpContentLength = cpContentElement.innerText.split(/\s+/).length;
      console.log('Length of en_caption inner text:', enCaptionLength);
      console.log('Length of cp_content inner text:', cpContentLength);

      // Log a message if en_caption text length is the same as cp_content text length
      if (enCaptionLength === cpContentLength) {
        console.log('en_caption and cp_content have the same length.');
      }

      // Clear cp_content if enCaption text length is the same
      if (enCaptionLength === cpContentLength) {
        cpContentElement.textContent = '';
        // Recalculate the length after clearing
        cpContentLength = cpContentElement.innerText.split(/\s+/).length;
        console.log('cp_content length after clearing due to en_caption length match:', cpContentLength);
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
