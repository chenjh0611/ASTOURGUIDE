jQuery(document).ready( function($){
    "use strict";

    var $body = $('body'),
        $topbar = $( document.getElementById('topbar') ),
        $header = $( document.getElementById('header') ),
        $products_sliders = $('.products-slider-wrapper, .categories-slider-wrapper'),
        $single_container = $('.fluid-layout.single-product .content');



    /***************************************
     * UPDATE CALCULATE SHIPPING SELECT
    ***************************************/

    // FIX SHIPPING CALCULATOR SHOW
    $( '.shipping-calculator-form' ).show();

    if (typeof yit_woocommerce !== 'undefined' && parseFloat(yit_woocommerce.version) < 2.3 && $.fn.selectbox ) {

        $('#calc_shipping_state').next('.sbHolder').addClass('stateHolder');

        $body.on('country_to_state_changing', function(){
            $('.stateHolder').remove();
            $('#calc_shipping_state').show().attr('sb', '');

            $('select#calc_shipping_state').selectbox({
                effect: 'fade',
                classHolder: 'stateHolder sbHolder'
            });
        });

    }

    /*************************
     * SHOP STYLE SWITCHER
     *************************/

    $('#list-or-grid').on( 'click', 'a', function() {

        var trigger = $(this),
                view = trigger.attr( 'class' ).replace('-view', '');

            $( 'ul.products li' ).removeClass( 'list grid' ).addClass( view );
            trigger.parent().find( 'a' ).removeClass( 'active' );
            trigger.addClass( 'active' );

            $.cookie( yit_shop_view_cookie, view );

            return false;
    });


    /***************************************************
     * HEADER CART
     **************************************************/

    $header.on('mouseover', '.cart_label', function(){
        $(this).next('.cart_wrapper').fadeIn(300);
    }).on('mouseleave', '.cart_label', function(){
        $(this).next('.cart_wrapper').fadeOut(300);
    });

    $header
        .on('mouseenter', '.cart_wrapper', function(){ $(this).stop(true,true).show() })
        .on('mouseleave', '.cart_wrapper',  function(){ $(this).fadeOut(300) });

    $( 'body' )
        .on('wc_fragments_refreshed', function(){

            setTimeout(function () {
                $header.find('.cart_wrapper.active').fadeOut(300);
            }, 3000);

        });

    /***************************************************
     * ADD TO CART
     **************************************************/
    var $pWrapper = new Array(),
        $i=0,
        $j=0;

    var add_to_cart = function() {

        $('ul.products').on('click', 'li.product .add_to_cart_button', function () {

            $pWrapper[$i] = $(this).parents('.product-wrapper');
            var $thumb = $pWrapper[$i].find('.thumb-wrapper');
    
            if( typeof yit.load_gif != 'undefined' ) {
                $thumb.block({message: null, overlayCSS: {background: '#fff url(' + yit.load_gif + ') no-repeat center', opacity: 0.5, cursor: 'none'}});
            }
            else {
                $thumb.block({message: null, overlayCSS: {background: '#fff url(' + woocommerce_params.ajax_loader_url.substring(0, woocommerce_params.ajax_loader_url.length - 7) + '.gif) no-repeat center', opacity: 0.3, cursor: 'none'}});
            }

            $i++;

        });
    };

    add_to_cart();
    $(document).on('yith-wcan-ajax-filtered', add_to_cart );

    $body.on('added_to_cart', function (e) {
        if (typeof $pWrapper[$j] === 'undefined' )  return;
        var $ico,
            $thumb = $pWrapper[$j].find('.thumb-wrapper');

        $ico = "<div class='added-to-cart-icon'><div class='added-to-cart'><div class='added-to-cart-text'><span>" + yit.added_to_cart_text + "</span></div></div></div>";

        $thumb.append( $ico );

        setTimeout(function () {
            $thumb.find('.added-to-cart-icon').fadeOut(2000, function () {
                $(this).remove();
            });
        }, 3000);

        $thumb.unblock();

        $j++;

    });

    /*******************************************
     * ADD TO WISHLIST
     *****************************************/

     $('ul.products, div.product div.summary').on( 'click', '.yith-wcwl-add-button a', function () {
         if( yit.load_gif != 'undefined' ) {
             $(this).block({message: null, overlayCSS: {background: '#fff url(' + yit.load_gif + ') no-repeat center', opacity: 0.3, cursor: 'none'}});
         } else {
             $(this).block({message: null, overlayCSS: {background: '#fff url(' + woocommerce_params.ajax_loader_url.substring(0, woocommerce_params.ajax_loader_url.length - 7) + '.gif) no-repeat center', opacity: 0.3, cursor: 'none'}});
         }

     });

    /*************************
     * PRODUCTS SLIDER
     *************************/

    if( $.fn.owlCarousel && $.fn.imagesLoaded && $products_sliders.length ) {
        $products_sliders.each(function(){
            var t = $(this);

            t.imagesLoaded(function(){
                var cols = t.data('columns') ? t.data('columns') : 4;
                var autoplay = (t.attr('data-autoplay')=='true') ? 3000 : false;
                var owl = t.find('.products').owlCarousel({
                    autoPlay: autoplay,
                    items : cols,
                    itemsDesktop : [1199,cols],
                    itemsDesktopSmall : [979,3],
                    itemsTablet : [768, 2],
                    itemsMobile : [481, 1],
                    stopOnHover: true
                });

                // Custom Navigation Events
                t.on('click', '.es-nav-next', function(){
                    owl.trigger('owl.next');
                });

                t.on('click', '.es-nav-prev', function(){
                    owl.trigger('owl.prev');
                });

            });
        });
    }

    /*************************
     * VARIATIONS SELECT
     *************************/

    var variations_select = function(){
        // variations select
        if( $.fn.selectbox ) {
            var form = $('form.variations_form');
            var select = form.find('select:not(.yith_wccl_custom)');

            if( form.data('wccl') ) {
                select = select.filter(function(){
                    return $(this).data('type') == 'select'
                });
            }

            select.selectbox({
                effect: 'fade',
                onOpen: function() {
                    //$('.variations select').trigger('focusin');
                }
            });

            var update_select = function(event){
                select.selectbox("detach");
                select.selectbox("attach");
            };

            // fix variations select
            form.on( 'woocommerce_update_variation_values', update_select);
            form.find('.reset_variations').on('click.yit', update_select);
        }
    };

    variations_select();

     /*************************
     * INQUIRY FORM
     *************************/

    if ( $('#inquiry-form .product-inquiry').length ) {
        $(document).on('click', '#inquiry-form .product-inquiry', function(){
            $(this).next('form.contact-form').slideToggle('slow');
        });
    }

    if( $( 'body').hasClass( 'single-product' ) ) {
        setTimeout( function() {
            if( $.trim( $( 'div.user-message').html() ) != '' || $.trim( $( '.contact-form li div.msg-error' ).text() ) != '' ) {
                $('form.contact-form').slideToggle('slow');
            }
        }, 200 );
    }

    /*************************
     * Login Form
     *************************/

  /*  $('#login-form').on('submit', function(){
        var a = $('#reg_password').val();
        var b = $('#reg_password_retype').val();
        if(!(a==b)){
            $('#reg_password_retype').addClass('invalid');
            return false;
        }else{
            $('#reg_password_retype').removeClass('invalid');
            return true;
        }
    });*/

    /*************************
     * Widget Woo Price Filter
     *************************/

    if( typeof yit != 'undefined' && ( typeof yit.price_filter_slider == 'undefined' || yit.price_filter_slider == 'no' ) ) {
        var removePriceFilterSlider = function() {
            $( 'input#min_price, input#max_price' ).show();
            $('form > div.price_slider_wrapper').find( 'div.price_slider, div.price_label' ).hide();
        };

        $(document).on('ready', removePriceFilterSlider);
    }

    /*************************
     * PRODUCT QUICK VIEW
     *************************/

    if ( $.fn.yit_quick_view && typeof yit_quick_view != 'undefined' ) {

        var yit_quick_view_init = function(){
            $('a.trigger-quick-view').yit_quick_view({

                item_container: 'li.product',
                loader: '.single-product.woocommerce',
                assets: yit_quick_view.assets,
                before: function( trigger, item ) {
                    // add loading in the button
                    if( yit.load_gif != 'undefined' ) {
                        trigger.parents( '.product-wrapper').find('.thumb-wrapper').block({message: null, overlayCSS: {background: '#fff url(' + yit.load_gif +') no-repeat center', opacity: 0.5, cursor: 'none'}});
                    }
                    else {
                        trigger.parents( '.product-wrapper').find('.thumb-wrapper').block({message: null, overlayCSS: {background: '#fff url(' + woocommerce_params.ajax_loader_url.substring(0, woocommerce_params.ajax_loader_url.length - 7) + '.gif) no-repeat center', opacity: 0.3, cursor: 'none'}});
                    }
                },
                openDialog: function( trigger, item ) {
                    // remove loading from button
                    trigger.parents( '.product-wrapper').find('.thumb-wrapper').unblock();
                },
                completed: function( trigger, item, html, overlay ) {

                    // add main class to dialog container
                    $(overlay).addClass('product-quick-view');

                    //product image slider
                    thumbanils_slider();

                    // quantity fields
                    $('div.quantity:not(.buttons_added), td.quantity:not(.buttons_added)').addClass('buttons_added').append('<input type="button" value="+" class="plus" />').prepend('<input type="button" value="-" class="minus" />');

                    variations_select();

                    // add to cart
                    $('form.cart', overlay).on('submit', function (e) {
                        e.preventDefault();

                        var form = $(this),
                            button = form.find('button'),
                            product_url = item.find('a.thumb').attr('href');

                        if( typeof yit.load_gif != 'undefined' ) {
                            button.block({message: null, overlayCSS: {background: '#fff url(' + yit.load_gif + ') no-repeat center', opacity: 0.3, cursor: 'none'}});
                        }
                        else if ( typeof( woocommerce_params.plugin_url ) != 'undefined') {
                            button.block({message: null, overlayCSS: {background: '#fff url(' + woocommerce_params.plugin_url + '/assets/images/ajax-loader.gif) no-repeat center', opacity: 0.3, cursor: 'none'}});
                        }
                        else {
                            button.block({message: null, overlayCSS: {background: '#fff url(' + woocommerce_params.ajax_loader_url.substring(0, woocommerce_params.ajax_loader_url.length - 7) + '.gif) no-repeat center', opacity: 0.3, cursor: 'none'}});
                        }

                        $.post(product_url, form.serialize() + '&_wp_http_referer=' + product_url, function (result) {
                            var message = $('.woocommerce-message', result);

                            if( typeof wc_cart_fragments_params != 'undefined') {
                                // update fragments
                                var $supports_html5_storage;

                                try {
                                    $supports_html5_storage = ( 'sessionStorage' in window && window.sessionStorage !== null );

                                    window.sessionStorage.setItem('wc', 'test');
                                    window.sessionStorage.removeItem('wc');
                                } catch (err) {
                                    $supports_html5_storage = false;
                                }

                                $.ajax({
                                    url    : wc_cart_fragments_params.wc_ajax_url.toString().replace('%%endpoint%%', 'get_refreshed_fragments'),
                                    type   : 'POST',
                                    success: function (data) {

                                        if (data && data.fragments) {

                                            $.each(data.fragments, function (key, value) {
                                                $(key).replaceWith(value);
                                            });

                                            if ($supports_html5_storage) {
                                                sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(data.fragments));
                                                sessionStorage.setItem('wc_cart_hash', data.cart_hash);
                                            }

                                            $(document.body).trigger('wc_fragments_refreshed');
                                        }
                                    }
                                });
                            }

                            // add message
                            $('div.product', overlay).before(message);

                            // remove loading
                            button.unblock();
                        });
                    });
                },
                action: 'yit_load_product_quick_view'
            });
        };

        yit_quick_view_init();

        $(document).on( 'yith-wcan-ajax-filtered', yit_quick_view_init );

    }

    var thumbanils_slider = function(){

        var $container = $('.slider-quick-view-container');
        var $slider = $container.find('.slider-quick-view');

        $slider.owlCarousel({
            autoPlay: false,
            pagination: false,
            singleItem: true,
            mouseDrag: false,
            touchDrag: false
        });

        $container.on('click', '.es-nav-next', function(){
            $slider.trigger('owl.next');
        });

        $container.on('click', '.es-nav-prev', function(){
            $slider.trigger('owl.prev');
        });

    };

    if( typeof yit != 'undefined' && ( yit.general_layout_type == 'fluid' && $single_container.length && ! YIT_Browser.isMobile() ) ) {

        var $images = $single_container.find( 'div.product div.images'),
            $summary = $single_container.find( 'div.product div.summary'),
            calc_image_width = function(){

                var $width_container = $single_container.width(),
                    $width_image = 0,
                    $width_content = 0;

                if ( $width_container < yit.single_image_width ) {

                    $images.css( 'width', '100%' );
                    $summary.css( { 'width' : '100%', 'padding-left' : '0' } );
                }
                else {

                     $width_image = ( yit.single_image_width * 100 ) / $width_container,
                     $width_content = 100 - $width_image;


                    if( $width_content > 20 ) {
                        $images.css( 'width',  $width_image + '%' );
                        $summary.css( { 'width' : $width_content + '%' , 'padding-left' : '20px' } );
                    }
                    else {
                        $images.css( 'width',  '100%' );
                        $summary.css( { 'width' : '100%', 'padding-left' : '0' } );
                    }
                }
            };

        calc_image_width();

        $(window).on( 'resize', calc_image_width );
    }


});