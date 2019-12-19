(function($, _){
  var $html = $('html');
  var htmlClass = 'page-manager-visible';

  var PM = NGIN.Modules.PageManager = function(opts){
    this.config = PM.CONFIG || {};
    this.opts = opts || {};
    this.$pageManager = $('.sn-pageManager');
    this.$pageManagerToggle = this.$pageManager.find('.sn-togglePages');
    this.$pageManagerContent = $('.sn-structure.sn-sidebarItem');
    this.$tabs = $('.sn-nav.sn-nav-tabs li');
    this.$tabContent = $('.sn-tabContainer');
    this.$pageLinks = $('.sn-pages li a').not('.cmsNavButton a');
    this.$editModeDisabled = $('.sn-edit-mode-disabled');
    this.$editModeDisabledTip = this.$editModeDisabled.find('.sn-tooltip');
    this.bindEvents();
  };

  PM.config = function(config){
    PM.CONFIG = config;
  };

  // Use jQuery UI sortable interaction to handle page manager's fixed position.
  // Use the scriptaculous style sortable callbacks for backward compatability.
  PM.sortable = function(elementId, pageId){
    var $el = $('#' + elementId);
    var childSelector = '.drag';
    var url = '/page/order/' + pageId;
    var csrfToken = $('meta[name="csrf-token"]').attr('content');

    function updateOrder(event, ui){
      var params = { authenticity_token: csrfToken };

      params[elementId + '[]'] = _.map($el.children(childSelector), function(child){
        return (child.id.match(Sortable.SERIALIZE_RULE) || [])[1];
      });

      new Ajax.Request(url, {
        asynchronous: true,
        evalScripts: true,
        parameters: params
      });
    }

    $el.sortable({
      axis: 'y',
      items: childSelector,
      update: updateOrder
    });
  };

  PM.prototype.bindEvents = function(){
    this.$pageManagerToggle
      .on('click', this.toggle.bind(this));
    this.$editModeDisabled
      .on('mouseover', this.showEditModeDisabledTip.bind(this))
      .on('mouseout', this.hideEditModeDisabledTip.bind(this));
    this.$tabs
      .on('click', this.showTab.bind(this));

    // prevent click of links in pages & navigation tab
    this.$pageLinks.each(function(){
      $(this).replaceWith($('<p>' + this.innerHTML + '</p>'));
    });

    // decide to show or not based on window size
    if (this.config.minWidth){
      this.resize();
      $(window).on('resize', this.resize.bind(this));
    }
    $(document).trigger('_page_manager:bindEvents');
  };

  PM.prototype.toggle = function(){
    var content = this.$pageManagerContent;
    var activate = !content.hasClass('active');
    content.toggleClass('active', activate);
    if (activate) this.resetTabs();
  };

  PM.prototype.resize = function(){
    var visible = $html.hasClass(htmlClass);
    var hide = window.innerWidth < this.config.minWidth;
    if (hide && visible) $html.removeClass(htmlClass);
    else if (!hide && !visible) $html.addClass(htmlClass);
  };

  PM.prototype.showTab = function(e){
    this.$tabs.removeClass('active');
    this.$tabContent.hide();
    $(e.currentTarget)
      .addClass('active')
      .find('.sn-tabContainer').show();
  };

  PM.prototype.resetTabs = function(){
    this.$tabs.removeClass('active').first().addClass('active');
    this.$tabContent.hide().first().show();
  };

  PM.prototype.showEditModeDisabledTip = function(){
    this.$editModeDisabledTip.stop().fadeIn();
  };

  PM.prototype.hideEditModeDisabledTip = function(){
    var tip = this.$editModeDisabledTip;
    tip.stop().fadeOut(200, function(){
      tip.css({ opacity : '1' });
    });
  };
})(jQuery, _);
