(function ($) {
    $(document).ready(function(){
        localStorage.lngName === 'lng-english';
        raceIconTable();
        buildRaceBand();
        buildLanguageToggle();
        languageDropdown();
        addBodyClass();
        // keepLanguageClass();
        duplicateRegButton();
        mobileDetailsToggle();
        leftRail();

    });
let raceIconTable = function () {
    let body = $('body');
    let racePage = $('.race-info-band');
    if (racePage.length) {
        body.addClass('race-page-layout');
        let table = $('.race-info-band .race-icons-table table tbody tr');
        table.each(function () {
            let type = $(this).find('td:eq(0)').text();
            if (type === 'Swim') {
                $(this).addClass('swimType');
            }
            if (type === 'Bike') {
                $(this).addClass('bikeType');
            }
            if (type === 'Run') {
                $(this).addClass('runType');
            }
            if (type === 'Avg Air Temp') {
                $(this).addClass('airTemp');
            }
            if (type === 'Avg Water Temp') {
                $(this).addClass('waterTemp');
            }
            if (type === 'Airport') {
                $(this).addClass('airportType');
            }
        });
    }
}

let buildRaceBand = function(){
    let swimType = $('.swimType');
    let bikeType = $('.bikeType');
    let runType = $('.runType');
    let airTemp = $('.airTemp');
    let waterTemp = $('.waterTemp');
    let airport = $('.airportType');
    let findTd = 'td:eq(2)';
    
    let swimText = swimType.find(findTd).text().trim().toLowerCase();
    let bikeText = bikeType.find(findTd).text().trim().toLowerCase();
    let runText = runType.find(findTd).text().trim().toLowerCase();
    let airText = airTemp.find(findTd).text().trim();
    let waterText = waterTemp.find(findTd).text().trim();
    let airportText = airport.find(findTd).text().trim();

    if (waterText != "") {
        let waterF = Number(waterText);
        var calcH2oCel = ((waterF - 32) * 5) / 9;
        var waterC = Math.round(calcH2oCel);
      } else {
        waterC = "";
      }
      if (airText != "") {
        let airF = Number(airText);
        var calcAirCel = ((airF - 32) * 5) / 9;
        var airC = Math.round(calcAirCel);
      } else {
        airC = "";
      }


    let markup = $(`<div class='race-page-info-icons'>
    <div class='swim-type ${swimText}'>
        <p>Swim<br/><b>${swimText}</b></p>
    </div>
    <div class='bike-type ${bikeText}'>
        <p>Bike<br/><b>${bikeText}</b></p>
    </div>
    <div class='run-type ${runText}'>
        <p>Run<br/><b>${runText}</b></p>
    </div>
    <div class='airTemp'>
        <p>Avg. Air Temp<br/><b>${airText}&#176; F / ${airC}&#176; C</b></p>
    </div>
    <div class='waterTemp'>
        <p>Avg. Water Temp<br/><b>${waterText}&#176; F / ${waterC}&#176; C</b></p>
    </div>
    <div class='airport'>
        <p>Airport<br/><b>${airportText}</b></p>
    </div>
</div>`);
    let target = $('.user_mode .hero-slider')
    let videoTarget = $('.user_mode .hero-video');
    let raceBand = $(`<div class='race-band active'></div>`);
    let mobileToggle = $(`<div class='race-details-toggle open'><span>Race Details</span></div>`);
    raceBand.append(markup);

    let racePage = $('.race-info-band');
    if(racePage.length){
        if(target.length){
            target.after(raceBand);
            raceBand.before(mobileToggle);
            let icons = $('.race-page-info-icons');
            let link = $('.race-info-band .linkElement').clone(true, true).removeClass('pageElement');
            icons.after(link);
        }
        if(videoTarget.length){
            videoTarget.after(raceBand);
            raceBand.before(mobileToggle);
            let icons = $('.race-page-info-icons');
            let link = $('.race-info-band .linkElement').clone(true, true).removeClass('pageElement');
            icons.after(link);
        }
    }
}

let buildLanguageToggle = function () {
    let racePage = $('.race-info-band');
    let toggle = $(`<div class='languageDropdown'><span>Select Language</span></div>`);
    let container = $(`<ul class='language-options'></ul>`);
    let dropdown = $('.race-info-band .select-language .pageElement .text ul li');
    let target = $('.race-page-info-icons');
    dropdown.each(function (i) {
        let item = $(this).text();
        className = item.replace(/\s/g, '').toLowerCase();
        let re = new RegExp("\(([^)]+)\)");
        if (re.test(className)) {
            let match = className.match(/\(([^)]+)\)/);
            // console.log(match, 'match');
            if (match !== null) {
                match = className.match(/\(([^)]+)\)/)[1];
                let markup = $(`<li key='${i + 1}' data-value='lng-${match}'>${item}</li>`);
                container.append(markup);
            } else {
                let markup = $(`<li key='${i + 1}' data-value='lng-${className}'>${item}</li>`);
                container.append(markup);
            }
        }
        toggle.append(container);
    });
    if (racePage.length) {
        target.before(toggle);
    }
}

