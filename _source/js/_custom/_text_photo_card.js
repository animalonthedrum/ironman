(function($){

// Refactor textblock element for custom structure
  let textPhotoCardRefactor = function(){

    var textBlockEl = $('.text-photo-card .textBlockElement');

    textBlockEl.each(function(){
      var elImage = $(this).find('.leftTextImage, .rightTextImage');
      var elText = $(this).find('.text');
      var elTitle = $(this).find('h3:first-of-type');

      if (elImage){
        elText.prepend(elTitle);
      }
    });
  };

  // let upcomingCards = function(){
  //   let card = $('.user_mode .upcoming-card .pageElement');
  //   let target = $('.user_mode .upcoming-card .pageElement .text');
  //   if (card.length){
  //     card.each(function(){
  //       let date = $(this).find('>h3:first-child');
  //       let span = $(this).find('>h3:first-child span');
  //       let text = $(this).find('.text');
  //       let link = $(this).find('.leftTextImage.originalTextImage a');
  //       let href = link.attr('href');
  //       let target = link.attr('target');
  //       let wrapper = $(`<div class='text-wrapper'></div>`);
  //       if(date.length && text.length){
  //         text.wrap(wrapper);
  //         text.before(date);
  //         let height = text.outerHeight();
  //         let top = span.outerHeight();
  //         height = -(height + top);
  //         date.css('top', height );
  //         if(link.length){
  //           wrapper = $(`<div class='text-wrapper'><a href=${href}></a></div>`);
  //           text.wrap(wrapper);
  //         }
  //       }
     
  //     })
  //   }
  // }

  let featuredCards = function(){
    let card = $('.featured-card .pageElement');
    if (card.length){
      card.each(function(){
        let text = $(this).find('.text');
        let link = text.find('div');
        if(link.length){
          link.addClass('linkText');
          text.after(link);
        }
        else {
          let photoLink = $(this).find('.leftTextImage.originalTextImage a');
          if(photoLink.length){
            let photoHref = photoLink.attr('href');
          let photoTarget = photoLink.attr('target');
            let linkWrapper = $(`<div class='linkText'><a href=${photoHref} target=${photoTarget}>See Race Details</a></div>`);
            text.after(linkWrapper);
          }

        }
      })
    }
  }
  let upcomingCards = function(){
    let card = $('.upcoming-card .pageElement');
    if (card.length){
      card.each(function(){
        let text = $(this).find('.text');
        let link = $(this).find('.leftTextImage.originalTextImage a');
        let href = link.attr('href');
        let target = link.attr('target');
        let wrapper = $(`<div class='text-wrapper'></div>`);
        if(link.length){
          wrapper = $(`<div class='text-wrapper'><a href=${href}></a></div>`);
          text.wrap(wrapper);
        }
      })
    }
  }

  $(document).ready(function(){
    textPhotoCardRefactor();
    upcomingCards();
    featuredCards();
  });

})(jQuery);