// off()
cpContent = document.getElementById('cp_content');
var clearCaptionContent = function() {
  cp_content.innerHTML = '';
}

var off = function() {
  observer.disconnect();
  console.log('MutationObserver has been stopped.');
}

var initializeCaptionElement = function() {
  captionControlParent = document.getElementById('ytd-player').parentElement;
  existingCaptionElement = captionControlParent.querySelector("#cp");

  if (!existingCaptionElement) {
    captionDiv = document.createElement("div");
    captionDiv.id = "cp";

    captionContentSpan = document.createElement("span");
    captionContentSpan.id = "cp_content";
    captionDiv.appendChild(captionContentSpan);
    captionControlParent.insertAdjacentElement('afterbegin', captionDiv);
  }
}

var captionsContainer = document.querySelector('.captions-text');

var observerConfig = {
  childList: true,
  subtree: true,
  characterData: true
};

var handleCaptionMutation = function(mutationsList) {
  var hasProcessed = false;
  for (var i = 0; i < mutationsList.length; i++) {
    var mutation = mutationsList[i];
    if (mutation.type === 'childList' || mutation.type === 'characterData') {
      if (!hasProcessed) {
        processCaptionChange();
        hasProcessed = true;
      }
    }
  }
};

var processCaptionChange = function() {
  var captionLines = captionsContainer.children;
  var isRollupMode = document.querySelector('#caption-window-1').classList.contains('ytp-rollup-mode');
  var lastCaptionLine = isRollupMode ? captionLines[captionLines.length - 1] : captionLines[captionLines.length - 1];
  var latestText = lastCaptionLine.innerText || lastCaptionLine.textContent;

  updateCaptionDisplay(latestText, isRollupMode);
};

var updateCaptionDisplay = function(latestText, isRollupMode) {
  var wrappedCurrentWords = wrapWordsInSpan(latestText.split(' '), 'pickle');
  var existingCaptionText = document.querySelector('#en_caption')?.textContent.split(' ') || [];

  var wrappedText = [];
  remaining = existingCaptionText.length;
  if (remaining != 0) {
    wrappedText = existingCaptionText.slice(latestText.split(' ').length, remaining)
      .map(text => `<span class="onion">${text}</span>`);
  }

  wrappedText = wrappedText.join(' ');

  //   var wrappedText = [];
  //   remaining = existingCaptionText.length
  //   if (remaining != 0) {
  //     for (var j = latestText.split(' ').length; j < remaining; j++) {
  //       wrappedText.push(`<span class="onion">${existingCaptionText[j]}</span>`);
  //     }
  //   }
  //   remaining--;
  //   wrappedText = wrappedText.join(' ');

  var tempDiv = document.createElement('span');
  tempDiv.innerHTML = wrappedCurrentWords


  var remained = document.createElement('span')
  remained.innerHTML = wrappedText

  cpContent.append(tempDiv.firstChild)
  document.querySelectorAll('.onion').forEach(element => element.remove());
  cpContent.append(remained)


  if (isRollupMode) {
    trimOldCaptions(cpContent);
  }
};

var wrapWordsInSpan = function(words, className) {
  return '<span class="' + className + '">' + words[words.length - 1] + '</span>'
};

var trimOldCaptions = function(cpContent) {
  var pickleElements = cpContent.querySelectorAll('.pickle');
  var pickleCount = pickleElements.length;

  pickleElements.forEach((element, index) => {
    if (index < pickleCount - 3) {
      element.remove();
    }
  });

  removeEmptySpans(cpContent);
};

var removeEmptySpans = function(container) {
  var spans = container.querySelectorAll('span');
  spans.forEach(function(span) {
    if (!span.textContent.trim()) {
      span.remove();
    }
  });
};

var observer = new MutationObserver(handleCaptionMutation);

clearCaptionContent();
initializeCaptionElement();
observer.observe(captionsContainer, observerConfig);
