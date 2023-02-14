let pcscriptstring;
var preCheckoutDatalayerpush = function (label) {
    window.dataLayer.push({
        'event': 'gaEvent',
        'eventCategory': 'Pre-Checkout Layer',
        'eventAction': 'click',
        'eventLabel': label
    });
}

const getCatValforSnake = function (l, s, num) {
    let stringindex = l.indexOf(s);
    let stringlength = s.length;
    let substr = l.substring(stringindex + stringlength, stringindex + stringlength + num);
    return substr;
}

const getCatForSnake = function (catData) {
    let productCat = catData.attr('data-href');
    let val1 = getCatValforSnake(productCat, "categoryId=", 6);
    let val2 = getCatValforSnake(productCat, "catEntryId=", 7);
    let val = [val1, val2];
    return val;
}

const buildPrudsysUrl = function () {
    let url;
    let pname = $('#basket-flyout span.pname').text();
    if (pname.includes("APPLE")) {
        url = 'https://www.mediamarkt.se/rde_server/res/MMSE/recomm/PRECHECKOUT_SNAKE_APPLE/sid/';
    } else {
        url = 'https://www.mediamarkt.se/rde_server/res/MMSE/recomm/PRECHECKOUT_SNAKE/sid/';
    }

    let sid = $.cookie("MC_PS_SESSION_ID");
    let sku;
    if ($('#category.category-grid').length) {
        sku = $('.added-to-cart').attr('data-reco-pid');
        sku = 'MM' + sku;
    } else if ($('#category.category-list').length || $('#category.search-results').length) {
        sku = $('.added-to-cart').attr('data-reco-pid');
    } else {
        sku = location.pathname;
        sku = sku.substring(sku.length - 12);
        sku = 'MMSE' + sku.substr(0, 7);
    }
    url = url + sid + '?product=' + sku + '&accessory=ACCESSORY_' + sku;
    return url;
}

const buildCatentryUrl = function (pcArtList) {
    let catEntryString = "";
    for (let i = 0; i < pcArtList.length; i++) {
        if (i == 0) {
            catEntryString = catEntryString + "catEntryId=" + pcArtList[i];
        } else {
            catEntryString = catEntryString + "&catEntryId=" + pcArtList[i];
        }
    }

    let url = "https://www.mediamarkt.se/webapp/wcs/stores/servlet/MultiChannelCMSCatalogEntriesJson?" + catEntryString;
    return url;
}


function checkEnergyInfo(features){
    let energyInfo;
    if(features['Energideklaration (EU 2017/1369)']){
      energyInfo = {"new": true, "value": features['Energideklaration (EU 2017/1369)'][0].featureValue};
    }
    else if(features.Energideklaration[2]){
      energyInfo = {"new": false, "value": features.Energideklaration[2].featureValue};
    }
    return energyInfo
  }

  //GENERELL FUNCITONS
function checkEEC(energyLabelCall) {
    console.info(energyLabelCall);
    let energyClass;
    let energyLabel;
    if (energyLabelCall) {
      let energyClassCheck = energyLabelCall.value[0];
      if(energyLabelCall.new === true){
        switch (energyClassCheck) {
          case 'G':
            energyClass = 'energy-usage-label ee-l-47 eu2017 show';
            break;
          case 'F':
            energyClass = 'energy-usage-label ee-l-46 eu2017 show';
            break;
          case 'E':
            energyClass = 'energy-usage-label ee-l-45 eu2017 show';
            break;
          case 'D':
            energyClass = 'energy-usage-label ee-l-44 eu2017 show';
            break;
          case 'C':
            energyClass = 'energy-usage-label ee-l-43 eu2017 show';
            break;
          case 'B':
            energyClass = 'energy-usage-label ee-l-42 eu2017 show';
            break;
          case 'A':
            energyClass = 'energy-usage-label ee-l-41 eu2017 show';
            break;
          default:
        }
      }
      else{
        switch (energyClassCheck) {
          case 'F':
            energyClass = 'energy-usage-label ee-l-39 show';
            break;
          case 'E':
            energyClass = 'energy-usage-label ee-l-38 show';
            break;
          case 'D':
            energyClass = 'energy-usage-label ee-l-37 show';
            break;
          case 'C':
            energyClass = 'energy-usage-label ee-l-36 show';
            break;
          case 'B':
            energyClass = 'energy-usage-label ee-l-35 show';
            break;
          case 'A':
            energyClass = 'energy-usage-label ee-l-34 show';
            break;
          case 'A+':
            energyClass = 'energy-usage-label ee-l-33 show';
            break;
          case 'A++':
            energyClass = 'energy-usage-label ee-l-32 show';
            break;
          case 'A+++':
            energyClass = 'energy-usage-label ee-l-31 show';
            break;
          default:
        }
      }
  
      energyLabel = "<span class='" + energyClass + "'></span>";
    } else {
      energyLabel = "<span class='energy-usage-label'></span>";
    }
    return energyLabel;
  }

