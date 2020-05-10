(function($) {
    "use strict";

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div data-loader="ball-scale"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: ['animation-duration', '-webkit-animation-duration'],
        overlay: false,
        overlayClass: 'animsition-overlay-slide',
        overlayParentElement: 'html',
        transition: function(url) { window.location.href = url; }
    });

    /*[ Back to top ]
    ===========================================================*/
    let windowH = $(window).height() / 2;

    $(window).on('scroll', function() {
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display', 'flex');
        } else {
            $("#myBtn").css('display', 'none');
        }
    });

    $('#myBtn').on("click", function() {
        $('html, body').animate({ scrollTop: 0 }, 300);
    });


    /*[ Show header dropdown ]
    ===========================================================*/
    $('.js_show_header_dropdown').on('click', function() {
        $(this).parent().find('.header-dropdown')
    });

    let menu = $('.js_show_header_dropdown');
    let sub_menu_is_showed = -1;

    for (let i = 0; i < menu.length; i++) {
        $(menu[i]).on('click', function() {

            if (jQuery.inArray(this, menu) == sub_menu_is_showed) {
                $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                sub_menu_is_showed = -1;
            } else {
                for (let i = 0; i < menu.length; i++) {
                    $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
                }

                $(this).parent().find('.header-dropdown').toggleClass('show-header-dropdown');
                sub_menu_is_showed = jQuery.inArray(this, menu);
            }
        });
    }

    $(".js_show_header_dropdown, .header-dropdown").click(function(event) {
        event.stopPropagation();
    });

    $(window).on("click", function() {
        for (let i = 0; i < menu.length; i++) {
            $(menu[i]).parent().find('.header-dropdown').removeClass("show-header-dropdown");
        }
        sub_menu_is_showed = -1;
    });


    /*[ Fixed Header ]
    ===========================================================*/
    let posWrapHeader = $('.topbar').height();
    let header = $('.container-menu-header');

    $(window).on('scroll', function() {

        if ($(this).scrollTop() >= posWrapHeader) {
            $('.header1').addClass('fixed-header');
            $(header).css('top', -posWrapHeader);

        } else {
            let x = -$(this).scrollTop();
            $(header).css('top', x);
            $('.header1').removeClass('fixed-header');
        }

        if ($(this).scrollTop() >= 200 && $(window).width() > 992) {
            $('.fixed-header2').addClass('show-fixed-header2');
            $('.header2').css('visibility', 'hidden');
            $('.header2').find('.header-dropdown').removeClass("show-header-dropdown");

        } else {
            $('.fixed-header2').removeClass('show-fixed-header2');
            $('.header2').css('visibility', 'visible');
            $('.fixed-header2').find('.header-dropdown').removeClass("show-header-dropdown");
        }

    });

    /*[ 加入購物車提示 ]
    ===========================================================*/


    $('.block2_addwishlist').each(function() {
        let nameTravel = $(this).parent().parent().parent().find('.block2_name').html();
        $(this).on('click', function() {
            swal(nameTravel, "已加入喜歡清單 ! ", "success");
            swal({
                title: nameTravel,
                text: "已加入喜歡清單 ! ",
                timer: 1000,
                icon: "success",
                button: false,
            });
        });

    });


    $('.btn-addcart-product-detail').each(function() {
        let nameTravel = $('.travel-detail-name').html();
        let travelPrice = $('.block2_price').html();
        $(this).on('click', function() {
            swal({
                title: nameTravel,
                text: "已加入購物車 ! ",
                timer: 1000,
                icon: "success",
                button: false,
            });
        });
    });
    /*[ 倒數計時 ]
    ===========================================================*/
    jQuery.fn.extend({
        everyTime: function(interval, label, fn, times) {
            return this.each(function() {
                jQuery.timer.add(this, interval, label, fn, times);
            });
        },
        oneTime: function(interval, label, fn) {
            return this.each(function() {
                jQuery.timer.add(this, interval, label, fn, 1);
            });
        },
        stopTime: function(label, fn) {
            return this.each(function() {
                jQuery.timer.remove(this, label, fn);
            });
        }
    });

    jQuery.extend({
        timer: {
            global: [],
            guid: 1,
            dataKey: "jQuery.timer",
            regex: /^([0-9]+(?:\.[0-9]*)?)\s*(.*s)?$/,
            powers: {
                // Yeah this is major overkill...
                'ms': 1,
                'cs': 10,
                'ds': 100,
                's': 1000,
                'das': 10000,
                'hs': 100000,
                'ks': 1000000
            },
            timeParse: function(value) {
                if (value == undefined || value == null)
                    return null;
                let result = this.regex.exec(jQuery.trim(value.toString()));
                if (result[2]) {
                    let num = parseFloat(result[1]);
                    let mult = this.powers[result[2]] || 1;
                    return num * mult;
                } else {
                    return value;
                }
            },
            add: function(element, interval, label, fn, times) {
                let counter = 0;

                if (jQuery.isFunction(label)) {
                    if (!times)
                        times = fn;
                    fn = label;
                    label = interval;
                }

                interval = jQuery.timer.timeParse(interval);

                if (typeof interval != 'number' || isNaN(interval) || interval < 0)
                    return;

                if (typeof times != 'number' || isNaN(times) || times < 0)
                    times = 0;

                times = times || 0;

                let timers = jQuery.data(element, this.dataKey) || jQuery.data(element, this.dataKey, {});

                if (!timers[label])
                    timers[label] = {};

                fn.timerID = fn.timerID || this.guid++;

                let handler = function() {
                    if ((++counter > times && times !== 0) || fn.call(element, counter) === false)
                        jQuery.timer.remove(element, label, fn);
                };

                handler.timerID = fn.timerID;

                if (!timers[label][fn.timerID])
                    timers[label][fn.timerID] = window.setInterval(handler, interval);

                this.global.push(element);

            },
            remove: function(element, label, fn) {
                let timers = jQuery.data(element, this.dataKey),
                    ret;

                if (timers) {

                    if (!label) {
                        for (label in timers)
                            this.remove(element, label, fn);
                    } else if (timers[label]) {
                        if (fn) {
                            if (fn.timerID) {
                                window.clearInterval(timers[label][fn.timerID]);
                                delete timers[label][fn.timerID];
                            }
                        } else {
                            for (let fn in timers[label]) {
                                window.clearInterval(timers[label][fn]);
                                delete timers[label][fn];
                            }
                        }

                        for (ret in timers[label]) break;
                        if (!ret) {
                            ret = null;
                            delete timers[label];
                        }
                    }

                    for (ret in timers) break;
                    if (!ret)
                        jQuery.removeData(element, this.dataKey);
                }
            }
        }
    });

    jQuery(window).bind("unload", function() {
        jQuery.each(jQuery.timer.global, function(index, item) {
            jQuery.timer.remove(item);
        });
    });


    // 非套件
    let startDate = new Date('2020/1/15 16:26');
    let endDate = new Date('2020/1/16 16:26');
    let spantime = (endDate - startDate) / 1000;

    $(document).ready(function() {
        $(this).everyTime('1s', function(i) {
            spantime--;
            let d = Math.floor(spantime / (24 * 3600));
            let h = Math.floor((spantime % (24 * 3600)) / 3600);
            let m = Math.floor((spantime % 3600) / (60));
            let s = Math.floor(spantime % 60);

            if (spantime > 0) {
                $('.count_down_hour').text(h + (d * 24));
                $('.count_down_minute').text(m);
                $('.count_down_seconds').text(s);
            } else { // 避免倒數變成負的
                $('.count_down_hour').text(0);
                $('.count_down_minute').text(0);
                $('.count_down_seconds').text(0);
            }
        });
    });




    /*[ Show menu mobile ]
    ===========================================================*/
    $('.btn-show-menu-mobile').on('click', function() {
        $(this).toggleClass('is-active');
        $('.wrap-side-menu').slideToggle();
    });

    let arrowMainMenu = $('.arrow-main-menu');

    for (let i = 0; i < arrowMainMenu.length; i++) {
        $(arrowMainMenu[i]).on('click', function() {
            $(this).parent().find('.sub-menu').slideToggle();
            $(this).toggleClass('turn-arrow');
        })
    }

    $(window).resize(function() {
        if ($(window).width() >= 992) {
            if ($('.wrap-side-menu').css('display') == 'block') {
                $('.wrap-side-menu').css('display', 'none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }
            if ($('.sub-menu').css('display') == 'block') {
                $('.sub-menu').css('display', 'none');
                $('.arrow-main-menu').removeClass('turn-arrow');
            }
        }
    });


    /*[ remove top noti ]
    ===========================================================*/
    $('.btn-romove-top-noti').on('click', function() {
        $(this).parent().remove();
    })


    /*[ Block2 button wishlist ]
    ===========================================================*/
    $('.block2_addwishlist').on('click', function(e) {
        e.preventDefault();
        $(this).addClass('block2_cancelwishlist');
        $(this).removeClass('block2_addwishlist');
    });


    /*[ +/- num product ]
    ===========================================================*/
    $('.btn-num-product-down').on('click', function(e) {
        e.preventDefault();
        let numProduct = Number($(this).next().val());
        if (numProduct > 1) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(e) {
        e.preventDefault();
        let numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });


    /*[ Show content Product detail ]
    ===========================================================*/
    $('.active-dropdown-content .js-toggle-dropdown-content').toggleClass('show-dropdown-content');
    $('.active-dropdown-content .dropdown-content').slideToggle('fast');

    $('.js-toggle-dropdown-content').on('click', function() {
        $(this).toggleClass('show-dropdown-content');
        $(this).parent().find('.dropdown-content').slideToggle('fast');
    });


    /*[ JSON]
    ===========================================================*/
    fetch("js/products.json")
        .then(function(resp) {
            return resp.json();
        })
        .then(function(data) {
            console.log(data);
        })

})(jQuery);