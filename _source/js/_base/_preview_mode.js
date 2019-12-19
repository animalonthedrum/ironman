(function($){
  var siteNumber = '41608';
  var previewModeCss = '//s3.amazonaws.com/assets.ngin.com/site_files/' + siteNumber + '/_site/css/preview_mode.css';
  var previewModeValue = localStorage.getItem('preview-mode');
  var thisUrl = window.location.href;

  $(document).on('ready', function(){
    $('.sn-pageManager').append('<a href="' + thisUrl + '" class="sn-preview">Preview</a>');
  });

  if (previewModeValue === 'on'){
    $(document).on('ready', function(){
      $('.sn-preview').addClass('preview-on').attr('title','click to turn preview mode off');
      $('.sn-preview').on('click', function(){
        localStorage.setItem('preview-mode', 'off');
      });
    });
  }
  else {
    $(document).on('ready', function(){
      $('.sn-preview').addClass('preview-off').attr('title','click to turn preview mode on');
      $('.sn-preview').on('click', function(){
        localStorage.setItem('preview-mode', 'on');
      });
    });
  }

  if (previewModeValue === 'on'){
    $('head').append('<link rel="stylesheet" href="' + previewModeCss + '" />');
    // Require your preview mode js here

  }

})(jQuery);
