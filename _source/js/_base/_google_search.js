(function($, _){

  var searchModal;

  // SEARCH BOX

  var GSB = NGIN.GoogleSearchBox = function(selector, config){
    this.$el = $(selector);
    this.$input = this.$el.find(config.inputElement);
    this.$submit = this.$el.find(config.submitElement);
    this.$clear = this.$el.find(config.clearElement).hide();
    this.bindEvents();
  };

  _.extend(GSB.prototype, {

    bindEvents: function(){
      this.$input
        .on('keydown', this.submitIfEnter.bind(this))
        .on('keyup', this.update.bind(this));
      this.$submit.on('click', this.submit.bind(this));
      this.$clear.on('click', this.clear.bind(this));
    },

    update: function(){
      var val = this.$input.val().trim();
      this.$clear.toggle(!!val);
    },

    submit: function(e){
      if (!searchModal) return;
      var api = searchModal.api();
      var query = this.$input.val().trim();

      e.preventDefault();
      e.stopPropagation();

      if (api && query){
        api.execute(query);
        this.showModal();
      }
    },

    clear: function(e){
      e.preventDefault();
      this.$input.val('');
    },

    submitIfEnter: function(e){
      if (e.which === 13) this.submit(e);
    },

    showModal: function(){
      if (searchModal) searchModal.show();
    },

    hideModal: function(){
      if (searchModal) searchModal.hide();
    }

  });

  // SEARCH MODAL

  var GSM = NGIN.GoogleSearchModal = function(selector, config){
    if (searchModal) return searchModal;
    searchModal = this;
    this.$el = $(selector);
    this.$close = this.$el.find(config.closeElement);
    this.bindEvents();
  };

  _.extend(GSM.prototype, {

    api: function(){
      return google.search.cse.element.getElement('GoogleSearch');
    },

    bindEvents: function(){
      this.$close.on('click', this.hide.bind(this));
      this.$el.on('click', this.clickToHide.bind(this));
    },

    show: function(){
      this.$el.fadeIn();
    },

    hide: function(){
      var api = searchModal.api();
      if (api) api.clearAllResults();
      this.$el.fadeOut();
    },


    clickToHide: function(e){
      if (e.target === e.currentTarget) this.hide(e);
    }

  });
})(jQuery, _);
