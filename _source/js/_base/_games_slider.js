(function($){
  NGIN.Modules.GamesSlider = {
    init: function(){
      return new GamesSlider();
    }
  };

  function GamesSlider(){
    this.$slider = $('.games-slider');
    this.$selected = this.$slider.find('.selected');
    this.scrollToSelected();
  }

  // Set scrollLeft of slider so that selected game is visible
  GamesSlider.prototype.scrollToSelected = function(){
    if (this.$selected.length){
      var scrollLeft = this.$slider.scrollLeft();

      var left = Math.round(
        this.$selected.offset().left
        - this.$slider.offset().left
      );
      var leftWidth = left + this.$selected.outerWidth();

      // Selected game is off to left
      if (left < 0){
        scrollLeft += left;
      }
      // Selected game is off to right
      else if (leftWidth > this.$slider.outerWidth()){
        scrollLeft += leftWidth - this.$slider.outerWidth();
      }

      if (scrollLeft) this.$slider.scrollLeft(scrollLeft);
    }
  };
})(jQuery);
