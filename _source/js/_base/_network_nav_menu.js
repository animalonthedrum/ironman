(function($, _){
  var EXPANDED_CLASS = 'network-nav-expanded';

  var NNM = NGIN.NetworkNavMenu = function(config){
    this.$title = $(config.title);
    this.$sites = $(config.sites);
    this.$mobileNav = this.$title.closest('.theme-mobile-nav');

    this.$sites.find('.theme-nav-menus').scrollGuard();
    this.$sites.detach();

    this.bindEvents();
  };

  _.extend(NNM.prototype, {

    bindEvents: function(){
      this.$title.on('click', '.theme-nav-back', this.transitionToNetwork.bind(this));
      this.$sites.on('click', '.theme-nav-forward', this.transitionToSite.bind(this));
      this.$mobileNav.on('SlideNavInitialize', this.moveSites.bind(this));
      this.$mobileNav.on('SlideNavClose', _.debounce(this.transitionToSite.bind(this), 200));
    },

    // do this only after the slide nav inits since this gets initialized before the slide nav module
    moveSites: function(event, eventData){
      this.$sites.appendTo(eventData.navElement);
    },

    transitionToSite: function(){
      this.$mobileNav.removeClass(EXPANDED_CLASS);
    },

    transitionToNetwork: function(){
      this.$mobileNav.addClass(EXPANDED_CLASS);
    }

  });
})(jQuery, _);
