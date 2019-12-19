(function($, global) {

  // Setup - Site Builder Custom Object
  global.SBC = {
    state: {},
    globalData: {},
    globalAreas: {},
    enforceMode: function() {
      var setMode = function(mode) {
        return $.get('/page/set_edit_mode/' + mode, function(){}, mode);
      };
      if (SBC.state.editMode) setMode('edit');
    },
    getPage: function(pageURL){
      var name = pageURL.slice(1);
      var className = 'custom-' + name;
      var html = $('html');
      html.addClass(className + '-is-loading');

      $.get(pageURL)
        .done(function(response){
          SBC.enforceMode();
          SBC.globalData[name] = $(response);
          SBC.state[name+"Ready"] = true;
          $(document).trigger(name+"_loaded");
          html.removeClass(className + '-is-loading');
        })
        .fail(function(){
          html.removeClass(className + '-is-loading').addClass(className + '-is-unreachable');
          console.warn('🍅 Custom Design Error: \nThe AJAX request for the url (' + pageURL + ') has failed. \nPlease make sure this url is valid and public.');
        });
    },
    renderGlobalHeaderMarkup: function(){
      var mainNavEntry = $('.theme-main-nav .theme-nav');
      var titleBarEntry = $('.theme-search-wrapper .theme-search-bar');
      SBC.globalAreas.mainNavExtra = $('<div class="custom-main-nav-extra">');
      SBC.globalAreas.titleBarExtra = $('<div class="custom-title-bar-extra">');
      mainNavEntry.prepend(SBC.globalAreas.mainNavExtra);
      titleBarEntry.append(SBC.globalAreas.titleBarExtra);
    },
    renderGlobalFooterMarkup: function(){
      var footerEntry = $('.snFooterContainer');
      SBC.globalAreas.footerExtra = $('<div class="custom-footer-extra"/>');
      footerEntry.prepend(SBC.globalAreas.footerExtra);
    }
  };

  // Add custom functions to jQuery
  $.fn.globalComponentUI = function(source, title) {
    var source = source || '/assets';
    var title = title || 'Manage Assets';
    return this.each(function() {
      if (FUI.States.edit_mode()){
        var editModeUi = $('<a href="'+source+'" class="global-component-edit-link"><span class="global-component-title">'+title+'</span><span class="global-component-icon"></span></a>');
        $(this).addClass('global-component-edit').prepend(editModeUi);
      }
    });
  };

  // initialize SBC and global events
  $(document)
    .one('nav:has-main-nav', function(){
      SBC.state.navMainReady = true;
      SBC.state.editMode = $('body').hasClass('edit_mode');
      SBC.state.userMode = $('body').hasClass('user_mode');
    })
    .one('nav:has-sub-nav', function(){
      SBC.state.navSubReady = true;
    })
    .one('_slide_nav:render_top_level', function(){
      SBC.state.navSlideTopReady = true;
    })
    .one('ready', function() {
      SBC.state.ready = true;
    })
    .one('assets_loaded nav:has-main-nav', function() {
      if(SBC.state.assetsReady && SBC.state.navMainReady){
        SBC.renderGlobalHeaderMarkup();
        $(document).trigger('has-global-header');
      }
    })
    .on('assets_loaded ready', function() {
      if(SBC.state.assetsReady && SBC.state.ready) {
        SBC.renderGlobalFooterMarkup();
        $(document).trigger('has-global-footer');
      }
    })

})(jQuery, window);
