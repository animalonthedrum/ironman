// eslint-disable-next-line complexity
var FUI = (function(global,$){
  // local variables used in 'if' staements below to run nested functions declared
  // here that deal with setup & DOM manipulation
  // have same name as the nested functions ex F.Functions._page_manger ≠ _page_manger
  var reverseThemeNavForward = false;
  var _page_manager = true;
  var useOriginalLogoAsset = false;

  // jQuery extends used by FED UI
  $.fn.exists = function(){
    return jQuery(this).length > 0;
  };
  // usage:
  // $(elem).exists();
  // end jQueryExtends

  // 'if (!global.FED) FED = {}' could be written 'if (!window.FED) FED = {}'
  // technichally  the global variable is only referencing the context
  // in which this iife runs. In this case we're only running the FED
  // iife when window is the context which would allow us to reference
  // window instead of passing in an object

  // Using shorthand if statements w/o defining block, could be written as follows
  // if (!global.FED) {
  //     FED = {}
  // }
  // this use case of if checks for functions not yet defined and then creates them as needed
  if (!global.FUI) FUI = {};
  // if (!global.FUI.Modules) FUI.Modules = {}
  if (!global.FUI.Functions) FUI.Functions = {};
  // if (!global.FUI.Scopes) FUI.Scopes = {}
  if (!global.FUI.States) FUI.States = {};

  // uncomment next line only to define $env to use in place of $ or $j when testing functions in the console outside of the FUI IIFE
  // if (!global.FUI.States.$env && !global.$env) FUI.States.$env = global.$env= $ = jQuery;
  // usage:
  // if (!this.FUI.Functions.replaceAttrStyle) FUI.Functions.replaceAttrStyle = function(el, value) {
  //   $env(el).attr('style',value);
  // }
  // above code can be run in the dev tools console to create a new function
  // before adding to production code replace $env with $ and this with global


  // The log function here is an example of a globally available function
  if (!global.FUI.Functions.log){
    FUI.Functions.log = function(context){
      console.log(context);
    };
  }
  if (!global.FUI.Functions.removeCompression){
    FUI.Functions.removeCompression = function(el, firstExtension){
      $(el).attr('src',function(i,e){
        return e.replace(firstExtension,'');
      });
    };
  }
  if (!global.FUI.Functions.removeCompressionStyle){
    FUI.Functions.removeCompressionStyle = function(el, firstExtension){
      $(el).attr('style',function(i,e){
        return e.replace(firstExtension,'');
      });
    };
  }
  if (!global.FUI.Functions.removeCompressionString){
    FUI.Functions.removeCompressionString = function(str, firstExtension){
      return str.replace(firstExtension,'');
    };
  }
  if (!global.FUI.Functions.setAttrStyle){
    FUI.Functions.setAttrStyle = function(el, value){
      $(el).attr('style',value);
    };
  }
  if (!global.FUI.Functions.replaceCompression){
    FUI.Functions.replaceCompression = function(el, firstExtension, secondExtension){
      $(el).attr('src',function(i,e){
        return e.replace(firstExtension,secondExtension);
      });
    };
  }
  if (!global.FUI.Functions.removeNavLink){
    FUI.Functions.removeNavLink = function(el, title, text){
      $(el).each(function(){
        var $this = $(this),
          thistitle = $this.attr('title'),
          thistext = $this.text();
        thistitle === title || thistext === text ? $this.parent().remove() : '';
      });
    };
  }
  if (!global.FUI.Functions._page_manager){
    FUI.Functions._page_manager = function(){
      $(document).on('_slide_nav:render _dropdown_nav:render', function(){
        FUI.Functions.removeNavLink('a.theme-nav-link', false , 'Assets')
        FUI.Functions.removeNavLink('a.theme-nav-link', false , 'Site Guide')
        FUI.Functions.removeNavLink('a.theme-nav-link', false , 'Element Guide')
        // FUI.Functions.removeNavLink('a.theme-nav-link', false , 'Writers Guide')
        // FUI.Functions.removeNavLink('a.theme-nav-link', false , 'Season Reset')
        });
      $(document).on('_page_manager:bindEvents', function(){
        var pageManagerLink = function(url, cssClass, title){
          var cssClass = cssClass.toLowerCase();
          return '<a href="'+url+'" class="sn-'+cssClass+'">'+title+'</a>';
        }
        $('.sn-pageManager').append(
          pageManagerLink('/assets', 'assets', 'Assets'),
          pageManagerLink('/site-guide', 'site-guide', 'Site Guide'),
          pageManagerLink('/element-guide', 'element-guide', 'Element Guide'),
          pageManagerLink('/race-director-instructions', 'race-director-instructions', 'Race Director'),
          pageManagerLink('/race-catalog-instructions', 'race-catalog-instructions', 'Race Catalog'),
          pageManagerLink('/news-article-instructions', 'news-article-instructions', 'News Articles')
        );
      });
    };
  }
  if (!global.FUI.Functions.reverseThemeNavForward){
    FUI.Functions.reverseThemeNavForward = function(){
      $('.theme-nav-item').each(function(){
        var $this = $(this);
        var truthy = $this.find('.theme-nav-forward');
        if (truthy) truthy.detach().prependTo($this);
      });
    };
  }
  // run document ready within the scope of our Namespace
  // if (!global.FUI.Scopes.ready) FUI.Scopes.ready = function(){
  //   //shorthand for document ready accepts only a handler
  //   $(this);
  // }
  // if (!global.r) global.FUI.Scopes.ready = global.r = FUI.Scopes.ready
  // usage FUI.Scopes.ready(function, function, function);
  // usage r(function, function, function);

  // evaluate usermode, loggedin & home page classes as a boolean
  if (!global.FUI.States.o) FUI.States.o = {};
  // use the object FUI.States.o to get current values without running functions

  // written as a function as to be evaluated when called not at runtime which is not on ready per-say
  if (!global.FUI.States.user_mode) FUI.States.user_mode = function(){ var state = $('body.user_mode').exists(); FUI.States.o.user_mode = state; return state; };
  // usage:
  // F.user_mode()
  if (!global.FUI.States.edit_mode) FUI.States.edit_mode = function(){ var state = $('body.edit_mode').exists(); FUI.States.o.edit_mode = state;return state; };
  // usage:
  // F.edit_mode()
  if (!global.FUI.States.logged_in) FUI.States.logged_in = function(){ var state = $('body.logged_in').exists(); FUI.States.o.logged_in_mode = state; return state; };
  // usage:
  // F.logged_in()
  if (!global.FUI.States.home) FUI.States.home = function(){ var state = $('body.home').exists(); FUI.States.o.home = state; return state; };
  // usage:
  // F.home()
  if (!global.FUI.States.isDesktop) FUI.States.isDesktop = function(){ var state = $('html.has-main-nav').exists(); FUI.States.o.isDesktop = state; return state; };
  // usage:
  // F.isDesktop()
  if (!global.FUI.States.isMobile) FUI.States.isMobile = function(){ var state = $('html.has-mobile-nav').exists(); FUI.States.o.isMobile = state; return state; };
  // usage:
  // F.isMobile()
  if (!global.FUI.States.run && !global.FUI.run){
    FUI.States.run = FUI.run = function(p){
      FUI.States.user_mode();
      FUI.States.edit_mode();
      FUI.States.logged_in();
      FUI.States.home();
      FUI.States.isDesktop();
      FUI.States.isMobile();
      if (p) return FUI.States.o[p];
      if (!p) return FUI.States.o;
    };
  }
  // update all states and return optional param
  // usage:
  // F.States.run // this will update all key value pairs in the FUI.States.o object
  // F.States.run().isMobile // this can also be used to return specific states
  // F.States.run('isMobile') // this can also be used to return specific states
  // F.run().isMobile // this can also be used to return specific states
  // F.run('isMobile') // this can also be used to return specific states

  // exposed functions & nested objects, too much of this and we'll be right back to polluting the global scope
  if (!global.log) global.FUI.Functions.log = FUI.log = global.log = FUI.Functions.log;
  // global.FUI.Modules = global.F.M = FUI.Modules
  // global.FUI.Functions = global.F.F = FUI.Functions
  // global.FUI.Scopes = global.F.Sc = FUI.Scopes
  // global.FUI.States = global.F.St = FUI.States

  // execute defined functions for side effects or their return values...
  if (_page_manager){
    FUI.Functions._page_manager();
  }
  if (reverseThemeNavForward){
    $(document).on('_slide_nav:render', function(){
      FUI.Functions.reverseThemeNavForward();
    });
  }
  if (useOriginalLogoAsset){
    $(document).ready(function(){
      FUI.Functions.removeCompressionStyle('.sn-site-logo-background','_small');
    });
  }

  return (global.FUI = global.F = FUI);

}(this,jQuery));
