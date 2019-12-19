
(function($){
    $(document).ready(function(){
        const html = $('html');
        secondaryBgSection();
        placeHolderVideo();
        homePageHero();
        // sponsorHome();
        if(html.hasClass('has-main-nav')){
                staggerFour();
                upcomingCard();
                // becomeOneSection();
                // customBackgroundSection();
                sectionThree();
                videoSection();
                // newsSection();
                homeScrollArrow();
                staggerCard();
        }

    })

let homePageHero = function(){
    let tween = TweenLite;
    let time = new TimelineLite(); 
    let heroText = '.user_mode .hero-home .video-overlay-text h3 span'
    let heroLink = '.user_mode .hero-home .video-overlay-text .text a'
   
    if(heroText.length && heroLink.length ){
        tween.fromTo(heroText, 1, {opacity:0, y:60, delay:0, ease:Power1.easeIn}, {opacity:1, visibility:'visible', y:20, delay:.4, ease:Power1.easeIn});
        tween.fromTo(heroLink, .6, {opacity:0, y:20, delay:1, ease:Power1.easeIn}, {opacity:1, y:0, delay:1.7, visibility:'visible', ease:Power1.easeOut});
    }
}

let upcomingCard = function(){
    let controller = new ScrollMagic.Controller();
    let time = new TimelineLite(); 
    let upComingCard = '.user_mode.home .upcoming-card'
    let trigger = '.user_mode.home .stagger-two';
    let tweenCards = time.staggerFrom(upComingCard, 1.5, {opacity:0, y:200, delay:.5, ease: Power1.easeIn}, 0.5);

    if(upComingCard.length && trigger.length){
        let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 250})
        .setTween(tweenCards)
        .reverse(false)
        .addTo(controller);
    }
}

let staggerCard = function(){
    let controller = new ScrollMagic.Controller();
    let time = new TimelineLite(); 
    let upComingCard = '.user_mode.home .upcoming-card'
    let trigger = '.user_mode.home .stagger';
    let tweenCards = time.staggerFromTo(upComingCard, 2, {opacity:0, y:80, visibility:'hidden'}, {opacity:1, y:0, delay:.5, visibility:'visible', ease: Power1.easeIn}, 0.75);

    if(upComingCard.length && trigger.length){
        let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenCards)
        .reverse(false)
        .addTo(controller);
    }
}
// let spotlightCard = function(){
//     let controller = new ScrollMagic.Controller();
//     let time = new TimelineLite(); 
//     let spotlightCard = '.user_mode .spotlight-container .column .spotlight-card'
//     let trigger = '.user_mode .section-1';
//     let tweenCards = time.staggerFrom(spotlightCard, 1, {opacity:0, y:200, delay:1, ease:Power1.easeIn}, 0.2);

//     if(spotlightCard.length && trigger.length){
//         let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 250})
//         .setTween(tweenCards)
//         .reverse(false)
//         .addTo(controller);
//     }

// }
let staggerFour = function(){
    let controller = new ScrollMagic.Controller();
    let time = new TimelineLite(); 
    let featuredCard = '.user_mode.home .four-cards .featured-card'
    let trigger = '.user_mode.home .stagger-four';
    let tweenCards = time.staggerFrom(featuredCard, 1.5, {opacity:0, y:200, delay:.5, ease: Circ.easeOut}, 0.5);

    if(featuredCard.length && trigger.length){
        let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 250})
        .setTween(tweenCards)
        .reverse(false)
        .addTo(controller);
    }

}

let becomeOneSection = function(){
    let controller = new ScrollMagic.Controller();
    let time = new TimelineLite(); 
    let cardLink = '.user_mode .become-section .column .card-container .become-background .textBlockElement .text p:nth-child(2) a';
    let bgLeft = '.user_mode .become-section'
    let pageEl = '.user_mode .become-section .pageEl'
    let cards = 'user_mode .become-section .card-container .pageEl'
    let trigger = '.user_mode .become-section';
    let scrollTrigger = '.user_mode .trigger-slide-left'

    
    if(cardLink.length && bgLeft.length && pageEl.length && cardLink.length ) {
        let tweenLink = TweenLite.from(cardLink, .75, {opacity:0, transformOrigin:'center center', delay:1.25});
        let tweenBg = TweenLite.from(bgLeft, .5, {transform: 'translateX(100vw)'});
        let tweenElements = TweenLite.from(pageEl, 1, {opacity:0, y:10, delay:.5});
        let tweenCards =  time.staggerFrom(cards, .5, {opacity:0, transform:'translateY(20%)', delay:1, ease:Power1.easeOut}, 0.2);
        let sceneOne = new ScrollMagic.Scene({triggerElement: scrollTrigger, duration: 300})
        .setTween(tweenBg)
        .reverse(false)
        .addTo(controller);
        
        let sceneTwo = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenElements)
        .reverse(false)
        .addTo(controller);
    
        let sceneCards = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenCards)
        .reverse(false)
        .addTo(controller);
        
        let sceneThree = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenLink)
        .reverse(false)
        .addTo(controller);
    }
}

