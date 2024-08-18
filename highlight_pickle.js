 cpContent.innerHTML = ''
 off()
 var captionControl2Parent = document.getElementById('ytd-player').parentElement;

 var cpElement = captionControl2Parent.querySelector("#cp");
 if (!cpElement) {
   var cpDiv = document.createElement("div");
   cpDiv.id = "cp";

   var cpContent = document.createElement("span");
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
         enLong = latestText.split(' ').length
         if (enLong != 0) {
           for (var j = 0; j < latestText.split(' ').length; j++) {
             firstPart.push(`<span class='pickle'>${latestText.split(' ')[j]}</span>`)
           }
         }
         firstPart = firstPart.join(' ')
         var ctext = document.querySelector('#en_caption')?.textContent.split(' ') || 'Element not found';

         var wrappedText = [];
         remaining = ctext.length
         if (remaining != 0) {
           for (var j = latestText.split(' ').length; j < remaining; j++) {
             wrappedText.push(`<span class="onion">${ctext[j]}</span>`);
           }
         }
         remaining--;
         wrappedText = wrappedText.join(' ');
         // Log the inner text of the last child


         let fp = document.createElement('span')
         fp.classList.add('pickle')
         fp.innerHTML = latestText.split(' ')[latestText.split(' ').length - 1]

         let lp = document.createElement('span');
         lp.classList.add('onion')
         lp.innerHTML = wrappedText



         cpContent.appendChild(fp)
         document.querySelectorAll('.onion').forEach(element => element.remove());
         cp.appendChild(lp)


         isRoll = document.querySelector('#caption-window-1').classList.contains('ytp-rollup-mode')
         cpContentHeight = cpContent.clientHeight
         if (isRoll) {

           //           isRoll = false
           getPickle = cpContent.querySelectorAll('.pickle').length
           cpContent.querySelectorAll('.pickle').forEach((itm, i) => {
             itm.classList.add('salt')
             if (i < getPickle - 4) {
               itm.remove()
             }
           })

           var spanBan = cpContent.querySelectorAll('span');

           // Loop through each span
           spanBan.forEach(function(span) {
             // Check if the span is empty or contains only whitespace
             if (!span.textContent.trim()) {
               // Remove the empty span
               span.remove();
             }
           });

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
