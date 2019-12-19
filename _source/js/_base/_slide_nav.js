(function($){

  var DEFAULT_DURATION = 300;

  NGIN.Modules.NavService.register('SlideNav', {

    initialize: function(opts){
      // Allow custom collapsed classes as well as the required one (for css integration)
      this.collapsedClass = 'slideNavCollapsed ' + (this.collapsedClass || '');
      this.duration = opts.duration || DEFAULT_DURATION;
      this.collapseWidth = opts.collapseWidth || 0;
      this.listCount = 0;
      this.currentNavData = opts.data;
      this.$html = $('html');
      this.$nav = $('<div class="theme-nav theme-nav-style-slide" />');
      this.$toggle = $('<span class="theme-slide-nav-toggle" />').appendTo(this.$nav);
      this.$title = $('<div class="theme-nav-title">').appendTo(this.$nav);
      this.$menus = $('<div class="theme-nav-menus">').appendTo(this.$nav).scrollGuard();
      this.$overlay = $('<div class="theme-slide-nav-overlay" />').appendTo(this.$nav);
      ;(window.seBar = window.seBar || []).push(function (seBar) {
        $('.theme-nav.theme-nav-style-slide').css('top', seBar.element.offsetHeight + 'px');
      });
      this.appendContent();
      this.bindEvents();

      this.$el.trigger('SlideNavInitialize', { navElement: this.$nav });
    },

    // Injects any pre-rendered content into the nav element in the correct location
    appendContent: function(){
      var content = this.$el.children().detach();
      if (content.length){
        $('<div class="theme-slide-nav-content" />')
          .append(content)
          .insertBefore(this.$title);
      }
    },

    bindEvents: function(){
      this.$nav.on('hover', '[data-nav-url]', this.preload.bind(this));
      this.$menus.on('click', '[data-nav-url]', this.loadChildNav.bind(this));
      this.$title.on('click', '[data-nav-url]', this.loadParentNav.bind(this));
      this.$toggle.add(this.$overlay).on('click', this.toggleMenu.bind(this));

      // unbind mclose -- Removes old ngin JS menu close handler
      // $(document).unbind('click', mclose());
    },

    toggleMenu: function(){
      var open = !this.$html.hasClass('slide-nav-open');
      this.$html.toggleClass('slide-nav-open', open);
      this.$el.trigger(open ? 'SlideNavOpen' : 'SlideNavClose', { navElement: this.$nav });
      this.scrollToTop();
    },

    scrollToTop: function(){
      // Doing this in an interval to fix an issue where iOS would NOT end up at
      // the top when closing the menu. Maybe something to do with CSS animation?
      var scrollInterval = setInterval(function(){
        window.scrollTo(0, 0);
      }, 20);
      setTimeout(function(){
        clearInterval(scrollInterval);
      }, 300);
    },

    resize: function(){
      this.$html.not('.slideNavCollapsed').removeClass('slide-nav-open');
    },

    renderParentContent: function(data){
      var topLevel = data.parent_id === null && data.node_type === null;

      if (topLevel){
        this.$title.html(
          '<span class="theme-nav-title-text">Main Menu</span>'
        );
        this.$menus.addClass('top-level-nav');
      }
      else {
        this.$title.html(
          '<span class="theme-nav-back" data-nav-url="' + data.nav_url + '"></span>' +
          '<a href="' + data.url + '" class="theme-nav-title-text">' + data.name + '</a>'
        );
        this.$menus.removeClass('top-level-nav');
      }
    },

    render: function(navData, opts){
      if (!this.$nav.parent(this.$el).length) this.$el.append(this.$nav);
      var navDir = 'up';

      // navDir bound as first arg when rendering after navigation
      if (typeof navData === 'string'){
        navDir = navData;
        navData = opts;
      }

      var renderParent = navDir !== 'down';
      var newMenu = $('<ul class="theme-nav-menu" />');
      var listData = renderParent ? navData.siblings : navData.children;
      var parentData = renderParent ? navData.parent : navData;
      var topLevel = renderParent === true && navData.parent.parent_id === null && navData.parent.node_type === null;

      // Build Lists
      for (var i = 0; i < listData.length; i++){
        var navItem = $('<li class="theme-nav-item"/>');
        var data = listData[i];
        var linkContent = data.name;

        var classes = [].concat(data.css_classes || []);
        navItem.addClass(classes.join(' '));

        if (data.display_status === 'paywalled') linkContent = this.paywallImage + ' ' + linkContent;

        var link = '<a class="theme-nav-link" href="' + data.url + '" id="' + data.id + '">' + linkContent + '</a>';
        var forwardArrow = '';

        if (linkContent) navItem.attr('data-title', linkContent.toLowerCase());
        if (data.display_status) navItem.addClass(data.display_status);
        if (data.id === this.currentId) navItem.addClass('selected');
        if (data.has_child){
          navItem.addClass('hasChild');
          forwardArrow = $('<span class="theme-nav-forward ' + data.id + '"></span>');
          if (data.nav_url) forwardArrow.attr('data-nav-url', data.nav_url);
        }

        navItem
          .append(link, forwardArrow)
          .appendTo(newMenu);
      }

      // render/preload parent data if needed (do this after preloading
      // children since child pages are more likely to be needed first).
      this.renderParentContent(parentData);

      // Place List Content
      this.$menus.append(newMenu);

      // Sets the first menu as current (will animate to next menu if needed)
      this.$menus.children().first();

      // Animate if we have rendered more than one list
      if (this.listCount++){
        if (renderParent) this.transitionToParent();
        else this.transitionToChildren();
      }
      $(document).trigger('_slide_nav:render');
      if (topLevel) $(document).trigger('_slide_nav:render_top_level');
    },

    transitionToParent: function(){
      var menus = this.$menus.children();
      var newMenu = menus.last().addClass('theme-nav-parent-in');
      var oldMenu = menus.first().addClass('theme-nav-children-out');
      newMenu.insertBefore(oldMenu);
      setTimeout(function(){
        newMenu.removeClass('theme-nav-parent-in');
      }, 50);
      setTimeout(function(){
        oldMenu.remove();
      }, this.duration);
    },

    transitionToChildren: function(){
      var menus = this.$menus.children();
      var newMenu = menus.last().addClass('theme-nav-children-in');
      var oldMenu = menus.first().addClass('theme-nav-parent-out');
      setTimeout(function(){
        newMenu.removeClass('theme-nav-children-in');
      }, 50);
      setTimeout(function(){
        oldMenu.remove();
      }, this.duration);
    },

    loadParentNav: function(e){
      this.getNavData($(e.currentTarget).attr('data-nav-url'))
        .then(this.render.bind(this, 'up'));
    },

    loadChildNav: function(e){
      this.getNavData($(e.currentTarget).attr('data-nav-url'))
        .then(this.render.bind(this, 'down'));
    }

  });

})(jQuery);