let languageDropdown = function () {
    let body = $('body');
    let toggle = $('.languageDropdown span');
    let items = $('.languageDropdown ul li');
    toggle.on('click', function () {
        $(this).parent().toggleClass('active');
    });
    items.each(function () {
        $(this).on('click', function () {
            $(this).addClass('selected');
            let selected = $(this).attr('data-value');
            if ($(this).siblings().hasClass("selected")) {
                $(this).siblings().removeClass("selected");
            }
            toggle.parent().toggleClass('active');
            body.removeClass(function (index, classNames) {
                var current_classes = classNames.split(" "), // change the list into an array
                    classes_to_remove = []; // array of classes which are to be removed

                $.each(current_classes, function (index, class_name) {
                    // if the classname begins with bg add it to the classes_to_remove array
                    if (/lng.*/.test(class_name)) {
                        classes_to_remove.push(class_name);
                    }
                });
                // turn the array back into a string
                return classes_to_remove.join(" ");
            });

            body.addClass(selected);
            localStorage.lngName = selected;
            if(body.hasClass(selected)){
                let layoutContainer = $('.layoutContainer').not('.left-sub-nav');
                        if (layoutContainer.length) {
                            layoutContainer.each(function () {
                                if($(this).hasClass(selected)){
                                    $(this).addClass('activeLanguage')
                                }
                                else {
                                    $(this).removeClass('activeLanguage');
                                }
                            });
                        }
            }
        });
    });
}

let mobileDetailsToggle = function () {
    let toggle = $('.race-details-toggle span');
    let raceBand = $('.race-band');
    let regButton = $('.regButtonMobile');
    toggle.on('click', function () {
        $(this).parent().toggleClass('open');
        raceBand.toggleClass('active');
        if($(this).parent().hasClass('open')){
            regButton.hide();
        }
        else {
            regButton.show();
        }
    })
}
let duplicateRegButton = function(){
    let raceBand = $('.user_mode .race-band');
    let toggle = $('.user_mode .race-details-toggle')
    let toggleOpen = $('.user_mode .race-details-toggle.open');

    let regButton = $('.race-info-band .linkElement').clone(true, true).removeClass('pageElement').addClass('regButtonMobile');
    let mobile = $('.has-mobile-nav');
    if(mobile.length && raceBand.length){
        toggle.after(regButton);
    }
    if(toggleOpen.length){
        regButton.css('display', 'none');
    }
}

let addBodyClass = function () {
    let racePage = $('.race-info-band');
    let body = $('body');
    let layoutContainer = $('.layoutContainer');

    if (racePage.length) {
        body.addClass('racePage');
        layoutContainer.each(function(){
            if($(this).hasClass('lng-english')){
                $(this).addClass('activeLanguage');
            }
        });
    }


}


let leftRail = function () {
    let body = $('body');
    let racePage = $('body.user_mode.race-page-layout');
    let pageContent = $('#panelTwo');
    let leftRail = $(`<div class='leftRail'></div>`);
    let subNav = $('.left-sub-nav');
    let adColumn = $('.left-sub-nav .column').clone(true, true);
    let mobileContainer = $(`<div class='left-rail-device-container'></div>`);
    if (racePage.length) {
        body.addClass('left-rail-layout');
        leftRail.prependTo(pageContent);
        leftRail.append(subNav);

        if (leftRail.length) {
            mobileContainer.empty();
            mobileContainer.append(adColumn);
            pageContent.append(mobileContainer);
        }
    }
}

let keepLanguageClass = function(){
    let body = $('body');
    body.addClass(localStorage.lngName);

    let lng = $('.user_mode .language-options li');
    lng.each(function(){
        // console.log($(this).attr('data-value'), 'whats this');
        if($(this).attr('data-value') === localStorage.lngName){
            // console.log($(this).attr('data-value'))
            $(this).addClass('selected');
        }
    });
    let layoutContainer = $('.user_mode .layoutContainer').not('.left-sub-nav');
    if (layoutContainer.length) {
        layoutContainer.each(function () {
            if($(this).hasClass(localStorage.lngName)){
                $(this).addClass('activeLanguage')
            }
            else {
                $(this).removeClass('activeLanguage');
            }
        });
    }
}



})(jQuery);
