(function($, global) {


  var renderMobileNavContent = function renderMobileNavContent(data){
    var mobileNav = $('.theme-mobile-nav .theme-nav > .theme-nav-menus .theme-nav-menu');
    var mobileNavExtras = data.find('.nav-extra .desktop-nav-extra-links ul li').clone().addClass('theme-nav-item enabled');

    mobileNavExtras.find('a').addClass('theme-nav-link');
    mobileNav.append(mobileNavExtras);
  };


  // Get Assets Page
  SBC.getPage('/assets');

  // Listen for Ready States
  $(document)

    .one('has-global-footer', function() {
    })
    .on('assets_loaded _slide_nav:render_top_level', function(){
      if (SBC.state.assetsReady && SBC.state.navSlideTopReady){
        renderMobileNavContent(SBC.globalData.assets);
      }
    });
})(jQuery, window);
