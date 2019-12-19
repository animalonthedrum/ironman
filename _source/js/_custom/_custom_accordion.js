(function ($) {
    $(document).ready(function () {
        accordionPanel();
        accordionContainer();
    });
    $(document).on('instantiated.tab', function(){
        let accordion = $('.tabbedElement .accordion h3')
        if(accordion.length){
            accordionPanel();
        }
      });

    let accordionPanel = function () {
        let allPanels = $('.accordion .text').hide();

        let accordion = $('.accordion h3')
        accordion.on('click', function () {
            $this = $(this);
            $target = $this.next();

            accordion.removeClass('open');
            if ($target.hasClass('active')) {
                $target.removeClass('active').slideUp(300 );
            } else {
                allPanels.removeClass('active').slideUp(300);
                $target.addClass('active').slideDown(300);
                $(this).toggleClass('open');
            }


            return false;
        });
    }

    let accordionContainer = function () {
        let title = $('.user_mode .accordion-container .accordion-container-title');
        title.each(function(){
            let accordion = $('<div class="accordion-header"></div>');
            let parent = $(this).parent();
            let text = $(this).find('h3 span');
            accordion.append(text);
            parent.before(accordion);
            
            let allColumns = accordion.nextUntil('.layoutContainer')
            allColumns.hide();
            accordion.on('click', function(){
                $this = $(this);
                $target = $(this).nextUntil('.layoutContainer');
    
                accordion.removeClass('open');
                if ($target.hasClass('active')) {
                    $target.removeClass('active').slideUp(300 );
                } else {
                    allColumns.removeClass('active').slideUp(300);
                    $target.addClass('active').slideDown(300);
                    $(this).toggleClass('open');
                }
                
                return false;
            });
        });
    }

})(jQuery);