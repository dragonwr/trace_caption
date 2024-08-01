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
      quick = false;
      updateCaptions();

    }
  }
};

function updateCaptions() {
  enCaption = document.querySelector('#en_caption');
  captionsContainer = document.querySelector('.captions-text');
  captionLines = captionsContainer.children;
  lastCaptionLine = captionLines[captionLines.length - 1];

  if (!enCaption || !lastCaptionLine) return;

  currentEnCaption = enCaption.innerText.split(' ');
  var latestVisualText = lastCaptionLine.innerText.split(' ')
  var highlightIndex = latestVisualText.length;

  isRoll = document.querySelector('#caption-window-1').classList.contains('ytp-rollup-mode')
  if (isRoll && !quick) {
    updateCaptions();
    quick = false;
  }

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
// var captionsContainer = document.querySelector('.captions-text');
// var observer = new MutationObserver(mutationCallback);
// observer.observe(captionsContainer, observerConfig);

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

startObserver();

// Set up periodic checks
setInterval(checkObserver, 500); // Check every 5 seconds
// setInterval(()=>{
//     captionsContainer = document.querySelector('.captions-text');
//     captionLines = captionsContainer.children;
//    lastCaptionLine = captionLines[captionLines.length - 1];
//   latestVisualText=lastCaptionLine.innerText.split(' ')
//   var highlightIndex = latestVisualText.length;
//      if(highlightIndex==currentEnCaption.length+1){
//     currentEnCaption = enCaption.innerText.split(' ');
//        cpContent.innerHTML=''
//     updateCpContent(currentEnCaption);
//     console.log('euqal')
//   }
// },100)
function startObserver() {
  var captionsContainer = document.querySelector('.captions-text');
  if (captionsContainer) {
    observer = new MutationObserver(mutationCallback);
    observer.observe(captionsContainer, observerConfig);
    console.log('MutationObserver started');
  } else {
    console.log('Captions container not found. Retrying in 1 second...');
    setTimeout(startObserver, 1000);
  }
}

function checkObserver() {



  var currentTime = Date.now();
  if (currentTime - lastUpdateTime > 500) { // 5 seconds threshold
    console.log('No updates for 5 seconds. Restarting observer...');
    if (observer) {
      observer.disconnect();
    }
    startObserver();
  }
}