const insertSnakePc = function (prodData) {
    let rateEl;
    let eec = '';
    let featuresString = '';
    if (prodData.rating > 0) {
        let rateVal = Math.round(prodData.rating[0] * 2) / 2;
        let rateWith = rateVal / 5 * 100;
        rateEl = "<div class='rate-wrapper'><span class='rate-base'>★★★★★</span></span><span class='rate' rate='" + rateVal + "' style='width:" + rateWith + "%;'>★★★★★</span><span class='count'>(" + prodData.ratingCount + ")</span></div>";
    } else {
        rateEl = "<div class='rate-wrapper'><span class='rate'></span></div>";
    }


    if (prodData.energyEfficiency) {
        let energyLabelCall = checkEnergyInfo(prodData.features);
        eec = checkEEC(energyLabelCall)
    }

    if (prodData.features) {
        let features = prodData.features;
        for (let [key, value] of Object.entries(features)) {
            let objLength = Object.keys(value).length;
            for (let i = 0; i < objLength; i++) {
                featuresString = featuresString + '<dt>' + value[i].featureName + '</dt><dd>' + value[i].featureValue + '</dd>'
            }
        }
    }

    function replaceAll(string, search, replace) {
        return string.split(search).join(replace);
    }

    let gtmProdName = prodData.name;
    let gtmProdNameEdit = replaceAll(gtmProdName, '"', '\\\"');
    pcscriptstring = '<script>var product' + prodData.articleNumber + ' = {"name":"' + gtmProdNameEdit + '","id":"' + prodData.articleNumber + '","price":' + prodData.price.priceValue + '.00,"brand":"' + prodData.brand.brandName + '","dimension25":"InStock","dimension24":25.00};</script>';
    let prod = '<li class="folded prod">' + pcscriptstring + eec + '<img class="prod-img" data-lazy="' + prodData.image.productImageZoom + '">' + rateEl + '<h3>' + prodData.name + '</h3><div class="base-info"><div class="features nonActive"><span class="toggle ft-show">Visa teknisk specifikation</span><span class="toggle ft-hide">Dölj teknisk specifikation</span><dl>' + featuresString + '</dl></div><div class="price-w"><span class="old-p" value="' + prodData.crossedoutPriceType + '">' + prodData.oldPrice.replace(/,/g, ':') + '</span><span class="current-p">' + prodData.price.priceValue + ':-</span></div></div><div class="snakeChoise-pc"><a href="https://www.mediamarkt.se/webapp/wcs/stores/servlet/MultiChannelDisplayBasket?storeId=90952&langId=-16" class="snake-choice go-to-checkout sec-button">Gå till kassan</a><a class="add-to-cart button button-add-to-basket pri-button" data-request-url="https://www.mediamarkt.se/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAdd?storeId=90952&langId=-16&catEntryId=' + prodData.id + '&categoryId=' + prodData.categoryId + '&shippingTo=billing" data-gtm-event="EEC_ADD_TO_CART" data-gtm-event-ext="product' + prodData.articleNumber + '" data-gtm-event-aux="Precheckout - snake">Lägg till</a></div></li>';
    $('#snake_car ul').append(prod);
}

