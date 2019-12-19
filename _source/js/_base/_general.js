(function($){
  /* make textBlockElement liquid remove this */
  var wrapTextBlockTables = function(){
    $('.textBlockElement .text > table').each(function(){
      $(this).wrap('<div class="tableWrapper"></div>');
    });
  };

  var imgRatio = function imgRatio() {
    var cutCard = $('.user_mode .corner-cut-card');
    if (cutCard.length) {
      cutCard.each(function(){
        var $container = $(this),
        imgUrl = $container.find('img').prop('src');
        
        if (imgUrl) {
          $container
          .css('backgroundImage', 'url(' + imgUrl + ')')
          .addClass('corner-cut-background');
        }
      });
    }
    var becomeCard = $('.user_mode .become-card');
    if (becomeCard.length) {
      becomeCard.each(function(){
        var $container = $(this),
        imgUrl = $container.find('img').prop('src');
        
        if (imgUrl) {
          $container
          .css('backgroundImage', 'url(' + imgUrl + ')')
          .addClass('become-background');
        }
      });
    }
  }

  var promoContainers = function promoContainers(){
    var promoContainer = $('.user_mode .promotions-container');
    promoContainer.clone().removeClass('promotions-container').addClass('mobile-promotions').insertBefore(promoContainer);
    promoContainer.removeClass('promotions-container').addClass('desktop-promotions');
    
    var promoCard = $('.mobile-promotions .column-2 .promotions-card');
    promoCard.appendTo('.mobile-promotions .column-1');
  };

  var slickSlider = function slickSlider() {
    $('.user_mode .become-section .column-1 .become-card').wrapAll('<div class="card-container" />');
      $(window).on('load resize orientationchange', function() {
        var slickContainer = $('.user_mode .become-section .column-1 .card-container');
          if(slickContainer.length){
              /* Initializes a slick carousel only on mobile screens */
              // slick on mobile
              if ($(window).width() > 767) {
                  if (slickContainer.hasClass('slick-initialized')) {
                      slickContainer.slick('unslick');
                  }
              } else {
                  if (!slickContainer.hasClass('slick-initialized')) {
                      slickContainer.slick({
                          dots: true,
                          infinite: true,
                          speed: 500,
                          autoplay: true,
                          slidesToShow: 1,
                          slidesToScroll: 1,
                          mobileFirst: true
                      });
                  }
              }
          }

        var spotlightContainer = $('.user_mode .spotlight-container .column-1');
          if(spotlightContainer.length){
            /* Initializes a slick carousel only on mobile screens */
            // slick on mobile
            if ($(window).width() > 767) {
                if (spotlightContainer.hasClass('slick-initialized')) {
                    spotlightContainer.slick('unslick');
                }
            } else {
                if (!spotlightContainer.hasClass('slick-initialized')) {
                    spotlightContainer.slick({
                        dots: true,
                        infinite: true,
                        speed: 500,
                        autoplay: true,
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        mobileFirst: true
                    });
                }
            }
        }


      var promotionsContainer = $('.user_mode .mobile-promotions .column-1');
        if(promotionsContainer.length){
          /* Initializes a slick carousel only on mobile screens */
          // slick on mobile
          if ($(window).width() > 767) {
              if (promotionsContainer.hasClass('slick-initialized')) {
                promotionsContainer.slick('unslick');
              }
          } else {
              if (!promotionsContainer.hasClass('slick-initialized')) {
                promotionsContainer.slick({
                      dots: true,
                      infinite: true,
                      speed: 500,
                      autoplay: true,
                      slidesToShow: 1,
                      slidesToScroll: 1,
                      mobileFirst: true
                  });
              }
          }
      }
    });
  };

  var customBackground = function customBackground(){
    var userBackground = $(".user_mode .custom-background .custom-background-image img");
    userBackground.each(function(){
      var imgSrc = $(this).attr('src');
      var parentContainer = $(this).closest('.custom-background');
      parentContainer.css("background-image", "url(" + imgSrc + ")");
    });
    imgBgImgReplace(".user_mode .custom-background", "_large.", ".");
  }

  var imgBgImgReplace = function(target, string, replacement) {
    $(target).each(function() {
      var img = $(this);
      var imgSrc = img.css("background-image");
      var newSrc = imgSrc.replace(string, replacement);
      img.css("background-image", newSrc);
    });
  };

  var imgSrcReplace = function imgSrcReplace(target, string, replacement) {
    $(target).each(function () {
      var img = $(this);
      var imgSrc = img.attr("src");
      var newSrc = imgSrc.replace(string, replacement);
      img.attr("src", newSrc);
    });
  };

  var newsAggImage = function newsAggImage() {
    var newsImage = $(".user_mode .newsAggregatorElement .item a img, .user_mode .collectorElement .item a img");
    if (newsImage.length) {
      imgSrcReplace(newsImage, "_thumb.", "_large.");
    }
  };

  var refactorCustomNewsAgg = function refactorCustomNewsAgg() {
   var newsAgg = $(".custom-card-agg .item, .custom-list-agg .item, .newsAggregatorElement .item, .collectorElement .item");
   newsAgg.each(function() {
      var author = $(this).find('.newsAuthor');
      if (author.length) {
        var authorText = author.html().replace('By', '');
        author.html(authorText);
      }
      var title = $(this).find('h4');
      author.insertBefore(title);
    });
    var expandedAgg = $('.newsAggregatorElement .item .newsItemElement');
    expandedAgg.each(function(){
      var author = $(this).find('.newsAuthor');
      var title = $(this).find('.newsItemHeader h2');
      author.insertBefore(title);
    });
  }

  var eventCardWrapper = function eventCardWrapper() {
    var eventColumn = $('.user_mode .coverage-container .column');
    if (eventColumn.length) {
      eventColumn.wrapAll('<div class="event-wrapper"/>');
    }
  }

  let newsPage  = function(){
    let newsPage = $('.user_mode.newsPage');
    let thumb = $('.newsArticleThumbnail');
    let newsColumn = $('.newsItemColumn').clone(true, true);
    if(newsPage.length){
      if(thumb.length){
        imgSrcReplace(thumb, '_thumb.', '.');
        thumb.show();
      }
    }
  }
  let squareCard = function(){
    let card = $('.user_mode .square-card .pageElement.textBlockElement .text');

      card.each(function(){
        let link = $(this).parent().find('.leftTextImage.originalTextImage > a');
        let href = link.attr('href');
        let h3 = $(this).parent().find('h3 span').text();
        let target;
        if(target === undefined){
          target = ''
        }
        else {
         target = link.attr('target');
        }

        let img = $(this).find('img');
        let src = img.attr('src');

        let text = $(this).find('h3');

        let container = $(`<div class='textTop'></div><div class='textBottom'><a class='sq-card-link'href=${href} target=${target}>Find a Race</a></div>`);
        $(this).append(container);
        let textTop = $(this).find('.textTop');
        textTop.append(img);
        if(text.length){
          textTop.append(text);
        }
        if(h3.length){
          let customLink = $(this).find('.textBottom .sq-card-link');
          customLink.text(h3);
        }
      });
  }

  let faceBookWatch = function(){
    let bg = $('.user_mode .facebook-watch-container .facebook-watch-background');
    bg.each(function(){
      let col = $(this).parent();
      col.addClass('facebook-watch-col-1');
      var imgSrc = $(this).find('.pageElement img').attr('src');
     col.css("background-image", "url(" + imgSrc + ")");
    });
  }

  let newsPageBottomOptions = function(){
    let newsPage = $('.user_mode.newsPage');
    let bottomOpts = $('.user_mode.newsPage .bottomOptions');
    let newsTags = $('.user_mode.newsPage .newsTags');
    let target = $('.user_mode.newsPage .newsContentNode .layoutContainer').last().find('.column-1');
    if(newsPage.length && bottomOpts.length && newsTags.length){
      console.log('newPAge')
      // newsTags.parent().prev('.layoutContainer').append(newsTags, bottomOpts);
      newsTags.parent().addClass('bottomNewsOptions');
      let bottomOptions = $('.column.col-sm-12.bottomNewsOptions');
      target.append(bottomOptions);

    }
  }

  $(function(){
    $('.spotlight-card, .corner-cut-card, .promotions-card, .become-card').click(function() {
      window.location = $(this).find('a').attr('href');
      return false;
    });
    /* Network Bar Select Option */
    $('#network_sites').change(function(){
      window.location = $(this).val();
    });
    /* Touch detection */
    if (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)){
      $('body').addClass('touch-screen');
    }
    var origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            // Use console.log(this); to see the XMLHttpRequest at various stages in the console
            //check for readystate 4 which is 200
            if (this.readyState == 4) {
              // after XMLHttpRequest is 4 check for string in URL
              // look for string /game/edit/ using regex
              // a good regex resource https://www.regexr.com/
              if ( this.responseURL.match(/\/news_article\/build_news_selection\//g) ) {
                //define loop to check for elements on page
                function loop() {
                  if ( $('.collectorElement').length < 1) {
                    // check for element length console.log( 'first condition ' + $('.collectorElement').length );
                    // setTimeout timer set to 0 runs when the current stack is cleared
                    setTimeout( function() {
                      // check again for element length console.log( 'timeout condition ' + $('.collectorElement').length );
                      loop();
                    }, 0);
                  } else {
                    // if we get here element is on the page and greater than 1
                    imgSrcReplace('.collectorElement .item a img' , "_thumb.", "_large.");
                  }
                }
                //start loop function
                loop();
              }
            } 
        });
        origOpen.apply(this, arguments);
    };
  });
  $(document).ready(function(){
    wrapTextBlockTables();
    imgRatio();
    promoContainers();
    slickSlider();
    newsAggImage();
    refactorCustomNewsAgg();
    customBackground();
    eventCardWrapper();
    newsPage();
    newsPageBottomOptions();
    squareCard();
    // faceBookWatch();
  });
  $(document).on('instantiated.tab', function(){
    wrapTextBlockTables();
  });
}(jQuery));
