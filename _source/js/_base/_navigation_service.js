(function($, _, global){

  if (!NGIN) NGIN = {};
  if (!NGIN.Modules) NGIN.Modules = {};

  var $win = $(window);

  var NS = NGIN.Modules.NavService = {

    promises: {},
    modules: {},

    register: function(className, methods){
      var initialize = methods.initialize || $.noop;
      var module = this.modules[className] = function(opts){
        this._setup(initialize, opts); // shared setup method
      };
      _.extend(module.prototype, this.sharedMethods, methods);
      delete module.prototype.initialize;
    },

    create: function(className, opts){
      var Module = this.modules[className];
      return Module && new Module(opts);
    },

    fixedNav: function(el){
      var $nav = $(el);
      var $els = $nav.add('html');
      var navTop = $nav.offset().top;
      var wasFixed = false;
      ;(window.seBar = window.seBar || []).push(function (seBar) {
        navTop = navTop + seBar.element.offsetHeight;
      });
      $(window).scroll(function(){
        var scrollTop = window.scrollY || window.pageYOffset || 0;
        var isFixed = navTop < scrollTop;
        if (!wasFixed && isFixed){
          $els.addClass('nav-fixed nav-fixed-start');
          setTimeout(function(){
            $els.removeClass('nav-fixed-start');
          }, 1);
        }
        else if (wasFixed && !isFixed){
          $els.removeClass('nav-fixed');
        }
        wasFixed = isFixed;
      });
    },

    sharedMethods: {

      // PUBLIC METHODS

      getNavData: function(url){
        // var nav = this;
        return this.preload((this.nav_url = url));
      },

      preload: function(e){
        var url = typeof e === 'string' ? e : $(e.currentTarget).attr('data-nav-url');
        return NS.promises[url] = NS.promises[url] || $.ajax({
          dataType: 'json',
          url: url,
          error: this._preloadError.bind(this, url)
        });
      },

      // PRIVATE

      _setup: function(initialize, opts){
        this.$html = $('html');
        this.$el = $(opts.selector).first();
        this.$navLinks = $($('#navLinksTemplate').html());
        this.$pageSearch = $($('#pageSearchTemplate').html());
        this.activeClass = opts.activeClass || '';
        this.loading = this.activeClass.slice(4) + '-is-loading';
        this.collapsedClass = opts.collapsedClass || '';
        this.navUrl = opts.data.nav_url;
        this.paywallImage = '<img src="' + opts.paywallImage + '" class="paywall_image">';
        this.minWidth = opts.minWidth || 0;
        this.collapseWidth = opts.collapseWidth || 0;
        this.maxWidth = opts.maxWidth || Infinity;
        this.currentId = opts.currentId;
        this.opts = opts;
        if (opts.currentId === opts.data.id){
          if (!global.FUI) global.FUI = {};
          if (!global.FUI.navData){
            global.FUI.navData = opts.data;
            $(document).trigger('_navigation_service:_setup');
          }
        }
        this.$html.addClass(this.loading);
        this._cache(opts.data);
        this._bindEvents();

        initialize.call(this, opts);

        // render should come last
        this.getNavData(this.navUrl)
          .then(this._render.bind(this));
      },

      _bindEvents: function(){
        $win.on('resize', this._resize.bind(this));
      },

      _render: function(navData, opts){
        this.render(navData, opts);
        this.rendered = this.visible = true;
        this._resize();
      },

      _okToShow: function(){
        return window.innerWidth >= this.minWidth && window.innerWidth <= this.maxWidth;
      },

      _resize: function(){
        if (!this.rendered) return;

        // note, you can specify a collapse class in your config OR in the nav module
        var collapse = this.collapsedClass && window.innerWidth <= this.collapseWidth;
        var show = this._okToShow();

        // set html class if visible
        this.$html.toggleClass(this.activeClass, show);

        // Trigger resize (more+) function and Remove loading class
        if (this.$html.hasClass(this.loading)) {
          if (this.resize) this.resize();
          this.$html.toggleClass(this.loading);
        }

        if (this.collapsedClass) this.$html.toggleClass(this.collapsedClass, show && collapse);

        // show or hide as needed
        if (show && !this.visible){
          this.visible = true;
          this.$el.show();
        }
        else if (!show && this.visible){
          this.visible = false;
          this.$el.hide();
        }

        if (this.resize) this.resize();
      },

      _cache: function(navData){
        var dfd = $.Deferred();
        dfd.resolve(navData);
        NS.promises[navData.nav_url] = dfd.promise();
      },

      _preloadError: function(url){
        delete NS.promises[url];
      }
    }

  };
})(jQuery, _, this);
