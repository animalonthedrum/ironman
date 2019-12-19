 (function () {

   // Check if the DOM is loaded
   let domLoaded = function () {
     checkForTitle();
   };

   if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
     domLoaded();
   } else {
     document.addEventListener("DOMContentLoaded", domLoaded);
   }

   //Functions
   function checkForTitle() {
     let displayBodyHeaderText = document.querySelector('#displayBodyHeader span');
     let siteBannerText = document.querySelector('#siteHeader .site-banner-wrapper .site-banner-text-wrapper h1');

     if (document.getElementById('displayBodyHeader')) {
       getThenInsertTitle(displayBodyHeaderText);
     } else if (document.getElementById('siteHeader')) {
       getThenInsertTitle(siteBannerText);
     }
   }

   function getThenInsertTitle(titleText) {
     //Create new element
     let verticalLabelContainer = document.createElement('div');
     verticalLabelContainer.classList.add('vertical-title-label');
     //Set markup
     verticalLabelContainer.innerHTML = '<span class="before-dashed-red"></span><span class="vertical-title-text">' + titleText.textContent + '</span>';
     //Grab element to append to
     if (document.getElementById('displayBodyHeader')) {
       let appendTo = document.querySelector('#displayBodyHeader');
       appendTo.parentNode.insertBefore(verticalLabelContainer, appendTo.nextSibling);
     } else if (document.getElementById('siteHeader')) {
       let appendTo = document.querySelector('#siteHeader .site-banner-wrapper');
       appendTo.parentNode.insertBefore(verticalLabelContainer, appendTo.nextSibling);
     }
   }


 })(window);
