(function($){

  function hasTouch(){
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }

  function setTouchScrolling(i, el){
    if (el.style) el.style.webkitOverflowScrolling = 'touch';
  }

  function trackTouch(e){
    var el = $(e.currentTarget);
    var currentY = e.originalEvent.pageY;
    var lastY = el.data('scrollGuardY');
    if (lastY === null) lastY = currentY;
    el.data('scrollGuardY', currentY);
    return currentY - lastY;
  }

  function untrackTouch(e){
    $(e.currentTarget).data('scrollGuardY', null);
  }

  $.fn.scrollGuard = function(){
    var scrollEvents = 'mousewheel';
    if (hasTouch()){
      scrollEvents += ' touchmove';
      this.each(setTouchScrolling)
        .on('touchstart', trackTouch)
        .on('touchend', untrackTouch);
    }
    return this
      .on(scrollEvents, function(e){
        var event = e.originalEvent;
        var el = e.currentTarget;
        var d = event.wheelDelta || -event.detail || trackTouch(e);
        var atTop = el.scrollTop === 0;
        var atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight;
        if (atTop && atBottom || d < 0 && atBottom || d > 0 && atTop) e.preventDefault();
      });
  };

})(jQuery);
