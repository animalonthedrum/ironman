(function(window, document, $){

  var doc = $(document);
  var win = $(window);

  doc.on('menu.loaded', '.menu', function(){
    var lastWidth;

    $('.menuIndicator').on('click', function(){
      $(this).parent().toggleClass('active');
      $(this).parents('.navSideWrap').toggleClass('active');
    });

    function formatMenu(){
      var firstRun = lastWidth === undefined;
      var currentWidth = window.innerWidth;
      var isDesktopWidth = currentWidth > 768;
      var isMobileWidth = !isDesktopWidth;
      var wasDesktopWidth = lastWidth > 768;
      var wasMobileWidth = !wasDesktopWidth;

      if (isDesktopWidth && wasMobileWidth) formatForDesktop();
      if (isMobileWidth && (wasDesktopWidth || firstRun)) formatForMobile();

      lastWidth = currentWidth;
    }

    function formatForMobile(){
      // mobileMenu();
    }
    function formatForDesktop(){
      // desktopMenu();
      $('.sn-mobile-icon.active, .navSideWrap.active').removeClass('active');
    }

    function mobileNavTrigger(nav, navButton){
      // Mobile Navigation Trigger
      nav = $(nav);
      navButton = $(navButton);
      navButton.click(function(event){
        event.preventDefault();
        if (navButton.hasClass('open')){
          navButton.removeClass('open');
          nav.removeClass('triggered');
        }
        else {
          navButton.addClass('open');
          nav.addClass('triggered');
        }
      });
    }
    mobileNavTrigger('.mobileNav', 'button.menuToggle');

    win.resize(formatMenu);

    formatMenu();

  });

}(window, document, window.jQuery));
