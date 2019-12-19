;(function($) {
  // would be ideal for this to use shared variables between scss & js... next PR do that & delete this - Ian
  setAdminColor('input#paint_job_link_color','#323232');
  setAdminColor('input#paint_job_accent_color','#DF7514');
  function setAdminColor(el, hex) {
    $(document).ready(function() {
      $(el).attr('value',hex);
    })
    $(el).change(function() {
      $(el).attr('value',hex);
    })
  }
}(jQuery));
