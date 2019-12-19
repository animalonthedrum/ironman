(function ($) {
  $(document).on("ready", function () {
    createDiv();
  });

  const createDiv = function () {
    $(".race-results column").append('<div class="race-result-list"></div>');
    runCustomSearch(".race-results", "1yLtxUETnuF3UZLmypYkAK6Vj4PE9Fo_BT-WsA4oE_YU", "AIzaSyC9s2sNhwUZOUXJfnyt-cD4k4nUyY-3HBs", "Race-Catalog"); //production
    // runCustomSearch(".race-result-list","1yLtxUETnuF3UZLmypYkAK6Vj4PE9Fo_BT-WsA4oE_YU","AIzaSyC9s2sNhwUZOUXJfnyt-cD4k4nUyY-3HBs","Test-Catalog"); //testing
  };



  const runCustomSearch = function (targetSearch, sheetId, apiKey, sheetTab) {
    // Global Variables

    const body = $("body");
    const filterOne = [];
    const filterTwo = [];
    const filterThree = [];
    const sortedSeriesOrder = [];
    const newMonthArray = [];
    const northAmerica = [];
    const southAmerica = [];
    const Europe = [];
    const Africa = [];
    const Asia = [];
    const Oceania = [];
    const resultsList = [];
    let raceSearch = targetSearch === ".race-result-list";

    if ($(targetSearch).length && body.hasClass("user_mode")) {
      body.addClass("custom-search-page");

      let getSheetData = function () {
        sheetUrl = "https://sheets.googleapis.com/v4/spreadsheets/";
        sheetSettings = "/values/" + sheetTab + "?key=";
        sheetUrl = sheetUrl + sheetId + sheetSettings + apiKey;

        $.ajax({
          type: "GET",
          url: sheetUrl,
          dataType: "html",
          success: function (sheetData) {
            sheetData = $.parseJSON(sheetData);
            resultsObj(sheetData);
          },
          complete: function (cache) {
            // localStorage.setItem("outcome", JSON.stringify(resultsList));
            // var cache = JSON.parse(localStorage.outcome);
            buildForm();
            buildDropdowns(resultsList);
            sortByMonth(filterTwo);
            sortSeries(filterOne);
            buildListOptions(sortedSeriesOrder, ".raceDropdown ul");
            buildListOptions(newMonthArray, ".dateDropdown ul");
            buildListOptionsRegion(filterThree, ".regionDropdown .regionOptions");
            regionFilter(resultsList);
            addContinentClick();
            filterSort(resultsList);
            filterChange(resultsList);
            keyWordSearchFilter(resultsList);
            dropDownToggle();
            clearAll();
            mobileFilterMenu();

            preFilterPage('ironman', resultsList);
            preFilterPage('ironman-70.3', resultsList);
            preFilterPage('5150-triathlon-series', resultsList);

            preFilterPageContinent('ironman', 'North America', resultsList, '/im-north-america');
            preFilterPageContinent('ironman-70.3', 'North America', resultsList, '/im703-north-america');
            preFilterPageContinent('ironman', 'South America', resultsList, '/im-south-america');
            preFilterPageContinent('ironman-70.3', 'South America', resultsList, '/im703-south-america');
            preFilterPageContinent('ironman', 'Asia', resultsList, '/im-asia');
            preFilterPageContinent('ironman-70.3', 'Asia', resultsList, '/im703-asia');
            preFilterPageContinent('ironman', 'Africa', resultsList, '/im-africa');
            preFilterPageContinent('ironman-70.3', 'Africa', resultsList, '/im703-africa');
            preFilterPageContinent('ironman', 'Europe', resultsList, '/im-europe');
            preFilterPageContinent('ironman-70.3', 'Europe', resultsList, '/im703-europe');
            preFilterPageContinent('ironman', 'Oceania', resultsList, '/im-oceania');
            preFilterPageContinent('ironman-70.3', 'Oceania', resultsList, '/im703-oceania');

            preFilterPageContinent('5150-triathlon-series', 'Asia', resultsList, '/5150-asia');
            preFilterPageContinent('5150-triathlon-series', 'Europe', resultsList, '/5150-europe');
            preFilterPageContinent('5150-triathlon-series', 'North America', resultsList, '/5150-north-america');
            preFilterPageContinent('5150-triathlon-series', 'South America', resultsList, '/5150-south-america');
            preFilterPageContinent('5150-triathlon-series', 'Africa', resultsList, '/5150-africa');
            // **Not Used - no races in these continents
            // preFilterPageContinent('5150-triathlon-series', 'Oceania', resultsList, '/5150-oceania');
           

          },
          error: function () {
            alert("Data could not be retrieved.");
          }
        });
      };
      getSheetData();

      let buildForm = function () {
        let nextPageButton = $(`<button class='nextPageButton'>Next Page</button>`);
        let prePageButton = $(`<button class='prePageButton'>Prev Page</button>`);
        let paginationButtonContainer = $(`<div class='paginationButtons'></div>`);
        let list = $('.race-result-list');
        let closeContainer = $(`<div class='close-container'><p class='select-filters'>Select Filters</p><button class='close-filters'></button></div>`);
        let mobileFilters = $(`<div class='mobileFilterButton'><p>Filters</p></div>`);
        let searchForm = $(
          `<div class='user-options'>
          <div class='custom-search-form'>
          <div class='keyword-container'>
          <input type='text' name='keyword' value='' placeholder='Search by keyword' id="custom-search-keyword"></input>
          <button type='submit' value='' class='custom-search-submit'></button>
          </div>
          </div>
          <div class='custom-search-utilities'><div class='user-selected-filters'><p class='raceCrumb'></p><p class='continentCrumb'></p><p class='regionCrumb'></p><p class='dateCrumb'></p></div>
          <div class='clear-all'><button class='clearAllFilters' type='button' value='clear'>Clear All</button></div>
          </div></div><div class='no-results'><h3></h3></div>`
        );
        var target = $(".hero-slider");
        if (target.length) {
          target.after(searchForm);
          searchForm.prepend(closeContainer);
          target.after(mobileFilters);
          paginationButtonContainer.append(prePageButton, nextPageButton);
          list.after(paginationButtonContainer);
        }
      }; //end build form


      let buildDropdowns = function (cache) {
        var target = $(".custom-search-form");
        let raceFilter = $(`<div class='raceDropdown'>Race<ul class='seriesOptions'></ul></div>`);
        let regionFilter = $(
          `<div class='regionDropdown'>Region<ul class='regionOptions'></ul></div>`
        );
        let monthFilter = $(`<div class='dateDropdown'>Date<ul class='monthOptions'></ul></div>`);
        var wrapper = $('<div class="custom-filters"></div>');
        target.append(wrapper);
        wrapper.append(raceFilter, regionFilter, monthFilter);
      };

      let resultsObj = function (data) {
        var data = data.values;
        data.shift();
        data.map(function (data, i) {
          let result_day = data[0] != "" ? data[0] : "TBD";
          let result_month = data[1] != "" ? data[1] : "TBD";
          let result_year = data[2] != "" ? data[2] : "TBD";
          let result_series = data[3] != "" ? data[3] : "TBD";
          let result_title = data[4] != "" ? data[4] : "TBD";
          let result_continent = data[5] != "" ? data[5] : "TBD";
          let result_country = data[6] != "" ? data[6] : "TBD";
          let result_city = data[7] != "" ? data[7] : "TBD";
          let result_titleSponsor = data[8] != "" ? "Sponsored by " + data[8] : "";
          let result_presentedSponsor = data[9] != "" ? "Presented by " + data[9] : "";
          let result_status = data[10] != "" ? data[10] : "TBD";
          let result_swimType = data[11] != "" ? data[11] : "TBD";
          let result_bikeType = data[12] != "" ? data[12] : "TBD";
          let result_runType = data[13] != "" ? data[13] : "TBD";
          let result_airTempF = data[14] != "" ? data[14] : NaN;
          let result_h20TempF = data[15] != "" ? data[15] : NaN;
          let result_airport = data[16] != "" ? data[16] : "TBD";
          let result_eventLink = data[17] != "" ? data[17] : "#";
          let result_image = data[18] != "" ? data[18] : "";
          let result_worldChampionship = data[19] != "" ? data[19] : "";
          let key = i;


          if (result_day === '00' || result_day === 'TBD' ) {
            result_day = '32';
          }

          if (result_h20TempF != "") {
            var calcH2oCel = ((result_h20TempF - 32) * 5) / 9;
            var h2oTempC = Math.round(calcH2oCel);
          } else {
            h2oTempC = "";
          }
          if (result_airTempF != "") {
            var calcAirCel = ((result_airTempF - 32) * 5) / 9;
            var airTempC = Math.round(calcAirCel);
          } else {
            airTempC = "";
          }

          let monthToNumber = (function (data) {
            switch (data) {
              case "January":
                return "01";
              case "February":
                return "02";
              case "March":
                return "03";
              case "April":
                return "04";
              case "May":
                return "05";
              case "June":
                return "06";
              case "July":
                return "07";
              case "August":
                return "08";
              case "September":
                return "09";
              case "October":
                return "10";
              case "November":
                return "11";
              case "December":
                return "12";
              case "TBD":
                return "13";
              case Infinity:
                return Infinity;
              default:
                return "";
            }
          })(result_month);

          let monthToAbv = (function (data) {
            switch (data) {
              case "January":
                return "Jan";
              case "February":
                return "Feb";
              case "March":
                return "March";
              case "April":
                return "April";
              case "May":
                return "May";
              case "June":
                return "June";
              case "July":
                return "July";
              case "August":
                return "Aug";
              case "September":
                return "Sept";
              case "October":
                return "Oct";
              case "November":
                return "Nov";
              case "December":
                return "Dec";
              case "TBD":
                return "TBD";
              case Infinity:
                return "TBD";
              default:
                return "";
            }
          })(result_month);

          if (!String.prototype.padStart) {
            String.prototype.padStart = function padStart(targetLength, padString) {
                targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
                padString = String(typeof padString !== 'undefined' ? padString : ' ');
                if (this.length >= targetLength) {
                    return String(this);
                } else {
                    targetLength = targetLength - this.length;
                    if (targetLength > padString.length) {
                        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
                    }
                    return padString.slice(0, targetLength) + String(this);
                }
            };
        }
          let date = Number(result_year + monthToNumber + result_day);
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, "0");
          var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
          var yyyy = today.getFullYear();
          today = Number(yyyy + mm + dd);
          var order;
          if (date - today <= -1) {
            order = Infinity;
            result_day = "TBD";
            result_month = "TBD";
            result_year = "";
            monthToAbv = "";
          } else {
            order = date - today;
          }
          // Create Result  Object Variables
          let raceResultObj = {
            key: key,
            day: result_day,
            month: result_month,
            year: result_year,
            series: result_series,
            title: result_title,
            location: [result_continent, result_country, result_city],
            continent: result_continent,
            country: result_country,
            city: result_city,
            titleSponsor: result_titleSponsor,
            presentedSponsor: result_presentedSponsor,
            status: result_status,
            swim: result_swimType,
            bike: result_bikeType,
            run: result_runType,
            water: result_h20TempF,
            waterC: h2oTempC,
            air: result_airTempF,
            airC: airTempC,
            airport: result_airport,
            eventLink: result_eventLink,
            image: result_image,
            worldChampionship: result_worldChampionship,
            newDate: new Date(result_year, monthToNumber, result_day),
            date: date,
            order: order,
            monthAbv: monthToAbv,
          };

          resultsList.push(raceResultObj);
          filterOne.push(raceResultObj.series);
          filterOne.sort();
          filterTwo.push(raceResultObj.month);
          filterThree.push(raceResultObj.continent);
          filterThree.sort();

        }); //end of map
      }; //end of result object

      let filterChange = function (data) {
        let select = $(".custom-search-form .custom-filters ul");
        select.on("click", function (e) {
          let input = $('#custom-search-keyword');
          let keyword = $('#custom-search-keyword').val();
          let seriesValue = $(".raceDropdown .selected").attr("data-value");
          let continentValue = $(".regionDropdown .regionOptions ul .continentTitle.selected").text();
          let dateValue = $(".dateDropdown .selected").text();
          let countryValue = $(".regionDropdown .regionOptions ul .selected:not(.continentTitle)").text();
          let noResults = $('.no-results h3');
          let paginationView = $('.paginationView');
          getFilterValues(data, seriesValue, continentValue, countryValue, dateValue);
          if (keyword !== '') {
            input.addClass('active');
            // event.preventDefault();
            result = data.filter(function (obj) {
              keyword = keyword.toLowerCase();
              if(obj.bike === undefined || obj.bike === ''){
                obj.bike = 'TBD'
              }
              if(obj.day === undefined || obj.day === ''){
                obj.day = 'TBD'
              }
              if(obj.city === undefined || obj.city === ''){
                obj.city = 'TBD'
              }
              if(obj.country === undefined || obj.country === ''){
                obj.country = 'TBD'
              }
              if(obj.continent === undefined || obj.continent === ''){
                obj.continent = 'TBD'
              }
              if(obj.month === undefined || obj.month === ''){
                obj.month = 'TBD'
              }
              if(obj.monthAbv === undefined || obj.monthAbv === ''){
                obj.monthAbv = 'TBD'
              }
              if(obj.run === undefined || obj.run === ''){
                obj.run = 'TBD'
              }
              if(obj.series === undefined || obj.series === ''){
                obj.series = 'TBD'
              }
              if(obj.status === undefined || obj.status === ''){
                obj.status = 'TBD'
              }
              if(obj.swim === undefined || obj.swim === ''){
                obj.swim = 'TBD'
              }
              if(obj.title === undefined || obj.title === ''){
                obj.title = 'TBD'
              }
              if(obj.year === undefined || obj.year === ''){
                obj.year = 'TBD'
              }
              return (
                obj.bike.toLowerCase().indexOf(keyword) >=0||
                obj.day.toLowerCase().indexOf(keyword) >=0||
                obj.city.toLowerCase().indexOf(keyword) >=0||
                obj.country.toLowerCase().indexOf(keyword) >=0||
                obj.continent.toLowerCase().indexOf(keyword) >=0||
                obj.month.toLowerCase().indexOf(keyword) >=0||
                obj.monthAbv.toLowerCase().indexOf(keyword) >=0||
                obj.run.toLowerCase().indexOf(keyword) >=0||
                obj.series.toLowerCase().indexOf(keyword) >=0||
                obj.status.toLowerCase().indexOf(keyword) >=0||
                obj.swim.toLowerCase().indexOf(keyword) >=0||
                obj.title.toLowerCase().indexOf(keyword) >=0||
                obj.year.toLowerCase().indexOf(keyword) >=0
                );
            });
            getFilterValues(result, seriesValue, continentValue, countryValue, dateValue);
            filterSort(result);

            if (result.length === 0) {
              noResults.text('OH NO! Looks like you took a wrong turn!');
              body.addClass('noResultsFound');
              let viewAll = $('<div><p>Please adjust your search and try again.</p><button class="viewAll">View All Races</button></div>');
              noResults.append(viewAll);
              let button = $('.viewAll');
              let selected = $(".custom-filters div ul li");
              let breadCrumbs = $(".user-selected-filters");
              button.on('click', function () {
                body.removeClass('noResultsFound');
                selected.each(function () {
                  if ($(this).hasClass("selected")) {
                    $(this).removeClass("selected");
                  }
                });
                breadCrumbs.empty();
                noResults.text('');
                input.val('');
                paginationView.detach();
                filterSort(resultsList);
              });
            }
            if (result.length >= 1) {
              noResults.text('');
              body.removeClass('noResultsFound');
            }
          }
        });
      };

      let buildMarkup = function (data) {
        var target = $(".race-result-list");
        data.forEach(function (card) {
          if (card.worldChampionship != '' && card.worldChampionship != undefined) {
            var worldChampionshipId = 'worldChampionship';
          } else {
            var worldChampionshipId = ''
          }
          if (card.day === '32') {
            card.day = 'TBD'
          }
          if (card.status === 'Sold Out') {
            var soldOut = 'soldOut';
          } else {
            soldOut = '';
          }
          if(card.swim === undefined || card.swim === ''){
            card.swim = 'TBD'
          }
          if(card.bike === undefined || card.bike === ''){
            card.bike = 'TBD'
          }
          if(card.run === undefined || card.run === ''){
            card.run = 'TBD'
          }

          let markup = $(
            `<div id='` + worldChampionshipId + `' class='race-card' key='` + card.key + `'>
            <div style="--aspect-ratio:1/1" class='race-image ` +
            card.series.toLowerCase().replace("70.3", "half").replace("5150-", '') + `'>
              <img src='` + card.image + `' role="img" aria-label="[Race Image]">
            <div class='race-date'><p class='race-month'>` +
            card.monthAbv +
            `</p><p class='race-day'>` +
            card.day +
            `</p><p class='race-year'>` +
            card.year +
            `</p></div>
            <div class='series-logo'></div></div>
            <div class='race-info'>
            <div class='race-info-details'>
            <div class='details-left'>
            <p class='race-title-sponsor'>` +
            card.titleSponsor +
            `</p><h3>` +
            card.series.replace(/-/g, " ") +
            ` ` +
            card.title +
            `</h3>
            <p>` +
            card.presentedSponsor +
            `</p>
            <p class='race-location'>` +
            card.city +
            `</p>
            </div>
            <div class='race-details-right'>
            <a href=` +
            card.eventLink +
            `>See Race Details</a>
            <p class=` + soldOut + `>` +
            card.status +
            `<p>
            </div>
            </div>
            <div class='race-info-icons'>
            <div class='swim-type ` +
            card.swim.toLowerCase() +
            `'><p>Swim <br/><b>` +
            card.swim +
            `</b></p></div>
            <div class='bike-type ` +
            card.bike.toLowerCase() +
            `'><p>Bike <br/><b>` +
            card.bike +
            `</b></p></div>
            <div class='run-type ` +
            card.run.toLowerCase() +
            `'><p>Run <br/><b>` +
            card.run +
            `</b></p></div>
            <div class='airTemp'><p>Avg. Air Temp <br/><b>` +
            card.air +
            `&#176; F / ` +
            card.airC +
            `&#176; C</b></p></div>
            <div class='waterTemp'><p>Avg. Water Temp <br/><b>` +
            card.water +
            `&#176; F / ` +
            card.waterC +
            `&#176; C</b></p></div>
            <div class='airport'><p>Airport <br/><b>` +
            card.airport +
            `</b></p></div>
            </div>
            </div>
            </div>`
          );

          target.append(markup);
        });
        let raceImage = $('.race-image img');
        raceImage.each(function () {
          if ($(this).attr('src') === '') {
            $(this).addClass('defaultImage');
          }
        })
        let card = $('.race-card');
        if(card.length){
          card.each(function(){
            if($(this).attr('id') === 'worldChampionship'){
              let image = $(this).find('.race-image');
              image.attr('style', '--aspect-ratio:3/2');
            }
          })
        }
      }; //end build markup

      let buildListOptions = function (arr, target) {
        arr = arr.reduce((unique, item) => {
          return unique.indexOf(item) >= 0 ? unique : [...unique, item];
        }, []);
        arr.map(function (li, i) {
          var listItems =
            `<li key=` + i + ` data-value='` + li + `'>` + li.replace(/-/g, " ") + `</li>`;
          $(target).append(listItems);
        });
      };

      let buildListOptionsRegion = function (arr, target) {
        arr = arr.reduce((unique, item) => {
          return unique.indexOf(item) >= 0 ? unique : [...unique, item];
        }, []);
        arr.map(function (li, i) {
          var listItems =
            // `<ul key=` + i + ` data-value='`+li +`' class='`+li.toLowerCase().replace(" ", "")+`'>` +li.replace("-", " ") +`</ul>`;
            `<ul key=` + i + ` data-value='` + li + `' class='` + li.toLowerCase().replace(" ", "") + `'></ul>`;
          $(target).append(listItems);
        });
      };

      let filterSort = function (data) {
        let list = $(".race-result-list");
        let count = $(".race-count");
        arr = data.filter(obj => obj.order > -1);
        arr.sort(function (a, b) {
          let dateA = a.order;
          let dateB = b.order;
          return dateA - dateB;
        });
        list.empty();
        count.remove();
        detachPageButtons();
        buildPagination(arr);

      };

      let getFilterValues = function (data, series, continent, country, month) {
        var noResults = $('.no-results h3');
        result = data.filter(function (obj) {

          if (series !== undefined) {
            return (
              series === obj.series &&
              obj.country.indexOf(country) >= 0 &&
              obj.month.indexOf(month) >= 0 &&
              obj.continent.indexOf(continent) >= 0
            );
          } else {
            return (
              obj.country.indexOf(country) >= 0 &&
              obj.month.indexOf(month) >= 0 &&
              obj.continent.indexOf(continent) >= 0
            );
          }
        });
        keyWordSearchFilter(result);
        filterSort(result);
        if (result.length === 0) {
          noResults.text('OH NO! Looks like you took a wrong turn!');
          body.addClass('noResultsFound');
          let viewAll = $('<div><p>Please adjust your search and try again.</p><button class="viewAll">View All Races</button></div>');
          noResults.append(viewAll);
          let paginationView = $('.paginationView');
          paginationView.detach();
          let button = $('.viewAll');
          let selected = $(".custom-filters div ul li");
          let breadCrumbs = $(".user-selected-filters");
          var keyword = $('#custom-search-keyword');
          button.on('click', function () {
            body.removeClass('noResultsFound');
            selected.each(function () {
              if ($(this).hasClass("selected")) {
                $(this).removeClass("selected");
              }
            });
            breadCrumbs.empty();
            noResults.text('');
            keyword.val('');
            filterSort(resultsList);
          });
        }
        if (result.length >= 1) {
          noResults.text('');
          body.removeClass('noResultsFound');
        }
      };

      let keyWordSearchFilter = function (data) {
        let submit = $('.custom-search-submit');
        let input = $('#custom-search-keyword');
        var noResults = $('.no-results h3');
        let paginationView = $('.paginationView');
        input.on('keyup', function () {
          if (input.val() !== '') {
            input.addClass('active');
            submit.addClass('active');
          }
        })
        submit.on('click', function (event) {
          event.preventDefault();
          // if(input.val() !== ''){
          //   input.toggleClass('active');
          // }
          result = data.filter(function (obj) {
            var keyword = $('#custom-search-keyword').val().toLowerCase();
            if(obj.bike === undefined || obj.bike === ''){
              obj.bike = 'TBD'
            }
            if(obj.day === undefined || obj.day === ''){
              obj.day = 'TBD'
            }
            if(obj.city === undefined || obj.city === ''){
              obj.city = 'TBD'
            }
            if(obj.country === undefined || obj.country === ''){
              obj.country = 'TBD'
            }
            if(obj.continent === undefined || obj.continent === ''){
              obj.continent = 'TBD'
            }
            if(obj.month === undefined || obj.month === ''){
              obj.month = 'TBD'
            }
            if(obj.monthAbv === undefined || obj.monthAbv === ''){
              obj.monthAbv = 'TBD'
            }
            if(obj.run === undefined || obj.run === ''){
              obj.run = 'TBD'
            }
            if(obj.series === undefined || obj.series === ''){
              obj.series = 'TBD'
            }
            if(obj.status === undefined || obj.status === ''){
              obj.status = 'TBD'
            }
            if(obj.swim === undefined || obj.swim === ''){
              obj.swim = 'TBD'
            }
            if(obj.title === undefined || obj.title === ''){
              obj.title = 'TBD'
            }
            if(obj.year === undefined || obj.year === ''){
              obj.year = 'TBD'
            }
            return (
              obj.bike.toLowerCase().indexOf(keyword) >= 0||
              obj.day.toLowerCase().indexOf(keyword) >= 0||
              obj.city.toLowerCase().indexOf(keyword) >= 0||
              obj.country.toLowerCase().indexOf(keyword) >= 0||
              obj.continent.toLowerCase().indexOf(keyword) >= 0||
              obj.month.toLowerCase().indexOf(keyword) >= 0||
              obj.monthAbv.toLowerCase().indexOf(keyword) >= 0||
              obj.run.toLowerCase().indexOf(keyword) >= 0||
              obj.series.toLowerCase().indexOf(keyword) >= 0||
              obj.status.toLowerCase().indexOf(keyword) >= 0||
              obj.swim.toLowerCase().indexOf(keyword) >= 0||
              obj.title.toLowerCase().indexOf(keyword) >= 0||
              obj.year.toLowerCase().indexOf(keyword) >= 0  
              );
          });
          paginationView.detach();
          // detachPageButtons();
          // filterChange(result);
          filterSort(result);
          if (result.length === 0) {
            noResults.text('OH NO! Looks like you took a wrong turn!');
            body.addClass('noResultsFound');
            let viewAll = $('<div><p>Please adjust your search and try again.</p><button class="viewAll">View All Races</button></div>');
            noResults.append(viewAll);
            let button = $('.viewAll');
            let selected = $(".custom-filters div ul li");
            let breadCrumbs = $(".user-selected-filters");
            var keyword = $('#custom-search-keyword');
            button.on('click', function () {
              body.removeClass('noResultsFound');
              selected.each(function () {
                if ($(this).hasClass("selected")) {
                  $(this).removeClass("selected");
                }
              });
              breadCrumbs.empty();
              noResults.text('');
              keyword.val('');
              paginationView.detach();
              detachPageButtons();
              filterSort(resultsList);
            });
          }
          if (result.length >= 1) {
            noResults.text('');
            body.removeClass('noResultsFound');
          }
        });
        input.on('keypress', function (event) {
          if (event.which === 13) {
            submit.click();
          }
        });
      } //end keyword

      let sortByMonth = function (arr) {
        var monthOrder = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
          "TBD"
        ];

        monthOrder.forEach(function (key) {
          var found = false;
          arr = arr.filter(function (item) {
            if (!found && item == key) {
              newMonthArray.push(item);
              found = true;
              return false;
            } else
              return true;
          })
        })
      }

      let sortSeries = function (arr) {
        var seriesOrder = [
          "IRONMAN",
          "IRONMAN-70.3",
          "5150-Triathlon-Series"
        ];
        seriesOrder.forEach(function (key) {
          var found = false;
          arr = arr.filter(function (item) {
            if (!found && item == key) {
              sortedSeriesOrder.push(item);
              found = true;
              return false;
            } else
              return true;
          })
        })
      }

      let dropDownToggle = function () {

        const raceCrumb = $(".user-selected-filters .raceCrumb");
        const regionCrumb = $(".user-selected-filters .regionCrumb");
        const dateCrumb = $(".user-selected-filters .dateCrumb");

        var select = $(".custom-filters div");
        select.on('click', function (e) {
          e.stopPropagation();
          $(this)
            .toggleClass("active")
            .siblings()
            .removeClass("active");
          body.on('click', function () {
            select.removeClass('active');
          });
        });

        var regionItem = $(".custom-filters .regionDropdown .regionOptions ul");
        regionItem.each(function () {
          $(this).on('click', 'li', function (event) {
            var $target = $(event.target);
            $target.addClass('selected').siblings().removeClass('selected');
            $target.parent().siblings().children().removeClass('selected');
            if ($target.hasClass("selected")) {
              var text = $target.text();
              regionCrumb.text(text + " /");
            }
          })
        })

        var raceItem = $(".custom-filters .raceDropdown ul li");
        raceItem.on('click', function () {
          $(this)
            .addClass("selected")
            .siblings()
            .removeClass("selected");
          if ($(this).hasClass("selected")) {
            var text = $(this).text();
            raceCrumb.text(text + " / ");
          }
        });

        var dateItem = $(".custom-filters .dateDropdown ul li");
        dateItem.on('click', function () {
          $(this)
            .addClass("selected")
            .siblings()
            .removeClass("selected");
          if ($(this).hasClass("selected")) {
            var text = $(this).text();
            dateCrumb.text(text);
          }
        });
      };

      let regionFilter = function (arr) {
        arr.forEach(function (data) {
          if (data.continent.indexOf('North America') >= 0) {
            if (data.country != '') {
              northAmerica.push(data.country);
            }

          }
          if (data.continent.indexOf('South America') >= 0) {
            if (data.country != '') {
              southAmerica.push(data.country);
            }
          }
          if (data.continent.indexOf('Europe') >= 0) {
            if (data.country != '') {
              Europe.push(data.country);
            }
          }
          if (data.continent.indexOf('Asia') >= 0) {
            if (data.country != '') {
              Asia.push(data.country);
            }
          }
          if (data.continent.indexOf('Africa') >= 0) {
            if (data.country != '') {
              Africa.push(data.country);
            }
          }
          if (data.continent.indexOf('Oceania') >= 0) {
            if (data.country != '') {
              Oceania.push(data.country);
            }
          }
        });

        let targetNA = $('.regionDropdown .northamerica');
        let targetSA = $('.regionDropdown .southamerica');
        let targetEU = $('.regionDropdown .europe');
        let targetOC = $('.regionDropdown .oceania');
        let targetAS = $('.regionDropdown .asia');
        let targetAF = $('.regionDropdown .africa');
        countryFilter(northAmerica, targetNA);
        countryFilter(southAmerica, targetSA);
        countryFilter(Africa, targetAF);
        countryFilter(Asia, targetAS);
        countryFilter(Europe, targetEU);
        countryFilter(Oceania, targetOC);
      }
      let countryFilter = function (arr, target) {
        let filter;
        filter = arr.reduce((unique, item) => {
          return unique.indexOf(item) >= 0 ? unique : [...unique, item];
        }, []);
        filter.sort();
        filter.map(function (li, i) {
          var country =
            `<li key=` + i + ` data-value='` + li + `'>` + li + `</li>`;
          target.append(country);
        });
      }
      let clearAll = function () {
        let clearAll = $(".clearAllFilters");
        let selected = $(".custom-filters div ul li");
        let breadCrumbs = $(".user-selected-filters p");
        let noResults = $('.no-results h3');
        var keyword = $('#custom-search-keyword');
        let paginationView = $('.paginationView');
        clearAll.on("click", function () {
          selected.each(function () {
            if ($(this).hasClass("selected")) {
              $(this).removeClass("selected");
            }
            if ($(this).hasClass("continentTitle selected")) {
              $(this).removeClass("selected")
            }
          });
          if (keyword.hasClass('active')) {
            keyword.removeClass('active');
          }
          body.removeClass('noResultsFound');
          breadCrumbs.text('');
          noResults.text('');
          keyword.val('');
          paginationView.detach();
          detachPageButtons();
          filterSort(resultsList);
          keyWordSearchFilter(resultsList);
        });
      };


      let paginator = function (items, page, per_page) {

        var page = page || 1,
          per_page = per_page || 10,
          offset = (page - 1) * per_page,

          paginatedItems = items.slice(offset).slice(0, per_page),
          total_pages = Math.ceil(items.length / per_page);
        return {
          page: page,
          per_page: per_page,
          pre_page: page - 1 ? page - 1 : null,
          next_page: (total_pages > page) ? page + 1 : null,
          total: items.length,
          total_pages: total_pages,
          data: paginatedItems
        };
      }

      let buildPagination = function (data) {
        arr = data.filter(obj => obj.order > -1);
        arr.sort(function (a, b) {
          let dateA = a.order;
          let dateB = b.order;
          return dateA - dateB;
        });
        var filterMarkup = $(".user-options");
        data = paginator(arr, 1, 15);
        let races = data.data;
        let arrayLength = data.total;
        let count = $(`<div class='race-count'><p>` + arrayLength + ` Results Found</p></div>`);
        let page = data.page;
        let totalPages = data.total_pages;
        let paginationView = $(`<p class='paginationView'>Page ` + page + ` of ` + totalPages + `</p>`);
        count.append(paginationView);
        filterMarkup.after(count);
        buildMarkup(races);

        let nextButton = $('.nextPageButton');
        let preButton = $('.prePageButton');
        let pageButtonContainer = $(`<div class='pageButtons'></div>`);
        preButton.after(pageButtonContainer);
        for (i = 1; i <= totalPages; i++) {
          let pagesButton = $(`<div class='pageNumber ` + i + `' data-value='` + i + `'>` + i + `</div>`);
          pageButtonContainer.append(pagesButton);
        }

        let pageNumber = $('.pageNumber');

        pageNumber.on('click', function () {
          let htmlBody = $("html,body");
          $(this).addClass('selected');
          $(this).siblings().removeClass('selected');
          let goToPage = $(this).attr('data-value');
          goToPage = Number(goToPage);
          let results = $('.race-result-list');
          data = paginator(arr, goToPage, 15);
          let races = data.data;
          page = data.page;
          totalPages = data.total_pages;
          paginationView.detach();
          paginationView = $(`<p class='paginationView'>Page ` + page + ` of ` + totalPages + `</p>`);
          count.append(paginationView);
          results.empty();
          buildMarkup(races);
          htmlBody.animate({
            scrollTop: results.offset().top - 350
          }, 100);
          if (data.next_page === null) {
            nextButton.addClass('hidden');
          } else {
            nextButton.removeClass('hidden');
          }
          if (data.pre_page === null) {
            preButton.addClass('hidden');
          } else {
            preButton.removeClass('hidden');
          }
        }); //end pageButton click


        nextButton.on('click', function () {
          let htmlBody = $("html,body");
          data = paginator(arr, data.next_page, 15);
          let races = data.data;
          let results = $('.race-result-list');
          results.empty();
          page = data.page;
          totalPages = data.total_pages;
          paginationView.detach();
          paginationView = $(`<p class='paginationView'>Page ` + page + ` of ` + totalPages + `</p>`);
          count.append(paginationView);
          // $('.custom-search-form').scrollTop(0);
          htmlBody.animate({
            scrollTop: results.offset().top - 350
          }, 100);
          buildMarkup(races);
          if (data.next_page === null) {
            nextButton.addClass('hidden');
          } else {
            nextButton.removeClass('hidden');
          }
          if (data.pre_page === null) {
            preButton.addClass('hidden');
          } else {
            preButton.removeClass('hidden');
          }
          if (pageNumber.hasClass('selected')) {
            pageNumber.removeClass('selected');
          }
          pageNumber.each(function () {
            let curr = $(this).attr('data-value');
            curr = Number(curr);
            if (curr === page) {
              $(this).addClass('selected');
            }
          });
        });

        preButton.on('click', function () {
          let htmlBody = $("html,body");
          data = paginator(arr, data.pre_page, 15);
          let races = data.data;
          let results = $('.race-result-list');
          results.empty();
          page = data.page;
          totalPages = data.total_pages;
          paginationView.detach();
          paginationView = $(`<p class='paginationView'>Page ` + page + ` of ` + totalPages + `</p>`);
          count.append(paginationView);
          buildMarkup(races);
          htmlBody.animate({
            scrollTop: results.offset().top - 350
          }, 100);
          if (data.next_page === null) {
            nextButton.addClass('hidden');
          } else {
            nextButton.removeClass('hidden');
          }
          if (data.pre_page === null) {
            preButton.addClass('hidden');
          } else {
            preButton.removeClass('hidden');
          }
          if (pageNumber.hasClass('selected')) {
            pageNumber.removeClass('selected');
          }
          pageNumber.each(function () {
            let curr = $(this).attr('data-value');
            curr = Number(curr);
            if (curr === page) {
              $(this).addClass('selected');
            }
          });

        });
        if (data.next_page === null) {
          nextButton.addClass('hidden');
        } else {
          nextButton.removeClass('hidden');
        }
        if (data.pre_page === null) {
          preButton.addClass('hidden');
        } else {
          preButton.removeClass('hidden');
        }
        pageNumber.each(function () {
          let curr = $(this).attr('data-value');
          curr = Number(curr);
          if (curr === page) {
            $(this).addClass('selected');
          }
        });

      } //end build pagaintion 


      let detachPageButtons = function () {
        let pageButtonContainer = $('.pageButtons');
        pageButtonContainer.detach();
      }

      let mobileFilterMenu = function () {
        let htmlBody = $("html,body");
        let button = $('.mobileFilterButton');
        let userOptions = $('.user-options');
        let mobileFilterMenu = $(`<div class='mobileFilterMenuContainer'></div>`);
        let menu = $('.mobileFilterMenuContainer');
        let closeButton = $('.close-container .close-filters');
        let results = $('.race-result-list');
        let select = $('.custom-filters ul');
        let show = $(`<button class='showAll'></button>`);
        let keyword = $('#custom-search-keyword');
        let submit = $('.custom-search-submit');
        let clearAll = $('.clearAllFilters');
        let windowHeight = $(body).innerHeight();
        mobileFilterMenu.height(windowHeight);

        button.on('click', function () {
          userOptions.wrap(mobileFilterMenu);
          window.scrollTo(0, 0);
          body.toggleClass('mobile-filter-menu-open');
          select.on('click', function () {
            let raceCount = $('.race-count p:not(.paginationView)').text();
            raceCount = raceCount.replace('Found', '');
            if (show.text() === '') {
              show.text(`Show ` + raceCount + ``);
            } else {
              show.text('');
              show.text(`Show ` + raceCount + ``);
            }

            userOptions.after(show);
          });
        });
        keyword.on('keyup', function () {
          if (keyword.val() !== '') {
            let raceCount = $('.race-count p:not(.paginationView)').text();
            raceCount = raceCount.replace('Found', '');
            if (show.text() === '') {
              show.text(`Show ` + raceCount + ``);
            } else {
              show.text('');
              show.text(`Show ` + raceCount + ``);
            }
            submit.on('click', function () {
              if (show.text() === '') {
                show.text(`Show ` + raceCount + ``);
              } else {
                show.text('');
                show.text(`Show ` + raceCount + ``);
              }
              userOptions.after(show);
            })
          }
        })

        show.on('click', function () {
          let raceCount = $('.race-count p:not(.paginationView)').text();
          body.toggleClass('mobile-filter-menu-open');
          show.detach();
          userOptions.unwrap(mobileFilterMenu);
          if (show.text() === '') {
            show.text(`Show ` + raceCount + ``);
          } else {
            show.text('');
            show.text(`Show ` + raceCount + ``);
          }
          htmlBody.animate({
            scrollTop: results.offset().top - 350
          }, 100);
        })

        closeButton.on('click', function () {
          body.toggleClass('mobile-filter-menu-open');
          show.detach();
          userOptions.unwrap(mobileFilterMenu);
          htmlBody.animate({
            scrollTop: results.offset().top - 350
          }, 100);
        });

        clearAll.on('click', function () {
          show.detach();
        });
      }


      let preFilterPage = function (filter, data) {
        filter = filter.toUpperCase();
        filter.replace(' ', '-');
        let raceCrumb = $('.user-selected-filters .raceCrumb');
        let dropdown = $('.raceDropdown .seriesOptions li');
        if (FUI.navData.name === 'IRONMAN 70.3') {
          FUI.navData.name = FUI.navData.name.replace(' ', '-');
        }
        if(FUI.navData.name === '5150 Triathlon Series'){
          FUI.navData.name = FUI.navData.name.replace(/\s/g, '-').toUpperCase();
        }
        if (FUI.navData.name === filter) {
          result = data.filter(function (obj) {
            filter = filter.toUpperCase();
            if (filter !== undefined) {
              return (
                obj.series.toUpperCase() === filter
              );
            }
          });
          if (filterOne.indexOf(filter) >= 0) {
            dropdown.each(function () {
              if ($(this).attr('data-value') === filter) {
                $(this).addClass('selected');
              }
            });
            filter = filter.replace('-', ' ');
            raceCrumb.text(filter + ' ' + '/');
          }
          keyWordSearchFilter(result);
          filterSort(result);
        }
      }


      let preFilterPageContinent = function(series, continent, data, url) {
        series = series.toUpperCase();
        series.replace(' ', '-');
        let raceCrumb = $('.user-selected-filters .raceCrumb');
        let continentCrumb = $('.user-selected-filters .regionCrumb');
        let dropdownSeries = $('.raceDropdown .seriesOptions li');
        let dropdownContinent = $('.regionDropdown .regionOptions ul li');
        if (FUI.navData.name === 'IRONMAN 70.3') {
          FUI.navData.name = FUI.navData.name.replace(' ', '-');
        }
        if(FUI.navData.name === '5150 Triathlon Series'){
          FUI.navData.name = FUI.navData.name.replace(/\s/g, '-').toUpperCase();
        }

        if (window.location.pathname === url) {
          result = data.filter(function (obj) {
            series = series.toUpperCase();
            if (series !== undefined && continent !== undefined) {
              return (
                obj.series.toUpperCase() === series &&
                obj.continent === continent
              );
            }
          });
          if (series === '5150-TRIATHLON-SERIES'){
            series = '5150-Triathlon-Series'
          }
          if (filterOne.indexOf(series) >= 0) {
            dropdownSeries.each(function () {
              if ($(this).attr('data-value') === series) {
                $(this).addClass('selected');
              }
            });
            series = series.replace('-', ' ');
            raceCrumb.text(series + ' ' + '/');
          }

          dropdownContinent.each(function(){
            if ($(this).attr('data-value') === continent) {
              $(this).addClass('selected');
            }
            continentCrumb.text(continent + ' ' + '/');
          })
          
          keyWordSearchFilter(result);
          filterSort(result);
        }
      }

      let addContinentClick = function () {
        var africa = $('.regionOptions .africa li:first-of-type');
        var item = $(`<li key='africa' data-value='Africa' class='continentTitle'>Africa</li>`);
        africa.before(item);

        var asia = $('.regionOptions .asia li:first-of-type');
        var item = $(`<li key='asia' data-value='Asia' class='continentTitle'>Asia</li>`);
        asia.before(item);

        var europe = $('.regionOptions .europe li:first-of-type');
        var item = $(`<li key='europe' data-value='Europe' class='continentTitle'>Europe</li>`);
        europe.before(item);

        var northAmerica = $('.regionOptions .northamerica li:first-of-type');
        var item = $(`<li key='north america' data-value='North America' class='continentTitle'>North America</li>`);
        northAmerica.before(item);

        var southAmerica = $('.regionOptions .southamerica li:first-of-type');
        var item = $(`<li key='south america' data-value='South America' class='continentTitle'>South America</li>`);
        southAmerica.before(item);

        var oceania = $('.regionOptions .oceania li:first-of-type');
        var item = $(`<li key='oceania' data-value='Oceania' class='continentTitle'>Oceania</li>`);
        oceania.before(item);
      }


    } //end of if
  }; //end run custom search
})(jQuery);