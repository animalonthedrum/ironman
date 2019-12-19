(function ($) {
  $(document).on('ready', function () {
    buildLeftSubNav();
  }).on('has-global-footer', function(){
    defaultBanner();
    buildSubNav();
  })
  let buildLeftSubNav = function () {
    let body = $('body');
    let currPage = FUI.navData.name;
    let parentPage = FUI.navData.parent.name
    let parentLink = FUI.navData.parent.url;
    let leftSubNavData = FUI.navData.children;
    let header = $(`<h3>` + currPage + `</h3>`);
    let courseHeader = $(`<h3 class='parentPage'><a href=`+parentLink+`>` + parentPage + `</a></h3>`);
    let target = $('.left-sub-nav');
    var container = $(`<div class='leftNav'></div>`);

    if (target.length) {
      target.prepend(container);
      if (leftSubNavData.length) {
        leftSubNavData.forEach(function (pages) {
          let subNavMarkup = $(`<a href=` + pages.url + ` id=` + pages.id + ` class=` + pages.display_status + `>` + pages.name + `</a>`);
          container.append(subNavMarkup);
        });
        if(body.hasClass('user_mode')){
          $('.theme-sub-nav').remove();
          $('html').removeClass('has-sub-nav');
        }
        container.prepend(header);
      }
      else {
        let courseSubNav = FUI.navData.siblings;
        if(courseSubNav.length){
          courseSubNav.forEach(function(pages){
            let courseNavMarkup = $(`<a href=` + pages.url + ` id=` + pages.id + ` class='` + pages.display_status + ' ' + pages.selected +`'>` + pages.name + `</a>`);
            container.append(courseNavMarkup);
          });
          if(body.hasClass('user_mode')){
            $('.theme-sub-nav').remove();
            $('html').removeClass('has-sub-nav');
          }
          container.prepend(courseHeader);
        }
      }
    }
  
  }
  let defaultBanner = function(){
    const newsPage = $('body.newsPage');
    const userMode = $('body.user_mode');
    const slider = $('.hero-slider');
    const home = $('body.home');
    const pageTitle = $('#displayBodyHeader');
    const siteWrapper = $('.site-banner-wrapper');
    const titleImage = $('.displayBodyHeader-image');
    
    let defaultImage = SBC.globalData.assets.find('.default-page-banner-image .pageElement img').attr('src');

    if (userMode.length && newsPage.length <= 0 && slider.length <= 0 && home.length <= 0 && pageTitle.length){
      if(titleImage.length){
       //don't add default
      }
      else {
        pageTitle.addClass('public displayBodyHeader-image');
        pageTitle.css('background-image', 'url('+defaultImage+')');
      }
    }
    if(pageTitle.length){
      userMode.addClass('header_image');
    }
    if(siteWrapper.length){
      userMode.addClass('header_image');
    }
  }

let buildSubNav = function(){
  let subNav = $('.user_mode .theme-sub-nav');
  subNav.clone(true, true);
    let target = $('.user_mode .displayBodyHeader-image');
    let header = $('.site-banner-wrapper')
    if(target.length){
      target.append(subNav);
    }
    else if (header.length){
      header.append(subNav);
    }
}


})(jQuery);
