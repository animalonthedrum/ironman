(function ($) {

    var testimonialSlider = function () {
      var slider = $('.user_mode .testimonial-slider .column');
      var slides = $('.user_mode .testimonial-slider .column .slick-slider .slick-slide');
      slider.slick(testimonialSliderSettings());
      slides.each(function () {
        $(this).find('.pageElement').removeClass('pageElement');
      })
      splitText();
    }
    var testimonialSliderSettings = function () {
      return {
        slidesToShow: 3,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
        variableWidth: false,
        speed: 300,
        autoplay: false,
        arrows: true,
        draggable: false,
        lazyLoad: 'progressive',
        responsive: [{
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              infinite: true,
              dots: true
            }
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
        ]
      }
    }

    var splitText = function () {
      var textBlock = $('.user_mode .testimonial-slider .textBlockElement');

        textBlock.each(function () {
          var subHeadline = $(this).find('h3 span');
          var re = /\W::/;
          var term =  subHeadline.text();

          if (term.match(re) && subHeadline.length ) {
            var split = subHeadline.html().split("::", 2);
            subHeadline.parent().html(split[0] + '<p>' + split[1] + '</p>');
          }
        })
      }


      $(document).ready(function () {
        testimonialSlider();
      });

    }(jQuery));
