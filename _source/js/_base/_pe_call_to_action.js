;(function($, global){
    $(document).on('_navigation_service:_setup', function(){
      // We need to execute this code after the ngin version of this is defined, so we can override it.
      NGIN.Modules = NGIN.Modules || {};
    
      var CTA = NGIN.Modules.CallToAction = function(opts) {
        this.url = opts.url
        this.urlIsRelative = opts.urlIsRelative
    
        this.el = $(opts.element)
        this.overlay = this.el.find('.sn-call-to-action-overlay')
        this.text = this.el.find('.sn-call-to-action-overlay-text')
        this.image = this.el.find('img')
        this.title = this.el.find('.sn-call-to-action-title')
        this.subtitle = this.el.find('.sn-call-to-action-subtitle')
        
        this.inner = this.el.find('.sn-call-to-action-overlay-inner')
        this.aspectElement = $('<span class="aspect-element" />')
        this.image.before(this.aspectElement);
        // this.el.addClass('premier-cta-option-'.concat(global.premierThemeOptions.cta))
        this.el.on('click', function gotoMainLink() {
          if (this.urlIsRelative) location.href = unescape(this.url)
          else window.open(unescape(this.url), '_blank')
        }.bind(this))
    
        this.subtitle.on('click', 'a', function cancelMainLink(e) { e.stopPropagation() })
        
        // custom setup for action variations if defined below
        var setupAction = this[opts.action + '_action'] || $.noop
        setupAction.call(this)
        
        // match height of text if it is taller
        var cta = this
        this.matchHeight = function() {
          if(!cta.el.hasClass('sn-variation-slide-up')) return
          var aspectHeight = cta.aspectElement.outerHeight();
          var overlayHeight = cta.overlay.outerHeight();
          var overlayPadding = parseInt(cta.overlay.css("padding-top"), 10) + parseInt(cta.overlay.css("padding-bottom"), 10);
          var innerHeight = cta.inner.outerHeight() + overlayPadding;
          if (aspectHeight < overlayHeight || aspectHeight < innerHeight) {
            cta.el.css('height', innerHeight + 'px').addClass('sn-variation-tall-text');
            cta.image.css('height', innerHeight + 'px');
          } else if (cta.el.hasClass('sn-variation-tall-text')){
            cta.el.css('height', '').removeClass('sn-variation-tall-text');
            cta.image.css('height', '');
          }
        }
        this.setAspectRatio = function() {
          var width = cta.image.get(0).naturalWidth;
          var height = cta.image.get(0).naturalHeight;
          var aspectRatio = ((height / width) * 100);
          cta.aspectElement.css('padding-bottom', aspectRatio + '%');
        }
        this.setAspectRatio()
        this.matchHeight()
        $(window).resize(this.matchHeight);
        $(window).load(this.matchHeight);
    
      }
      
      // Variations
    
      CTA.prototype.slide_up_action = function() {
        var cta = this
        function updateHeight() {
          var noSubMinHeight = cta.text.outerHeight() + parseInt(cta.overlay.css('padding-top'));
          var minHeight = (cta.subtitle.is(':visible')) ? cta.subtitle.position().top : noSubMinHeight
          cta.overlay.css('min-height', minHeight + 'px')
        }
  
        $(window).resize(updateHeight)
        updateHeight()
      }
    })
  })(jQuery, window);