(function($){

  $(document).ready(function(){
    slickSlider()
    heroSliderText('.hero-slider-text', '.hero-slider');
    racePageSlider();
    mobileSliderText();
    wrapHeroSlider();
    removeHeroSliderCompression();
  
  });

    let slickSlider = function(){
      let slider = $('.user_mode .full-width.hero-slider:not(.hero-video) .column');
      let slides = $('.user_mode .full-width.hero-slider:not(hero-video) .column .slick-slider .slick-slide');
      slider.slick(getSliderSettings());
      slides.each(function(){
        $(this).find('.pageElement').removeClass('pageElement');
      })
    }
  
     let getSliderSettings = function(){
      return {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          variableWidth:false,
          speed:300,
          autoplay: true,
          arrows: true,
          draggable:false,
          lazyLoad:'progressive',
          pauseOnHover:false,
          pauseOnDotsHover:true,
       }
    };


    let heroSliderText = function(element, target){
      if($('body').hasClass('user_mode')){
        element = $(element).find('.pageElement').removeClass('pageElement').addClass('heroSlidetext');
        $(target).append(element);
      }
    }

    let racePageSlider = function(){
      let date = $('body:not(.custom-search-page) .heroSlidetext .text p');
      date.each(function(){
        dateText = $(this).html().replace(/&nbsp;/g, ' ');
        if(dateText !== ' '){
          $(this).addClass('raceDate').css('display', 'none');
        }
      });
      let raceDate = $('.raceDate').text();
      let target = $('.user_mode .hero-slider');
      let videoTarget = $('.user_mode .hero-video');
      let markup = $(`<span class='race-date-container'>${raceDate}</span>`);
      if(target.length){
        target.append(markup);
      }
      if (videoTarget.length){
        videoTarget.append(markup);
      }
      

    }

    let mobileSliderText = function(){
      let sponsor = $('body:not(.custom-search-page) .heroSlidetext h3 span');
      let presented = $('body:not(.custom-search-page) .heroSlidetext .text h3');

      if(sponsor.text() !== '' && presented.text() !== '' ){
        sponsor = sponsor.text();
        presented = presented.text();
        let markup = $(`<div class='race-sponsors'><p class='race-sponsor-text'>${sponsor}</p><p class='race-presented-text'>${presented}</p></div>`);
        let target = $('.race-band .languageDropdown');
        target.after(markup);
      }
    }

    let wrapHeroSlider = function(){
      let heroSlider = $('.hero-slider');
      let content = heroSlider.nextUntil('.layoutContainer').andSelf();
      let wrapper = $(`<div class='race-page-top'></div>`);
      let pageContent = $('#panelTwo');
      let userMode = $('body.user_mode');
      
      if(userMode.length){
        pageContent.before(wrapper);
        wrapper.append(content);
      }
    
    }
  let imgSrcReplace = function imgSrcReplace(target, string, replacement) {
      $(target).each(function () {
        var img = $(this);
        var imgSrc = img.attr("src");
        var newSrc = imgSrc.replace(string, replacement);
        img.attr("src", newSrc);
      });
    };

    let removeHeroSliderCompression = function(){
      let heroSlideImg = $('.hero-slider .slick-slide .pageElement img');
      if (heroSlideImg.length){
        imgSrcReplace(heroSlideImg, '_large.', '.');
      }
    }

}(jQuery));

