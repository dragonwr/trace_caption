// off()
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

       if (!hr) {
         hr = true
         // Get the last child element
         lastCaptionLine = captionLines[captionLines.length - 1];

         // Get the text content of the last caption line
         var latestText = lastCaptionLine.innerText || lastCaptionLine.textContent;
         var firstPart = []
         for (var j = 0; j < latestText.split(' ').length; j++) {
           firstPart.push(`<span class='pickle'>${latestText.split(' ')[j]}</span>`)
         }
         firstPart = firstPart.join(' ')
         var ctext = document.querySelector('#en_caption')?.textContent.split(' ') || 'Element not found';

         var wrappedText = [];
         for (var j = latestText.split(' ').length; j < ctext.length; j++) {
           wrappedText.push(`<span class="onion">${ctext[j]}</span>`);
         }
         wrappedText = wrappedText.join(' ');
         // Log the inner text of the last child
         console.log(firstPart, `  ${wrappedText}  `);

         cpContent.innerHTML = ''
         cpContent.innerHTML = firstPart + wrappedText

         //         end
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