let customBackgroundSection = function(){
    let controller = new ScrollMagic.Controller();
    let bg = '.user_mode .custom-background';
    let eventWrapper = '.user_mode .event-wrapper';
    let button = '.user_mode .event-button .linkElement';
    let link = '.user_mode .event-wrapper .pageElement .text a';

    if(bg.length && eventWrapper.length && button.length && link.length){
        let tweenElements = TweenLite.from(eventWrapper, 1, {opacity:0, y:80, delay:.25});
        let tweenLinks = TweenLite.from([button, link], .5, {opacity:0, transformOrigin:'center center', delay:.75});
        let sceneOne = new ScrollMagic.Scene({triggerElement: bg, duration: 300})
        .setTween(tweenElements)
        .reverse(false)
        .addTo(controller);
        
        let sceneTwo = new ScrollMagic.Scene({triggerElement: bg, duration: 300})
        .setTween(tweenLinks)
        .reverse(false)
        .addTo(controller);
    }

}

let sectionThree = function(){
    let time = new TimelineLite(); 
    let controller = new ScrollMagic.Controller();
    let trigger = '.user_mode .layoutContainer.promotion-card-stagger';
    let pageEl = '.user_mode .desktop-promotions .pageEl'
    let buttonTrigger = '.user_mode .desktop-promotions .pageEl .pageElement .leftTextImage.originalTextImage'
    let button = '.user_mode .promotions-card .textBlockElement .text p:last-of-type a'

    if(trigger.length && pageEl.length && button.length && buttonTrigger.length){
        let tween = time.staggerFrom(pageEl, 1.25, {opacity:0, y:100, delay:1, ease:Power1.easeOut}, 0.25);
        let buttonTween = TweenLite.from(button, .5, {opacity:0, transformOrigin:'center center', delay:.75});
        let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tween)
        .reverse(false)
        .addTo(controller);
        let sceneTwo = new ScrollMagic.Scene({triggerElement: buttonTrigger, duration: 300})
        .setTween(buttonTween)
        .reverse(false)
        .addTo(controller);
    }
}
let videoSection = function(){
    let controller = new ScrollMagic.Controller();
    let time = new TimelineLite();
    let trigger = '.user_mode .trigger-slide-right';
    let bg = '.user_mode .video-pack .column';
    let pageEl = '.user_mode .video-pack .pageEl';
    let videos = '.user_mode .video-pack .pageEl .videoElement';
    let link = '.user_mode .video-pack .column-1 .textBlockElement .text a'
    if(trigger.length && bg.length && pageEl.length){
        let tweenBg = TweenLite.from(bg, .5, {transform: 'translateX(-100vw)'});
        let tweenElements = TweenLite.from(pageEl, 1, {opacity:0, y:10, delay:.75});
        let tweenVids =  time.staggerFrom(videos, 1, {opacity:0, transform:'translateY(40px)', delay:1.5}, 0.25);
        let tweenLink =  TweenLite.from(link, .5, { transformOrigin:'center center', delay:2});
        let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenBg)
        .reverse(false)
        .addTo(controller);
        let sceneTwo = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenElements)
        .reverse(false)
        .addTo(controller);
        let sceneThree = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenVids)
        .reverse(false)
        .addTo(controller);
        let sceneFour = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenLink)
        .reverse(false)
        .addTo(controller);
    }
}

