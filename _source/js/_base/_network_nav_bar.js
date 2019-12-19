(function($, _){
  // Requires teh $.fn.scrollGuard module.

  var COMPACT_CLASS = 'compact-style';

  var NNB = NGIN.NetworkNavBar = function(selector, config){
    this.dropDownStyle = config.displayStyle === 'drop_down_menu';
    this.$el = $(selector);
    this.el = this.$el[0];
    this.$title = this.$el.find('.theme-network-bar-title');
    this.$sites = this.$el.find('.theme-network-bar-sites').scrollGuard();
    this.$body = $('body');
    this.$doc = $(document);
    this.bindEvents();
  };

  _.extend(NNB.prototype, {

    bindEvents: function(){
      $(window).on('resize', this.resize.bind(this));
      _.delay(this.resize.bind(this));
    },

    renderDropDown: function(){
      this.$el.addClass(COMPACT_CLASS);
      this.$sites.detach();
      this.tip = NGIN.Modules.Tip(this.$sites, {
        style: 'theme-network-bar-dropdown',
        width: 'target',
        target: this.$title,
        target_anchor: 'bl',
        tip_anchor: 'tl',
        show_on: ['.theme-network-bar-title', 'click'],
        hide_on: [['.theme-network-bar-title', 'click'], [document, 'click'], [window, 'scroll']],
      });
    },

    renderIconList: function(){
      this.$sites.detach();
      if (this.tip) this.tip.destroy();
      this.$sites.insertAfter(this.$title).show();
      this.$el.removeClass(COMPACT_CLASS);
    },

    resize: function(){
      this.renderIconList();
      var dropDown = this.dropDownStyle || this.el.scrollWidth > this.el.offsetWidth;
      if (dropDown) this.renderDropDown();
    }

  });
})(jQuery, _);