const createSnakePc = function () {
    $('#guarantee-form-in-layer').hide();
    $('.snake-pre-c-out').removeClass('snakeCar-hide');
    $('.snake-choice').hide();
    let url = buildPrudsysUrl();
    let pcArtList = [];
    let box1index = 0;
    let box2index = 0;
    let box3index = 0;
    $.get(url, function (data) {
        let prudsysLength = (data[0].STEP_Product_and_Mass_Relations.length) + (data[1].STEP_Product_and_Mass_Relations_backup.length) + (data[2].Order_Together.length);
        for (let i = 0; i < prudsysLength; i++) {
            if (i === 6) {
                break;
            } else if (data[0].STEP_Product_and_Mass_Relations[box1index] != undefined) {
                let catentryData = data[0].STEP_Product_and_Mass_Relations[box1index].SKU;
                pcArtList.push(catentryData.replace(/\D/g, ''));
                box1index++;
            } else if (data[1].STEP_Product_and_Mass_Relations_backup[box2index] != undefined) {
                let catentryData = data[1].STEP_Product_and_Mass_Relations_backup[box2index].SKU;
                pcArtList.push(catentryData.replace(/\D/g, ''));
                box2index++;
            } else if (data[2].Order_Together[box3index] != undefined) {
                let catentryData = data[2].Order_Together[box3index].SKU;
                pcArtList.push(catentryData.replace(/\D/g, ''));
                box3index++
            }
        }
        let caturl = buildCatentryUrl(pcArtList);
        $.get(caturl, function (result) {
            let objLength = Object.keys(result).length;
            if (objLength > 0) {
                $('#basket-flyout').append('<div id="snake_car"><h2>Andra köpte även</h2><ul></ul></div>')
                for (let x = 1; x <= objLength; x++) {
                    insertSnakePc(result[x]);
                }
                $('#snake_car ul').not('.slick-initialized').slick();
                $('.snakeParent-show #snake_car .slick-current[tabindex="0"] .snakeChoise-pc').css('opacity', '1');
                $('#snake_car ul .button-add-to-basket').on('click', function () {
                    let addToCartUrl = $(this).attr('data-request-url');
                    $.post(addToCartUrl);
                    let price = $(this).parents('.prod').find('.current-p').text();
                    let name = $(this).parents('.prod').find('h3').text();
                    $('.pname-cluster').append('<span class="extra-pname">+ ' + name + '</span>');
                    $('.pre-c-price').append('<span class="extra-prodPrice"> ' + price + '</span>');
                    $(this).addClass('added');
                });
                $('.toggle').on('click', function () {
                    $('.features').toggleClass('nonActive active')
                    $('#snake_car ul li').toggleClass('folded unfolded');
                })

                $('a.snake-choice.go-to-checkout').on('click', function () {
                    preCheckoutDatalayerpush('Button Go To Basket');
                });
            } else {
                $('.snakeChoise-pc').addClass('backup');
            }

        });
    });
}

const insertWarrentyData = function (warrArtList) {
    let url = buildCatentryUrl(warrArtList);
    let insuranceInfoList = [];
    let guaranteeInfoList = [];
    $.get(url, function (data) {
        const dataArray = Object.entries(data);
        for (let i = 1; i <= dataArray.length; i++) {
            let database = data[i].features.Utrustning;
            let usps = [];
            let uspString = "";
            database.forEach(function (key, index) {
                let isCorrect = database[index].featureName;
                if (isCorrect === "tjänstebeskrivning") {
                    let uspVal = database[index].featureValue;
                    usps = uspVal.split('%&;');
                }
            });
            usps.forEach(function (k, i) {
                if (k.indexOf("!!") !== -1) {
                    k = k.replace("!!", "");
                    uspString = uspString + '<li class="warrinfo">' + k + '</li>';
                } else {
                    uspString = uspString + '<li class="warrusp">' + k + '</li>';
                }
            });
            let warrInfo = {
                warrVal: data[i].id,
                warrPrice: data[i].price.priceValue,
                warrName: data[i].name,
                warrName: data[i].name.replace(/SURETHING|PLUSGARANTI/, ""),
                usps: uspString
            }
            if (data[i].name.includes("SURETHING") === true) {
                insuranceInfoList.push(warrInfo);
            } else {
                guaranteeInfoList.push(warrInfo);
            }
        }
    }).done(function () {
        let warrElsRes = "";
        let insuranceContent = "";
        let guaranteeContent = "";
        for (let i = 0; i < insuranceInfoList.length; i++) {
            let warrButtons = '<div class="snakeChoise-pc"><span class="snake-choice snake-no sec-button">Försäkra inte</span><span class="snake-choice snake-yes pri-button">Försäkra</span></div>'
            insuranceContent = insuranceContent + '<li class="warrItem" name="' + insuranceInfoList[i].warrName + '" price="' + insuranceInfoList[i].warrPrice + '" warrCatEntry="' + insuranceInfoList[i].warrVal + '"><h3 class="subwarrHeading">Lägg till vår' + insuranceInfoList[i].warrName + '</h3><ul class="warrusps">' + insuranceInfoList[i].usps + '</ul><div class="warrPrice"><span>' + insuranceInfoList[i].warrPrice + ':-</span></div>' + warrButtons + '</li>';
        }

        for (let i = 0; i < guaranteeInfoList.length; i++) {
            let warrButtons = '<div class="snakeChoise-pc"><span class="snake-choice snake-no sec-button">Nej, tack</span><span class="snake-choice snake-yes pri-button">Lägg till</span></div>'
            guaranteeContent = guaranteeContent + '<li class="warrItem" name="' + guaranteeInfoList[i].warrName + '" price="' + guaranteeInfoList[i].warrPrice + '" warrCatEntry="' + guaranteeInfoList[i].warrVal + '"><h3 class="subwarrHeading">Lägg till vår' + guaranteeInfoList[i].warrName + '</h3><ul class="warrusps">' + guaranteeInfoList[i].usps + '</ul><div class="warrPrice"><span>' + guaranteeInfoList[i].warrPrice + ':-</span></div>' + warrButtons + '</li>';
        }
        if (window.proguerantee == true) {
            warrElsRes = guaranteeContent + insuranceContent;
        } else {
            warrElsRes = insuranceContent + guaranteeContent;

        }
        $('#basket-flyout').find('#warr_car .warrlist').slick('slickAdd', warrElsRes);
    });
}

