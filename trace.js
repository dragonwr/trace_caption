off()
var lastEnCaption = '';
var cpContent = null;

// Configuration for the observer
var observerConfig = {
  childList: true,
  subtree: true,
  characterData: true
};

// Mutation callback function
var mutationCallback = function(mutationsList) {
  for (var i = 0; i < mutationsList.length; i++) {
    var mutation = mutationsList[i];
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      updateCaptions();
    }
  }
};

function updateCaptions() {
  var enCaption = document.querySelector('#en_caption');
  var captionsContainer = document.querySelector('.captions-text');
  var captionLines = captionsContainer.children;
  var lastCaptionLine = captionLines[captionLines.length - 1];

  if (!enCaption || !lastCaptionLine) return;

  var currentEnCaption = enCaption.innerText.split(' ');
  var latestVisualText = lastCaptionLine.innerText.split(' ')
  var highlightIndex = latestVisualText.length;

  if (currentEnCaption !== lastEnCaption) {
    updateCpContent(currentEnCaption);
    lastEnCaption = currentEnCaption;

  }

  highlightUpToIndex(highlightIndex);
}

function updateCpContent(text) {
  if (!cpContent) {
    cpContent = document.getElementById('cp_content');
  }
  cpContent.innerHTML = '';

  for (var i = 0; i < text.length; i++) {
    var span = document.createElement('span');
    span.textContent = text[i];
    span.classList.add('caption-char');
    span.classList.add('space');
    span.classList.add('onion');

    cpContent.appendChild(span);
  }

}

function highlightUpToIndex(index) {
  if (!cpContent) return;

  var spans = document.querySelectorAll('#cp_content span');

  //     spans.forEach((itm,i) => {
  //       itm.classList.remove('pickle');
  //     })
  spans[index - 1].classList.add('pickle');

  // Add space after the last span

  //   for (var i = 0; i < spans.length; i++) {
  //     if (i < index) {
  //       spans[i].classList.add('pickle');
  //       spans[i].classList.remove('onion');
  //      spans[spans.length - 1];
  // lastSpan.insertAdjacentText('afterend', ' ');
  //     } else {
  //       spans[i].classList.add('onion');
  //       spans[i].classList.remove('pickle');
  //     }
  //   }

  //   document.querySelectorAll('#cp_content .pickle').forEach((element, index) => {
  //     element.style.setProperty('--nth', index + 2);
  //   });

}

// Create and start the observer
var captionsContainer = document.querySelector('.captions-text');
var observer = new MutationObserver(mutationCallback);
observer.observe(captionsContainer, observerConfig);

// Function to stop the observer
function off() {
  observer.disconnect();
  console.log('MutationObserver has been stopped.');
}


// Initial setup
if (!document.getElementById('cp_content')) {
  var cpDiv = document.createElement("div");
  cpDiv.id = "cp";
  var cpContent = document.createElement("span");
  cpContent.id = "cp_content";
  cpDiv.appendChild(cpContent);
  var captionControl2Parent = document.getElementById('ytd-player').parentElement;
  captionControl2Parent.insertAdjacentElement('afterbegin', cpDiv);
}
