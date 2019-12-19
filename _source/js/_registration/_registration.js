(function($) {
  $(function() {
    checkId('body','survey_steps') ? regDomChange() : '';
    //
    function checkId(ele,id){
      return $(ele).attr('id') == id ? true : false;
    }
    function siteNum(){
      return $('html').attr('id').replace("ngin", "");
    }
    function checkBrowser(str){
      browser = navigator.userAgent.toLowerCase().indexOf(str.toLowerCase()) >= 0 ? true : false;
      return browser;
    }
    function addBrowserClass(str){
      checkBrowser(str) ? $('body').addClass('sn-'+str.toLowerCase()) : '';
    }
    function regDomChange(){
      addBrowserClass('Edge');
      replaceText('#tstRegistrationHeader h1','SportsEngine Registration: ');
      getLogoPath();
      //Change Error Notice Yellow to Red
      $('#displayBodyContent').on('DOMNodeInserted', '#errorNotice', function(e) {
          $(e.target).find('#flashError h2').text( $('#flashError h2').text().split('[').join('').split(']').join('').split('"').join('').split('yellow').join('red') );
      });
    }
    function getLogoPath(){
      logoPath = '//assets.ngin.com/site_files/'+siteNum()+'/_site/images/se.svg';
      url = document.domain;
      regLogo = '<a href="//'+url+'" class="sn-reg-logo"></a>';
      $('#tstRegistrationHeader').prepend(regLogo);
      $.ajax({
        type: "GET",
        url: 'https://'+url,
        dataType: "html",
        success: function (data) {
          bgStyle = $(data).find('.sn-site-logo-background');
          bgStyle.length == true ? stripPath(bgStyle) : '';
          regImg = '<img src="'+logoPath+'">';
          $('.sn-reg-logo').prepend(regImg);
        }
      });
    }
    function stripPath(obj){
      obj.attr('style', function(i,e){
        return e.replace('_small', '');
      });
      logoPath = obj.attr('style').split('url(');
      logoPath = logoPath[1].split(');');
      logoPath = logoPath[0];
      return logoPath;
    }
    //accepts an element name and the text to remove
    function replaceText(ele,tex){
      var new_tex = $(ele).text().replace(tex,'');
      $(ele).text(new_tex).addClass('sn-show');
    }
  });
}(jQuery));