const runSnake = function () {
    $(document).off('DOMNodeInserted', '#basket-flyout');
    $('#cboxLoadedContent').addClass('snake-pre-c-out snakeCar-hide');
    let warrPar = $('#basket-flyout .premiumopts.extend-guarantee ul.cf li.cf');
    let warrLength = $(warrPar).length;
    let warrArtList = [];
    if (warrLength > 0) {
        $('<div style="width: 670px;" id="warr_car"><ul class="warrlist"></ul></div>').insertAfter('.premiumopts.extend-guarantee > h2');
        $('#basket-flyout').find('#warr_car .warrlist').not('.slick-initialized').slick();
        $('#basket-flyout .premiumopts.extend-guarantee ul.cf .opt-name').text('Villkor och ytterligare information - ');
        $('#basket-flyout .premiumopts.extend-guarantee ul.cf .more-info-toggle').text('Läs mer här');
        for (let i = 0; i < warrLength; i++) {
            let warrVal = $(warrPar).eq(i).find('span.checkbox input[type="checkbox"]').attr('value');
            warrArtList.push(warrVal);
        }
        insertWarrentyData(warrArtList);
        let prodPrice;
        if ($('#category').length) {
            prodPrice = $('.added-to-cart').find('.price').html();
        } else {
            prodPrice = $('.price-sidebar meta[itemprop="price"]').attr('content') + ":-";

        }
        $('section#basket-flyout header.cf').append('<div class="pre-c-price"><span class="prodPrice">' + prodPrice + '</span></div>');

        $('#basket-flyout').on('click', '.snake-choice.snake-no', function () {
            preCheckoutDatalayerpush('Warrenty no add');
            createSnakePc();
        });

        $('#basket-flyout').on('click', '.snake-choice.snake-yes', function () {
            let val = $('form#guarantee-form-in-layer input[name="catEntryId"]').attr('value');
            let warr = $(this).parents('.warrItem');
            let warrVal = warr.attr('warrCatEntry');
            let warrPrice = warr.attr('price');
            let warrName = warr.attr('name');
            let postURL = 'https://www.mediamarkt.se/webapp/wcs/stores/servlet/MultiChannelOrderCatalogEntryAddWarranty?storeId=90952&langId=-16&catEntryId=' + val + '&quantity=1&warrExtCatEntryId=' + warrVal + '';
            $.post(postURL, function (data) {
                $('.pname-cluster').append('<span class="warrname">+ ' + warrName + '</span>')
                $('.pre-c-price').append('<span class="warrPrice">' + warrPrice + ':-</span>');
                preCheckoutDatalayerpush('Warrenty add');
            });
            createSnakePc();
        });
    } else {
        createSnakePc();
    }

    $('.slick-slider').slick('unslick').slick('reinit').slick(); 
    console.info('slick-slider är klar');
}
$(document).ready(function () {
        $.when(runSnake()).then(
        function() {
            $('.slick-slider').slick('unslick').slick('reinit').slick();
        }
    );
    $(window).trigger('resize');

});
