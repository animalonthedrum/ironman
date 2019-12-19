(function($, global) {
  let navAjax;

    $(document).on('_navigation_service:_setup', function(){
       getNavItems();
       removeTopNav();
       promotionsPage();
       
  
      }).on('nav:has-main-nav', function(){
        removeTopNav();
      }).on('has-global-footer', function(){
          addTopToSubNav();
            // 
            buildFooterExtra(SBC.globalData.assets);
            if($('.nav-extra-links li').length <= 0){
              buildNavExtra( SBC.globalData.assets);
            }
        }).one('has-global-nav ready', function(){
         if(navAjax !== undefined && navAjax.length > 2){
          buildFooter(navAjax[0].outerHTML); 
          if(SBC.state.assetsReady && $('.mega-menu-open-extra').length <= 0 && $('.nav-extra-links li').length <= 0){
            buildNavExtra( SBC.globalData.assets);
            buildFooterExtra(SBC.globalData.assets);
          }
         }
        })
   

let removeTopNav = function(){
    let topNav = $('.topNav');
    if(SBC.state.userMode === true){
        topNav.hide();
    }
}
let getNavItems = function(){

    let url = window.location.origin+'/navigation/site_dropdown_nav';
    $.ajax({
        type: "GET",
        url: url,
        dataType: "html",
        success: function (data) {
          nav = $(data);
          navAjax = nav;
          buildNav(nav);
          topNavNode();
          $(document).trigger('has-global-nav');
        },
        error: function () {
          alert("NavData could not be retrieved.");
        }
      }).done(function(){
        // $(document).trigger('has-global-nav');
      });
}

let buildNav = function(data){
    const body = $('body');
    const searchbar = $('.theme-search-wrapper');
    let target = $('.user_mode #topNavPlaceholder');
    let desktopNavContainer = $(`<div data-value='desktop-nav' class='desktop-navigation'></div>`);
    let navWrap = $(`<div class='desktop-nav-container'></div>`);
    let navList = $(`<div class='nav-list'></div>`);
    let logoContainer = $(`<div class='desktop-nav-logo-container'></div>`);
    let navListExtra = $(`<div class='nav-list-extra'></div>`);
    let menuButton = $(`<button class='mega-menu-button' type='button'></button>`);
    let logoLink = $(`<a class='desktop-nav-logo' href='`+window.location.origin+`'></a>`);
    let logo = $(`<svg viewBox="0 0 1731.781 431.631" xmlns="http://www.w3.org/2000/svg"><path class='IMTEXT' d="M102.622 431.313H0V167.249h102.555zM242.207 258.69c-5.964 3.378-13.541 2.905-18.722 3.095v-36.72l12.457.68s6.21 3.789 6.265 3.832c10.453 9.686 2.422 27.733 0 29.113m107.429 58.557a41.6 41.6 0 0 0-9.012-14.535c-7.988-8.325-14.903-10.385-19.752-14.56 10.747-6.222 17.68-8.484 25.325-23.222 8.754-16.962 8.325-40.362 5.18-58.587-2.005-11.5-9.368-22.707-17.337-30.854l-5.186-4.132-8.325-3.12-11.06-.987H119.595l-.11 264.064h104.283c-.073-35.286 0-109.028 0-109.273 0 .122 10.146-.086 11.145.061 16.65 2.79 12.886 24.662 12.819 40.564-.104 18.373.055 68.648.03 68.648h103.64c.074 0-.257-61.616-.257-66.9-.025-15.51 3.758-32.577-1.508-47.167M496.398 357.619c0 8.545-7.46 15.491-16.656 15.491-9.202 0-16.638-6.946-16.638-15.491V239.634c0-8.6 7.436-15.546 16.638-15.546 9.195 0 16.656 6.945 16.656 15.546zm30.504-190.372h-87.614c-59.784-1.281-73.84 31.087-73.84 66.76v133.586c-1.233 42.085 27.224 64.534 73.84 63.719h87.614c61.237.815 73.816-28.004 73.816-63.72V234.007c0-35.672-14.646-68.04-73.816-66.759M750.368 167.247v71.216l-3.679-.496-27.561-70.72H615.696l-.128 264.065h96.785l.037-96.161h3.642l34.716 96.161h97.987l-.134-264.065zM1582.682 167.247l.061 79.198-32.656-79.198h-100.954l-.81 264.065h96.566l-.129-101.176h3.157l38.229 101.176h94.818l.006-264.065zM1302.25 310.28l6.964-66.097h3.63l7.215 66.097zm31.921 120.97h106.061l-46.805-264.003h-167.028l-43.004 264.003h108.127l5.8-62.682h28.095zM1693.565 409.985a16.66 16.66 0 1 1 16.68 16.736 16.725 16.725 0 0 1-16.68-16.736m-4.898 0a21.558 21.558 0 1 0 21.579-21.72 21.625 21.625 0 0 0-21.58 21.72"/><path class='IMREG' d="M1705.764 422.622v-10.795h.957a6.458 6.458 0 0 1 2.298.288 3.32 3.32 0 0 1 1.38 1.091c.417.503 1.214 1.754 2.477 3.783l3.316 5.633h5.511l-2.813-5.008a33.366 33.366 0 0 0-2.637-4.254 11.1 11.1 0 0 0-2.476-2.158 6.93 6.93 0 0 0 4.469-2.324 7.348 7.348 0 0 0 1.532-4.867 7.653 7.653 0 0 0-1.018-4.09 5.888 5.888 0 0 0-2.61-2.433 14.713 14.713 0 0 0-5.267-.693h-9.655v25.827zm0-21.456h3.611a18.116 18.116 0 0 1 3.715.184 2.675 2.675 0 0 1 1.435 1.036 3.266 3.266 0 0 1 .496 1.98 3.695 3.695 0 0 1-.496 2.078 2.476 2.476 0 0 1-1.398 1.006 19.103 19.103 0 0 1-3.936.251h-3.427z"/><path d="M943.006 75.575c0-41.73 34.398-75.575 77.25-75.575 42.66 0 77.303 33.846 77.303 75.575 0 41.833-34.643 75.765-77.304 75.765-42.851 0-77.249-33.932-77.249-75.765M992.769 431.313l-35.697-98.171-.006 98.171h-93.378l-.349-264.064h312.482l.356 264.064h-92.685l-.019-98.244-33.912 98.244z" fill="#e31837"/></svg>`);
    let menuSvg = $(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 23"><style>.st0{fill:#e51937}</style><path class="st0" d="M0 0h40v2H0z" id="Top"/><path class="st0" d="M0 10.5h40v2H0z" id="Middle"/><path class="st0" d="M0 21h40v2H0z" id="Bottom"/></svg>`);
    let megaMenu = $(`<div class='mega-menu-container'></div>`);
    let navExtraLinkContainer = $(`<ul class='nav-extra-links'></ul>`);


    logoLink.append(logo);
    logoContainer.append(logoLink);
    target.after(desktopNavContainer);
    desktopNavContainer.wrap(navWrap);
    let mainNav = desktopNavContainer.parent();
    mainNav.append(megaMenu);

    let findNodes = data.find('li.enabled a');
    findNodes.each(function(){
        let href = $(this).attr('href');
        if(href === '/assets'){
            $(this).parent().addClass('assetsPage');
        }
        if(href === '/promotions'){
          $(this).parent().addClass('promotionsPage');
        }
        if(href === '/races'){
            $(this).parent().addClass('active defaultMegaNav');
        }
        $(this).parent().find('.dropdown:first-of-type').addClass('secondLevel');
        $(this).parent().find('.dropdown:first-of-type').find('li.hasChild ul:first-of-type').addClass('thirdLevel');
    });

  
    searchbar.remove();
    navList.append(data);
    navList.find('> ul').addClass('topLevel');
    desktopNavContainer.append(logoContainer, navList, navListExtra );
    navListExtra.append(navExtraLinkContainer, menuButton);
    menuButton.append(menuSvg);
    let megaNavList = navList.clone(true, true).addClass('mega-menu-main-nav');
    megaMenu.append(megaNavList);

    //BEFORE DEBOUNCE
    // $(window).scroll(function() {
    //   console.log('test')
    //     let navWrapClass = $('.desktop-nav-container');
    //     var scroll = $(window).scrollTop();
    //     if (scroll >= 60)  { 
    //     navWrapClass.addClass('sticky');
    //    } 
    //    if (scroll <= 60)  { 
    //     navWrapClass.removeClass('sticky');
    //    } 
    // });
    let navWrapClass = $('.desktop-nav-container');
    $(window).on('scroll', _.debounce(function() {
      var iCurScrollPos = $(this).scrollTop();
      if (iCurScrollPos >= 50) {
        navWrapClass.addClass('sticky');
      }
      if (iCurScrollPos <= 50)  { 
        navWrapClass.removeClass('sticky');
       }  
    }, 30));

    menuButton.on('click', function(){
        mainNav.toggleClass('mega-menu-open');
        megaMenu.toggleClass('open');
        body.toggleClass('desktop-menu-open');
        let openDefault = $('.defaultMegaNav');
        megaMouse();
        openDefault.removeClass('active');
          openDefault.addClass('active');
    }); 
   let private = $('.user_mode .topLevel .private');
   private.remove();
}

let buildNavExtra = function(data){
  let target = $('.nav-list.mega-menu-main-nav');
  let menuOpenTarget = $('.mega-menu-container .nav-list .topLevel');
  let megaMenuExtraContainer = $(`<div class='mega-menu-open-extra'></div>`);
  let megaMenuExtra = data.find('.mega-menu-extra');
  let title = megaMenuExtra.find('.mega-menu-extra-title .pageElement h3');
  let titleText = megaMenuExtra.find('.mega-menu-extra-title .pageElement .text');
  let link = megaMenuExtra.find('.mega-menu-extra-link .pageElement');
  let connectTitle = megaMenuExtra.find('.mega-menu-extra-connect-title .pageElement h3');
  let connectIcons = megaMenuExtra.find('.sn-social-media-list').removeClass('pageElement');
  let navExtraLinkContainer = $('.nav-extra-links');
  let navExtraPages = data.find('.nav-extra .desktop-nav-extra-links .pageElement .text li a');
  navExtraPages.each(function(){
    let title = $(this).text();
    let link = $(this).attr('href');
    let targetAttr = $(this).attr('target');
    let markup = $(`<li><a target=${targetAttr} href=${link}>${title}</a><li>`);
    let openMarkup = markup.clone(true, true);
      navExtraLinkContainer.append(markup);
      menuOpenTarget.append(openMarkup);

  });

    megaMenuExtraContainer.append(title, titleText, link, connectTitle, connectIcons);
    target.after(megaMenuExtraContainer);
}

let megaMouse = function(){
  let megaNavItems = $('.mega-menu-main-nav > ul > li')
  megaNavItems.hover(function(){
    $(this).removeClass('active');
  });
}

let buildFooter = function(data){
  data = $(data);
  const footer = $('.snFooterContainer');
  const target = $(`<div class='custom-footer'></div>`);
  footer.prepend(target);
  let footerNav = $(`<div class='footer-nav-items'></div>`);
  let footerLeft= $(`<div class='footer-left'></div>`);
  let footerLogo = $(`<div class='footer-nav-logo'></div>`);
  let logoLink = $(`<a class='footer-logo' href='`+window.location.origin+`'></a>`);
  let logo = $(`<svg viewBox="0 0 1731.781 431.631" xmlns="http://www.w3.org/2000/svg"><path class='IMTEXT' d="M102.622 431.313H0V167.249h102.555zM242.207 258.69c-5.964 3.378-13.541 2.905-18.722 3.095v-36.72l12.457.68s6.21 3.789 6.265 3.832c10.453 9.686 2.422 27.733 0 29.113m107.429 58.557a41.6 41.6 0 0 0-9.012-14.535c-7.988-8.325-14.903-10.385-19.752-14.56 10.747-6.222 17.68-8.484 25.325-23.222 8.754-16.962 8.325-40.362 5.18-58.587-2.005-11.5-9.368-22.707-17.337-30.854l-5.186-4.132-8.325-3.12-11.06-.987H119.595l-.11 264.064h104.283c-.073-35.286 0-109.028 0-109.273 0 .122 10.146-.086 11.145.061 16.65 2.79 12.886 24.662 12.819 40.564-.104 18.373.055 68.648.03 68.648h103.64c.074 0-.257-61.616-.257-66.9-.025-15.51 3.758-32.577-1.508-47.167M496.398 357.619c0 8.545-7.46 15.491-16.656 15.491-9.202 0-16.638-6.946-16.638-15.491V239.634c0-8.6 7.436-15.546 16.638-15.546 9.195 0 16.656 6.945 16.656 15.546zm30.504-190.372h-87.614c-59.784-1.281-73.84 31.087-73.84 66.76v133.586c-1.233 42.085 27.224 64.534 73.84 63.719h87.614c61.237.815 73.816-28.004 73.816-63.72V234.007c0-35.672-14.646-68.04-73.816-66.759M750.368 167.247v71.216l-3.679-.496-27.561-70.72H615.696l-.128 264.065h96.785l.037-96.161h3.642l34.716 96.161h97.987l-.134-264.065zM1582.682 167.247l.061 79.198-32.656-79.198h-100.954l-.81 264.065h96.566l-.129-101.176h3.157l38.229 101.176h94.818l.006-264.065zM1302.25 310.28l6.964-66.097h3.63l7.215 66.097zm31.921 120.97h106.061l-46.805-264.003h-167.028l-43.004 264.003h108.127l5.8-62.682h28.095zM1693.565 409.985a16.66 16.66 0 1 1 16.68 16.736 16.725 16.725 0 0 1-16.68-16.736m-4.898 0a21.558 21.558 0 1 0 21.579-21.72 21.625 21.625 0 0 0-21.58 21.72"/><path class='IMREG' d="M1705.764 422.622v-10.795h.957a6.458 6.458 0 0 1 2.298.288 3.32 3.32 0 0 1 1.38 1.091c.417.503 1.214 1.754 2.477 3.783l3.316 5.633h5.511l-2.813-5.008a33.366 33.366 0 0 0-2.637-4.254 11.1 11.1 0 0 0-2.476-2.158 6.93 6.93 0 0 0 4.469-2.324 7.348 7.348 0 0 0 1.532-4.867 7.653 7.653 0 0 0-1.018-4.09 5.888 5.888 0 0 0-2.61-2.433 14.713 14.713 0 0 0-5.267-.693h-9.655v25.827zm0-21.456h3.611a18.116 18.116 0 0 1 3.715.184 2.675 2.675 0 0 1 1.435 1.036 3.266 3.266 0 0 1 .496 1.98 3.695 3.695 0 0 1-.496 2.078 2.476 2.476 0 0 1-1.398 1.006 19.103 19.103 0 0 1-3.936.251h-3.427z"/><path d="M943.006 75.575c0-41.73 34.398-75.575 77.25-75.575 42.66 0 77.303 33.846 77.303 75.575 0 41.833-34.643 75.765-77.304 75.765-42.851 0-77.249-33.932-77.249-75.765M992.769 431.313l-35.697-98.171-.006 98.171h-93.378l-.349-264.064h312.482l.356 264.064h-92.685l-.019-98.244-33.912 98.244z" fill="#e31837"/></svg>`);

  let findNodes = data.find('li.enabled a');
  findNodes.each(function(){
      let href = $(this).attr('href');
      if(href === '/assets'){
          $(this).parent().addClass('assetsPage');
      }
      if(href === '/promotions'){
        $(this).parent().addClass('promotionsPage');
      }

      $(this).parent().find('.dropdown:first-of-type').addClass('secondLevel');
      $(this).parent().find('.dropdown:first-of-type').find('li.hasChild ul:first-of-type').addClass('thirdLevel');
  });
  logoLink.append(logo);
  footerLogo.append(logoLink);
  footerLeft.append(footerLogo);
  target.append(footerLeft, footerNav);
  footerNav.append(data);
  footerNav.find('> ul').addClass('topLevel');
  let private = $('.user_mode .footer-nav-items .private');
  private.remove();
}

let buildFooterExtra = function(data){
  let target = $('.footer-left');
  let siteFooter = $('#siteFooter');
  let legalContainer = $(`<div class='im-legal-links'></div>`);
  let button = data.find('.footer-button');
  let social = data.find('.footer-social');
  let legal = data.find('.legal-footer-links');
  legalContainer.append(legal);
  siteFooter.before(legalContainer);
  target.append(button, social);
}

let topNavNode = function(){
  let fuiId = FUI.navData.parent_top_nav_node;
  let current = FUI.navData.id;
  current = current.replace('page_node_', '');
  current = Number(current);
  let topNavNode = $('.user_mode .nav-list .topLevel > li.enabled');

  topNavNode.each(function(){
    let id = $(this).attr('id');
    let text = $(this).find('> a').text();
    id = id.replace('top_nav_node_page_node_', '');
    id = Number(id);
    if(current === id ){
      $(this).toggleClass('activeParent');
    }
    if(fuiId === id){
      $(this).toggleClass('activeParent');
    }
  });
}

let addTopToSubNav = function(){
  let subNav = $('.user_mode .displayBodyHeader-image .theme-sub-nav, .user_mode .site-banner-wrapper .theme-sub-nav');
  let ul = $('.user_mode .displayBodyHeader-image .theme-sub-nav .theme-nav.theme-nav-style-dropdown');
  let ulSiteHeader = $('.user_mode .site-banner-wrapper .theme-sub-nav .theme-nav.theme-nav-style-dropdown');
  let topNavNode = $('.user_mode .nav-list .topLevel > li.enabled > a');

  topNavNode.each(function(){
    if($(this).parent().hasClass('activeParent')){
      // console.log('active found');
      let text = $(this).text();
      // console.log(text);
      if(subNav.length){
        // console.log('subnav');
        // let markup = $(`<li class='theme-nav-title'><a href=''>${text}</a></li>`);
        // ul.prepend(markup);
        // ulSiteHeader.prepend(markup);
    
      }
    }

  });

}


let promotionsPage = function(){
  let parent = FUI.navData.parent.name;
  let body = $('body')
  if (parent === 'Promotions'){
    body.addClass('promotions');
  }
}

})(jQuery);