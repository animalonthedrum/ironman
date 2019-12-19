(function($, _){

  // SHARED VARIABLES

  var searchModal;
  var loadSearchData;

  // Keys that don't change the search value are ignored and include:
  // shift, ctrl, alt/opt, cmd, win/cmd, left, up, right, down
  var ignoredKeys = [16, 17, 18, 91, 93, 37, 38, 39, 40];

  // Some events run on click or certain key press. This check
  // will pass if the event was not a key event, or if the key event
  // matches the given key code.
  function allowKeys(e, code){
    if (e.type.indexOf('key') === -1) return true;
    return e.which === code;
  }

  function ignoredKeyEvent(e){
    return e && e.type.indexOf('key') !== -1 && ignoredKeys.indexOf(e.which) !== -1;
  }

  // PAGE SEARCH BOX (one or more per page)

  var PSB = NGIN.PageSearchBox = function(selector, config){
    this.$el = $(selector);
    this.$input = this.$el.find(config.inputElement);
    this.$submit = this.$el.find(config.submitElement);
    this.$clear = this.$el.find(config.clearElement).hide();
    this.bindEvents();
  };

  _.extend(PSB.prototype, {

    bindEvents: function(){
      this.$input
        .on('focus', this.load.bind(this))
        .on('keyup', this.update.bind(this))
        .on('keydown', this.submit.bind(this));
      this.$submit
        .on('focus', this.load.bind(this))
        .on('click', this.submit.bind(this));
      this.$clear
        .on('click', this.clear.bind(this));
    },

    val: function(query){
      var setting = !!arguments.length;
      if (setting){
        this.$clear.toggle(!!query);
        return this.$input.val(query);
      }
      else {
        return this.$input.val();
      }
    },

    update: function(e){
      if (searchModal && !ignoredKeyEvent(e)){
        var val = this.$input.val();
        var empty = !val.trim();
        this.$clear.toggle(!empty);
        searchModal.update(val);
      }
    },

    submit: function(e){
      if (!searchModal || !allowKeys(e, 13)) return;

      this.update();
      searchModal.show();
      e.preventDefault();
    },

    clear: function(e){
      e.preventDefault();
      this.$input.val('');
      this.update();
    },

    load: function(){
      if (!loadSearchData){
        loadSearchData = $.ajax('/navigation/page_search');
      }
    }

  });

  // PAGE SEARCH MODAL (only one per page)

  var PSM = NGIN.PageSearchModal = function(selector, config){
    if (searchModal) return searchModal;

    searchModal = this;

    this.$el = $(selector).appendTo('body');
    this.$results = this.$el.find(config.resultsElement).scrollGuard();
    this.$status = this.$el.find(config.statusElement);
    this.$spinner = this.$el.find(config.spinnerElement);
    this.$close = this.$el.find(config.closeElement);

    this.bindEvents(config);

    this.searchBox = new PSB(this.$el, {
      inputElement: config.inputElement,
      clearElement: config.clearElement
    });
  };

  _.extend(PSM.prototype, {

    sortBy: 'page_title',

    resultTmpl: _.template(
      '<div class="theme-search-result" data-url="/page/nav_links_redirect/<%= page_node_id %>">' +
        '<div class="theme-search-result-info">' +
          '<span class="theme-search-result-primary"><%= page_title %></span>' +
          '<span class="theme-search-result-secondary"><%= parent_button_title %></span>' +
        '</div>' +
      '</div>'
    ),

    bindEvents: function(){
      this.$el.on('click', this.clickToHide.bind(this));
      this.$close.on('click', this.clickToHide.bind(this));
      this.$el.on('click', '[data-url]', this.navigate.bind(this));
      $(document).on('keydown', this.hide.bind(this));
    },

    show: function(){
      this.visible = true;
      this.render();
      this.$el.fadeIn();
      this.searchBox.$input.focus();
    },

    clickToHide: function(e){
      if (e.target === e.currentTarget) this.hide(e);
    },

    navigate: function(e){
      var url = $(e.currentTarget).data('url');
      if (url) $.get(url);
    },

    hide: function(e){
      if (!allowKeys(e, 27)) return;
      this.visible = false;
      this.$el.fadeOut();
    },

    update: function(query){
      this.query = query;
      this.searchBox.val(query);
      if (this.visible) this.render();
    },

    filteredResults: function(data){
      var query = this.query && this.query.trim();
      if (!query) return data;

      var sortBy = this.sortBy;
      var queryRx = new RegExp(query, 'i');

      return _.filter(data, function(item){
        return queryRx.test(item[sortBy]);
      });
    },

    setStatus: function(matches, total){
      var statusText = matches ? 'Showing ' + matches + ' of ' + total : 'No results.';
      this.$status.text(statusText);
    },

    render: function(){
      var search = this;
      if (search.waitingToRender) return;

      search.$results.empty().append(search.$spinner);
      search.waitingToRender = true;

      loadSearchData.then(function(data){
        var results = data.result;
        var filteredResults = search.filteredResults(results);
        var markup = _.map(filteredResults, search.resultTmpl).join('');

        search.waitingToRender = false;
        search.setStatus(filteredResults.length, results.length);
        search.$results
          .empty()
          .append(this.$status)
          .append(markup);
      });
    }

  });

})(jQuery, _);
