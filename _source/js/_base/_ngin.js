(function($, global, undefined){

  // root object
  if(global.NGIN === undefined){
    global.NGIN = {};
  }

  // modules are discreet pieces of functionality
  if(global.NGIN.Modules === undefined){
    global.NGIN.Modules = {};
  }

  // Module Factory
  if(global.NGIN.create === undefined){
    NGIN.create = function(module_name, $these){
      for (var i = 0, l = $these.length; i < l; i++){
        // add the module instance as an object on the jqeury powered data attribute
        // this will fail if a module is created before document.ready
        $($these[i]).data(module_name, new NGIN.Modules[module_name]($these[i]));
      }
    };
  }

  // modules and helpers specific to form input
  if(global.NGIN.Input === undefined){
    global.NGIN.Input = {};
  }

  // one off functions, typically stuff pulled in from the application.js file
  if(global.NGIN.helpers === undefined){
    global.NGIN.helpers = {};
    // use uppercase Helpers going forward for consistency
    global.NGIN.Helpers = NGIN.helpers;
  }

  // a history of events
  if(global.NGIN.events === undefined){
    global.NGIN.events = {};
  }

  // properties that we want to store
  if(global.NGIN.properties === undefined){
    global.NGIN.properties = {};
  }

  // instantiated elements
  // NGIN.elements.autorefresh = new AutoRefresh();
  // NGIN.elements.something = [];
  // NGIN.elements.something[0] = new Something();
  if(global.NGIN.elements === undefined){
    global.NGIN.elements = {};
  }


  // Global Variables
  global.IE = null; // If we don't create this here the CORE breaks.

}(jQuery, this));
