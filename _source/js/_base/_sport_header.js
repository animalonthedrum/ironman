(function($){
  $(function(){
    var mobileBreakpoints = ['1024px', '768px', '640px','480px','360px','270px'];

    function fitElementWidth(fitEl){
      var elementLength = $(fitEl).length;
      var elementPercent = 100 / elementLength;
      var fitElementStyle = '<style>@media only screen and (max-width: ' + mobileBreakpoints[1] + ') { ' + fitEl + '{ width:' + elementPercent + '%; }}</style>';
      $(fitElementStyle).appendTo('head');
    }
    function setElementWidth(setEl){
      var totalWidth = 0;
      setEl.each(function(){
        totalWidth =  $(this).outerWidth() + totalWidth;
      });
      setEl.parent().css('width',totalWidth + 10);
    }
    function clearClassDropdowns(){
      $('.sport-crumbs-list').removeClass('thisCrumb');
      $('#sport-crumbs ul li').removeClass('crumbSelected');
      $('.dropdown-wrapper').removeClass('mdd-active-open');
    }
    setElementWidth($('#sport-crumbs .sport-crumbs-btns > ul li'));
    fitElementWidth('#sport-header .sport-tools li');

    $('#sport-crumbs .sport-crumbs-btns a[data-id]').on('click', function(e){
      var thisCrumb = $(this).attr('data-id');
      var thisCrumbId = $('#' + thisCrumb);
      var parentList = $(this).parent();

      if(thisCrumb !== undefined){
        if(thisCrumbId.hasClass('thisCrumb') === true){
          clearClassDropdowns();
        }
        else{
          clearClassDropdowns();
          parentList.addClass('crumbSelected');
          thisCrumbId.addClass('thisCrumb');
        }
        thisCrumbId.mouseleave(function(e){
          clearClassDropdowns();
          e.stopPropagation();
        });
      }
      e.preventDefault();
      e.stopPropagation();
    });
    $('.sport-crumbs-list-close a').on('click', function(e){
      clearClassDropdowns();
      e.preventDefault();
      e.stopPropagation();
    });

    /* Mega Dropdown Season */
    $('#megaDropDown-season').on('click', function(e){
      var nextDiv = $(this).next();
      var parentList = $(this).parent();
      if(nextDiv.length === true){
        if(parentList.hasClass('mdd-active-open') === true){
          parentList.removeClass('mdd-active-open');
        }
        else{
          parentList.addClass('mdd-active-open');
        }
        $('.sport-crumbs-list').removeClass('thisCrumb');
        $('#sport-crumbs ul li').removeClass('crumbSelected');
      }
      e.preventDefault();
      e.stopPropagation();
    });
    $('#megaDropDown-season-callout a.close').on('click', function(){
      $('.dropdown-wrapper').removeClass('mdd-active-open');
    });
    /* Roster Player Dropdown */
    $('#rosterPlayerConnections-button').on('click', function(){
      $('#rosterPlayerConnections-dropdown').toggle('fast', function(){
        if($(this).is(':visible')){
          $('#rosterPlayerConnections-button').addClass('rpc-open');
        }
        else{
          $('#rosterPlayerConnections-button').removeClass('rpc-open');
        }
      });
    });
  });
}(jQuery));
