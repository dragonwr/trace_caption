cpContent.innerHTML = ''
off()
var captionControl2Parent = document.getElementById('ytd-player').parentElement;

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
captionsContainer = document.querySelector('.captions-text');

// Configuration for the observer (which mutations to observe)
var observerConfig = {
  childList: true,
  subtree: true,
  characterData: true
};

// Callback function to execute when mutations are observed
var mutationCallback = function(mutationsList) {
  var hr = false;
  for (var i = 0; i < mutationsList.length; i++) {
    var mutation = mutationsList[i];
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      // Get all child elements within the .captions-text container
      captionLines = captionsContainer.children;
      isRoll = document.querySelector('#caption-window-1').classList.contains('ytp-rollup-mode')
      if (!hr) {
        hr = true
        // Get the last child element
        if (!isRoll) {
          lastCaptionLine = captionLines[captionLines.length - 1];

        }
        if (isRoll) {
          ifRoll = false
          lastCaptionLine = captionLines[captionLines.length - 1];

        }
        // Get the text content of the last caption line
        var latestText = lastCaptionLine.innerText || lastCaptionLine.textContent;
        var firstPart = []
        for (var j = 0; j < latestText.split(' ').length; j++) {
          firstPart.push(`<span class='pickle'>${latestText.split(' ')[j]}</span>`)
        }
        firstPart = firstPart.join(' ')
        var ctext = document.querySelector('#en_caption')?.textContent.split(' ') || 'Element not found';

        var wrappedText = [];
        remaining = ctext.length
        for (var j = latestText.split(' ').length; j < remaining; j++) {
          wrappedText.push(`<span class="onion">${ctext[j]}</span>`);
        }
        remaining--;
        wrappedText = wrappedText.join(' ');
        // Log the inner text of the last child

        let lp = document.createElement('span');
        lp.innerHTML = wrappedText

        let fp = document.createElement('span')
        fp.classList.add('pickle')
        fp.innerHTML = latestText.split(' ')[latestText.split(' ').length - 1]

        cpContent.appendChild(fp)
        document.querySelectorAll('.onion').forEach(element => element.remove());
        cpContent.appendChild(lp)
        isRoll = document.querySelector('#caption-window-1').classList.contains('ytp-rollup-mode')
        if (isRoll) {
          getPickle = cpContent.querySelectorAll('.pickle').length
          cpContent.querySelectorAll('.pickle').forEach((itm, i) => {
            if (i < (getPickle)) {
              itm.remove()
            }
          })
          cpContent.querySelectorAll('.onion').forEach((itm, i) => {
            itm.remove()

          })
        }
      }
    }
  }
};

// Create an instance of MutationObserver
var observer = new MutationObserver(mutationCallback);

// Start observing the container node for configured mutations
observer.observe(captionsContainer, observerConfig);

// Function to stop the observer (optional)
function off() {
  observer.disconnect();
  console.log('MutationObserver has been stopped.');
}
