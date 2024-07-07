var newLook = `
<style>
  #cp {
    top: 80px;
    max-width: 800px;
    background-color: rgba(0, 0, 0, 0.7);
    color: #fff;
    padding: 10px;
    border-radius: 5px;
    z-index: 9999;
    font-family: Arial, sans-serif;
  }
  #cp_content {
    margin-bottom: 10px;
    display: inline-block;
  }
  #pt_2 {
    font-size: 1.2em;
    opacity: 0.6;
    display: inline-block;
  }
  
  .remaining-word {
    display: inline-block;
    transition: opacity 0.3s ease;
  }
  .remaining-word:hover {
    opacity: 1;
  }
  
  @keyframes fadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  .fade-out {
    animation: fadeOut 0.225s ease-out forwards;
  }
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', newLook);

var observer = null;
var observeInterval = null;
var lastFullCaption = '';
var captionHistory = [];
var spokenWords = [];
var MAX_HISTORY = 10;


function observeCaptions() {}

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
  var captionText = container.querySelector('.caption-visual-line:last-of-type').innerText.trim().replace(/\n/g, ' ');
  var enCaptionElement = document.getElementById('en_caption');
  var enCaptionText = enCaptionElement ? enCaptionElement.innerText : '';

  if (captionText && captionText !== lastFullCaption) {
    lastFullCaption = captionText;
    updateCaptionHistory(captionText);

    var words = captionText.split(/\s+/);
    var newWords = words.slice(spokenWords.length);

    newWords.forEach(word => {
      var subway = document.createElement('span');
      subway.textContent = word + ' ';
      subway.classList.add('pickle');
      cp_content.appendChild(subway);
      spokenWords.push(word);
    });

    console.log('Spoken words length:', spokenWords.length);

    // Update remaining words
    updateRemainingWords(enCaptionText, spokenWords);

    // Track en_caption text length
    var enCaptionLength = enCaptionText.split(' ').length;
    console.log('Length of en_caption inner text:', enCaptionLength);

    // Check for .ytp-rollup-mode in the caption container
    if (container.classList.contains('ytp-rollup-mode')) {
      var cpContentElement = document.getElementById('cp_content');
      timeId = setTimeout(quitAgain, 50)

      function quitAgain() {
        var cpContentElement = document.getElementById('cp_content');
        var pt2Element = document.getElementById('pt_2');
        if (cpContentElement && pt2Element) {
          // Add fade-out animation
          cpContentElement.classList.add('fade-out');
          pt2Element.classList.add('fade-out');

          // Clear content and reset after animation
          setTimeout(() => {
            pt2Element.textContent = '';
            spokenWords = [];
            cpContentElement.textContent = '';
            cpContentElement.classList.remove('fade-out');
            pt2Element.classList.remove('fade-out');
          }, 500); // 500ms matches the animation duration
        }
        // Clear the timeout if it's set
        if (timeId) {
          clearTimeout(timeId);
          timeId = null;
        }
      }
    }
  }
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
function getCaptionHistory() {
  return captionHistory;
}

function getFullTranscript() {
  return captionHistory.join(' ');
}

observeCaptions(); 
