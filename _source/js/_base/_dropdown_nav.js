(function($, _){

  var NEXT_TICK = 30;
  var OPEN_DELAY = 200;
  var CLOSE_DELAY = 500;
  var OPENING_CLASS = 'dropdown-opening';
  var OPEN_CLASS = 'dropdown-open';
  var OPEN_CLASSES = OPEN_CLASS + ' ' + OPENING_CLASS;
  var DROPDOWN_MARGIN_TOP = 0;
  var DROPDOWN_MARGIN_BOTTOM = 30;
  var DROPDOWN_WIDTH = 200;
  var DROPDOWN_ALIGN_LEFT = 'dropdown-align-left';
  var DROPDOWN_ALIGN_RIGHT = 'dropdown-align-right';
  var DROPDOWN_ALIGN_CLASSES = DROPDOWN_ALIGN_LEFT + ' ' + DROPDOWN_ALIGN_RIGHT;

  function realOuterWidth(el){
    if (!el || !el.style) return 0;
    var s = window.getComputedStyle(el);
    return parseFloat(s.width) + parseFloat(s.paddingRight) + parseFloat(s.paddingLeft) + parseFloat(s.borderRightWidth) + parseFloat(s.borderLeftWidth);
  }

  NGIN.Modules.NavService.register('DropdownNav', {

    initialize: function(opts){
      this.openDelay = opts.openDelay || OPEN_DELAY;
      this.closeDelay = opts.closeDelay || CLOSE_DELAY;
      this.$navItems = $('<ul class="theme-nav theme-nav-style-dropdown" data-nav-level="1" />').appendTo(this.$el);
      this.$moreButton = $('<li class="theme-nav-item theme-nav-more hasChild"><a class="theme-nav-link">More</a></li>');
      this.$moreMenu = $('<ul class="theme-nav-dropdown" data-nav-level="2" />').width(DROPDOWN_WIDTH).scrollGuard();
      this.$moreButton.data('dropdown', this.$moreMenu);
      this.$moreMenu.data('navItem', this.$moreButton);
      this.bindEvents();
    },

    bindEvents: function(){
      $(window).one('load', this.checkOverflowAfterLoad.bind(this));
      $(document).on('scroll', this.closeAllDropdowns.bind(this));
      $(document).one('nav:has-global-data', this.resize.bind(this));
      this.$el
        .on('mouseenter', '.theme-nav-dropdown', this.dropdownOver.bind(this))
        .on('mouseleave', '.theme-nav-dropdown', this.dropdownOut.bind(this))
        .on('mouseenter', '.theme-nav-item', this.itemOver.bind(this))
        .on('mouseleave', '.theme-nav-item', this.itemOut.bind(this));
    },

    itemOver: function(e){
      var $navItem = $(e.currentTarget);
      $navItem.data('over', true);
      if ($navItem.hasClass('hasChild')) this.showDropdown($navItem);
      this.keepDropdownOpen($navItem.data('parentDropdown'));
    },

    itemOut: function(e){
      var $navItem = $(e.currentTarget);
      var $dropdown = $navItem.data('dropdown');
      $navItem.data('over', false);
      this.allowDropdownToClose($dropdown);
    },

    dropdownOver: function(e){
      var $dropdown = $(e.currentTarget);
      $dropdown.data('over', true);
      this.keepDropdownOpen($dropdown);
    },

    dropdownOut: function(e){
      var $dropdown = $(e.currentTarget);
      $dropdown.data('over', false);
      this.allowDropdownToClose($dropdown);
    },

    closeAllDropdowns: function(){
      this.closeItems(this.$navItems.children());
    },

    render: function(navData){
      var showChildren = this.opts.showChildren && navData.children.length;
      var items = showChildren ? navData.children : navData.siblings;
      var renderOpts = {
        items: items,
        level: 1
      };

      if (this.opts.showTitle){
        var titleObj = showChildren ? navData : navData.parent;
        renderOpts.title = titleObj.name;
        renderOpts.titleLink = titleObj.url;
      }

      this.renderNavItems(this.$navItems, renderOpts);
      this.$el.append(this.$moreMenu);
      if (this.activeClass === 'has-main-nav') $(document).trigger('nav:has-main-nav');
      if (this.activeClass === 'has-sub-nav') $(document).trigger('nav:has-sub-nav');
      this.handleOverflow();
      $(document).trigger('_dropdown_nav:render');
    },

    resize: function(){
      // need to only run this when showing the first time???
      this.resetOverflow();
    },

    showDropdown: function($navItem){
      var nav = this;
      var $dropdown = this.renderDropdown($navItem);
      var $itemAndDropdown = $navItem.add($dropdown);
      var openDelay = $dropdown.is(':visible') ? 0 : this.openDelay;

      // keep this drop open
      clearTimeout($dropdown.data('openTimeout'));
      clearTimeout($dropdown.data('closeTimeout'));

      this.positionDropdown($dropdown);

      function startOpening(){
        if (!$navItem.data('over') && !$dropdown.data('over')) return;
        nav.closeItems($navItem.siblings());
        $itemAndDropdown.addClass(OPENING_CLASS);
        $dropdown.data('openTimeout', setTimeout(finishOpening, NEXT_TICK));
      }

      function finishOpening(){
        if ($navItem.hasClass(OPENING_CLASS)){
          $itemAndDropdown
            .addClass(OPEN_CLASS)
            .removeClass(OPENING_CLASS);
        }
      }

      $dropdown.data('openTimeout', setTimeout(startOpening, openDelay));
    },

    keepDropdownOpen: function($dropdown){
      if (!$dropdown) return;
      $dropdown.data('over', true);
      clearTimeout($dropdown.data('closeTimeout'));
      var $parentItem = $dropdown.data('navItem');
      if ($parentItem) this.keepDropdownOpen($parentItem.data('parentDropdown'));
    },

    allowDropdownToClose: function($dropdown){
      if (!$dropdown) return;
      $dropdown.data('over', false);
      $dropdown.data('closeTimeout', setTimeout(this.closeDropdown.bind(this, $dropdown, true), this.closeDelay));
      var $parentItem = $dropdown.data('navItem');
      if ($parentItem) this.allowDropdownToClose($parentItem.data('parentDropdown'));
    },

    closeItems: function($items){
      var nav = this;
      $items.each(function(i, item){
        nav.closeDropdown($(item).data('dropdown'));
      });
    },

    closeDropdown: function($dropdown, bubble){
      if (!$dropdown) return;
      var $navItem = $dropdown.data('navItem');
      if ($navItem.data('over') || $dropdown.data('over')) return;
      $navItem.removeClass(OPEN_CLASSES);
      this.closeItems($dropdown.removeClass(OPEN_CLASSES).children());
      if (bubble) this.closeDropdown($navItem.data('parentDropdown'));
    },

    positionDropdown: function($dropdown){
      // start by resetiing the dropdown state
      $dropdown
        .css('maxHeight', '')
        .removeClass(DROPDOWN_ALIGN_CLASSES);

      var $navItem = $dropdown.data('navItem');
      var $parentDropdown = $navItem.data('parentDropdown');
      var renderBelow = $dropdown.data('nav-level') < 3;
      var navOffset = this.$el.offset();
      var navItemsOffset = this.$navItems.offset();
      var itemOffset = $navItem.offset();
      var windowHeight = $(window).height();
      var windowScroll = $(window).scrollTop();
      var maxX = this.$navItems.outerWidth() + navItemsOffset.left - navOffset.left;
      var navHeight = this.$navItems.outerHeight();
      var navItemWidth = $navItem.outerWidth();
      var width = navItemWidth > DROPDOWN_WIDTH ? navItemWidth : DROPDOWN_WIDTH;
      var height = $dropdown.outerHeight();
      var minTop = navHeight;
      var fixedBottom = navOffset.top + navHeight - windowScroll;
      var maxHeight = windowHeight - fixedBottom - DROPDOWN_MARGIN_BOTTOM;

      // allow second level menues to shift down
      if (!renderBelow) minTop += DROPDOWN_MARGIN_TOP;

      var maxBottom = minTop + maxHeight;
      var left;
      var top;
      var alignmentClass = DROPDOWN_ALIGN_LEFT;

      // first level drop downs
      if (renderBelow){
        top = minTop;
        left = itemOffset.left - navOffset.left;

        if (left + width > maxX){
          alignmentClass = DROPDOWN_ALIGN_RIGHT;
          left = left - width + navItemWidth;
        }
      }

      // second level dropdowns
      else {
        var widthOffset = $parentDropdown ? $parentDropdown.outerWidth() : navItemWidth;
        top = Math.max(itemOffset.top - navOffset.top, minTop);
        left = itemOffset.left - navOffset.left + widthOffset;

        if (left + width > maxX){
          alignmentClass = DROPDOWN_ALIGN_RIGHT;
          left = left - width - navItemWidth;
        }
      }

      // Shift menu up if is scrolls and there is space to do so
      if (top + height > maxBottom){
        top = Math.max(maxBottom - height, minTop);
      }

      // update dropdown state
      $dropdown
        .addClass(alignmentClass)
        .css({
          top: top,
          left: left,
          maxHeight: maxHeight,
          width: width,
          overflow: 'auto'
        });
    },

    showNextLevel: function(level){
      var checkDepth = 'maxDepth' in this.opts && level;
      return checkDepth && level <= this.opts.maxDepth || false;
    },

    renderDropdown: function($navItem){
      var $dropdown = $navItem.data('dropdown');
      if ($dropdown) return $dropdown;

      var nav = this;
      var navUrl = $navItem.data('nav-url');
      var level = ($navItem.parent().data('nav-level') || 1) + 1;

      $dropdown = $('<ul class="loading theme-nav-dropdown" data-nav-level="' + level + '" />');
      $dropdown.width(DROPDOWN_WIDTH);
      $dropdown.scrollGuard(); // prevents overflow scrolling
      $navItem.data('dropdown', $dropdown);
      $dropdown.data('navItem', $navItem);

      function renderItems(navData){
        nav.renderNavItems($dropdown, {
          items: navData.children,
          level: level
        });
        var items = $dropdown.children();
        items.data('parentItem', $navItem);
        items.data('parentDropdown', $dropdown);
        // add scroll binding to hide submenus
        $dropdown.on('scroll', nav.closeItems.bind(nav, $dropdown.children()));
      }

      nav.getNavData(navUrl).then(renderItems);
      nav.positionDropdown($dropdown);

      return $dropdown.appendTo(this.$el);
    },

    renderNavItems: function($container, opts){
      var nav = this;
      $container.removeClass('loading');

      if (opts.title){
        $container.append('<li class="theme-nav-title"><a href="' + opts.titleLink + '">' + opts.title + '</a></li>');
      }

      _.each(opts.items, function(navItem){
        var classes = [].concat(navItem.css_classes || []);
        var $navItem = $('<li class="theme-nav-item" />');

        if (navItem.id === nav.currentId) classes.push('selected');
        if (navItem.display_status) classes.push(navItem.display_status);
        if (navItem.name) $navItem.attr('data-title', navItem.name.toLowerCase());

        if (nav.showNextLevel(opts.level)){
          if (navItem.has_child) classes.push('hasChild');
          if (navItem.nav_url) $navItem.attr('data-nav-url', navItem.nav_url);
        }

        $navItem.addClass(classes.join(' '));

        var $link = $('<a class="theme-nav-link" />')
          .appendTo($navItem)
          .text(navItem.name)
          .attr({
            href: navItem.url,
            title: navItem.title,
            target: navItem.target || '_self'
          });

        if (navItem.display_status === 'paywalled' && nav.paywallImage){
          $link.prepend(nav.paywallImage + ' ');
        }

        $container.append($navItem);
      });
    },

    checkOverflowAfterLoad: function(){
      // var overflowWidths = this.overflowWidths || [];
      // var firstItemWidth = this.$navItems.children().first().outerWidth();
      this.resetOverflow();
    },

    resetOverflow: function(){
      delete this.overflowWidths;
      this.$moreButton.detach();
      this.$navItems.append(this.$moreMenu.children());
      this.handleOverflow();
    },

    handleOverflow: function(){
      var navItems = this.$navItems;
      var moreMenu = this.$moreMenu;
      var moreButton = this.$moreButton;
      var visibleItems = navItems.children().not(moreButton);
      var oldExtraItems = moreMenu.children();
      var allItems = visibleItems.add(oldExtraItems);

      var overflowWidths = this.getOverflowWidths();
      var moreButtonWidth = this.moreButtonWidth;
      var maxWidth = this.$navItems.width();
      var totalWidth = 0;
      var hasExtraItems = false;
      var index = 0;

      // fit as many items in as possible
      while (index < overflowWidths.length){
        var itemWidth = overflowWidths[index];
        if (totalWidth + itemWidth > maxWidth){
          hasExtraItems = true;
          break;
        }
        totalWidth += itemWidth;
        index++;
      }

      // backtrack if more button won't fit
      while (hasExtraItems && totalWidth + moreButtonWidth > maxWidth){
        index--;
        totalWidth -= overflowWidths[index];
      }

      var newExtraItems = hasExtraItems && allItems.slice(index).not(oldExtraItems);
      var newVisibleItems = hasExtraItems && oldExtraItems.not(newExtraItems);

      function changeNavLevel(delta){
        return function(i, navItem){
          navItem = $(navItem);
          navItem.data('nav-level', delta + navItem.data('nav-level'));
        };
      }

      function setParents(parentItem, parentDropdown){
        return function(i, navItem){
          navItem = $(navItem);
          navItem.data('parentItem', parentItem);
          navItem.data('parentDropdown', parentDropdown);
        };
      }

      if (newVisibleItems){
        newVisibleItems.each(changeNavLevel(-1));
        moreButton.before(newVisibleItems);
        newVisibleItems.each(setParents(null, null));
      }

      if (newExtraItems){
        newExtraItems.each(changeNavLevel(1));
        moreMenu.prepend(newExtraItems);
        newExtraItems.each(setParents(moreButton, moreMenu));
      }

      if (!hasExtraItems) moreButton.detach();
    },

    getOverflowWidths: function(){
      if (this.overflowWidths) return this.overflowWidths;

      var overflowWidths = this.overflowWidths = [];
      var navItems = this.$navItems.children();
      var moreButton = this.$moreButton.appendTo(this.$navItems);
      this.moreButtonWidth = Math.ceil(realOuterWidth(moreButton.get(0)));

      navItems.each(function(i, item){
        var navItemWidth = Math.ceil(realOuterWidth(item));
        if(isNaN(navItemWidth)){
          overflowWidths[i] = 0;
        }
        else {
          overflowWidths[i] = navItemWidth;
        }
      });

      return overflowWidths;
    }

  });
})(jQuery, _);
