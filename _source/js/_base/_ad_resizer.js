(function($, _){
  var NAR = NGIN.AdResizer = function(selector){
    this.$el = $(selector); // this might need to be a direct reference to the ad-wrapper element
    this.el = this.$el[0];
    this.bindEvents();
  };

  _.extend(NAR, {
    setup: function(){
      googletag.pubads().addEventListener('slotRenderEnded', function(e){
        var adElement = $('#' + e.slot.getSlotElementId()).removeAttr('id');
        adElement.trigger('adSlotRendered', e);
      });
    }
  });

  _.extend(NAR.prototype, {

    bindEvents: function(){
      $(window).on('resize', this.resize.bind(this));
      this.$el.on('adSlotRendered', this.resize.bind(this));
      _.delay(this.resize.bind(this));
    },

    resize: function(){
      this.setSize(1, 0); // reset
      var scale = Math.min(this.el.clientWidth / this.el.scrollWidth, 1);
      var marginBottom = this.el.scrollHeight * (scale - 1);
      this.setSize(scale, marginBottom);
    },

    setSize: function(scale, marginBottom){
      this.$el.children().css('transform', 'scale(' + scale + ')');
      this.$el.css('marginBottom', marginBottom + 'px');
    }

  });

  if (typeof googletag == 'object') googletag.cmd.push(NGIN.AdResizer.setup);
})(jQuery, _);