let newsSection = function(){
    let controller = new ScrollMagic.Controller();
    let time = new TimelineLite();
    let trigger = '.user_mode .section-five-trigger';
    let triggerLink = '.user_mode  .custom-card-agg .item'
    let colOne = '.user_mode .custom-news-container .pageEl .newsAggregatorElement';
    let button = '.user_mode .custom-news-container .custom-view-button'
    if(trigger.length && colOne.length && button.length){
        let tweenColOne =  time.staggerFrom(colOne, 1, {opacity:0, transform:'translateY(40px)', delay:1, ease:Power1.easeOut}, 0.25);
        let tweenLink = TweenLite.from(button, 1.25, {opacity:0, transform:'translateY(40px)', delay:3, ease:Power1.easeOut});
        let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
        .setTween(tweenColOne)
        .reverse(false)
        .addTo(controller);
        let sceneTwo = new ScrollMagic.Scene({triggerElement: triggerLink, duration: 300})
        .setTween(tweenLink)
        .reverse(false)
        .addTo(controller);
    }
}

let secondaryBgSection = function() {
    let start = $('.user_mode .layoutContainer.secondary-color-background-start');
    let end = $('.user_mode .layoutContainer.secondary-color-background-end').next();
    let wrapper =$(`<div class='secondary-color-background'></div>`);
    if(start.length){
        start.each(function(){
            $(this).nextUntil(end).andSelf().wrapAll(wrapper);
        })
    }
}

let placeHolderVideo = function(){
    let overlay = $('.user_mode .video-overlay-text .pageElement');
    let image = $('.user_mode .video-overlay-text .pageElement .leftTextImage.originalTextImage img');
    let imageSrc = image.attr('src');
    overlay.css('background-image', 'url('+imageSrc+')');
}

let homeScrollArrow = function(){
    let homeHero = $('.user_mode .hero-home');
    let scrollIndicator = $('<div class="scrollDownIndicator"><span class="loaderPulsar"></span><span class="loaderLine"></span></div>');
    homeHero.append(scrollIndicator);
    let scrollLine = $('.user_mode .scrollDownIndicator .loaderLine')
    let scrollPulsar = $('.user_mode .scrollDownIndicator .loaderPulsar')
    let tween = TweenLite;
    let time = new TimelineLite(); 
    if(scrollLine.length && scrollPulsar.length) {
        tween.from(scrollLine, 2.5, {opacity:0, scaleY:0, transformOrigin:"top", delay:2});
        tween.from(scrollPulsar, 2, {opacity:0, boxShadow:0, delay:3, ease:Power1.easeOut});
    }    
}
    // Icon 1
    let burgerMenu = function(){
        var hambTl = new TimelineLite({yoyo: true, paused: true }),
            p1 = $('.mega-menu-button svg #p1'),
            p2 = $('.mega-menu-button svg #p2'),
            p3 = $('.mega-menu-button svg #p3');
    
        hambTl
          .add('start')
          .to(p1, 1, { y: +15, ease: Power1.easeOut }, 'start')
          .to(p3, 1, { y: -15, ease: Power1.easeOut }, 'start')
          .to(p2, 0.001, {autoAlpha: 0})
          .add('rotate')
          .to(p1, 1, { transformOrigin: "50% 50%", rotation: 45,  ease: Power1.easeOut},'rotate')
          .to(p3, 1, { transformOrigin: "50% 50%", rotation: -45, ease: Power1.easeOut},'rotate');
    
          hambTl.timeScale(8);
    
        $('#item-1').click(function(){
          $('body').toggleClass('icon-1');
          if($('body').hasClass('icon-1')){
            hambTl.play();
          } else {
            hambTl.reverse();
          }
        })
    
      }

      let navExtraAnimation = function(){
          let menuButton = $('.mega-menu-button');
          let tween = TweenLite;
            menuButton.on('click', function(){
                tween.fromTo(heroText, 1, {opacity:0,visibility:'hidden', ease:Power1.easeIn}, {opacity:1, visibility:'visible', ease:Power1.easeIn});
        });
      }

      let sponsorHome = function(){
        let controller = new ScrollMagic.Controller();
        let time = new TimelineLite();
        let findTitle = $('.user_mode.home .sponsor-row .textBlockElement > h3');
        findTitle.addClass('sponsor-stagger');
        let sponsor = '.user_mode.home .sponsor-row .pageEl .heroPhotoElement'
        let trigger = '.user_mode.home .sponsor-row .sponsor-stagger';
        let tweenSponsor = time.staggerFromTo(sponsor, 2, {opacity:0, y:80, visibility:'hidden'}, {opacity:1, y:0, delay:.5, visibility:'visible', ease: Power1.easeIn}, 0.75);
    
        if(sponsor.length && trigger.length){
            let sceneOne = new ScrollMagic.Scene({triggerElement: trigger, duration: 300})
            .setTween(tweenSponsor)
            .reverse(false)
            .addTo(controller);
        }
      }


}(jQuery));

   