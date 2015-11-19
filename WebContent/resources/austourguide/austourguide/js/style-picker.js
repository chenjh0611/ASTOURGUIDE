(function ($) {

    $('.stylepicker').show();

    var body = $('body');
    var spinner = '<div id="stylepicker-spinner" class="hidden"></div>';
    var sp_wrapper = $('#stylepicker-wrapper');

    var stylepicker_init = function(){
        body.prepend(spinner);
    }

    var cookie_name = $('#cookie_name').val(),
        form = $('#style-picker'),
        head = $('head'),
        wp_colorpicker = $('.sp-color-field'),
        handler = $('.handler'),

        setcookie = function () {
            $.cookie(cookie_name, form.serialize(), { path: '/' });
        },

        change_font = function (fontelement, prefix) {
            var gFont = fontelement.val(),
                id = fontelement.attr('id'),
                selectors = $('#' + id + '-selectors').val(),
                str_to_append = '';

            if (head.find('link#' + prefix + 'Name').length < 1) {
                str_to_append += '<link id="' + prefix + 'Name" rel="stylesheet" type="text/css" href="" />';
                head.append('');
            }
            if (head.find('style#' + prefix + 'Styles').length < 1) {
                str_to_append += '<style id="' + prefix + 'Styles" type="text/css"></style>';
            }

            head.append(str_to_append);

            if ( typeof( $.cookie( cookie_name ) ) != 'undefined' ) {  // don't load google fonts on first page loading
                $('link#' + prefix + 'Name').attr({href: 'http://fonts.googleapis.com/css?family=' + gFont});
            }
            $('style#' + prefix + 'Styles').html(selectors + ' { font-family:"' + gFont + '", sans-serif !important; }');
        };

    var change_checkbox = function (opt_element, cart_element, type) {
        if (opt_element.length > 0) {

            var parallax = cart_element.parent().next();

            if (opt_element.is(':checked')) {
                var bar_height = cart_element.outerHeight();


                if (type != 'cart' && type != 'init') {
                    cart_element.toggleClass('hidden').toggleClass('visible');
                    if (parallax.length) {
                        var margin_top = parallax.css('margin-top');
                        margin_top = margin_top.replace('px', '');
                        parallax.css('margin-top', ( ( margin_top * 1 ) + ( bar_height * 1 ) ) + 'px');
                    }
                } else {
                    cart_element.css('display', 'inline-block');
                }

            } else {
                if (type != 'cart' && type != 'init') {
                    cart_element.toggleClass('hidden').toggleClass('visible');
                    if (parallax.length) {
                        var margin_top = parallax.css('margin-top');
                        margin_top = margin_top.replace('px', '');
                        parallax.css('margin-top', ( ( margin_top * 1 ) - ( bar_height * 1 ) ) + 'px');
                    }
                } else {
                    cart_element.css('display', 'none');
                }
            }
        }
    };


    $(window).on('load', function () {
        stylepicker_init();
        //setcookie();
        change_font($('#sp-titles-fonts'), 'gFontP');
        change_font($('#sp-p-fonts'), 'gFontH');
        change_checkbox($('#sp-checkboxes-cart'), $('#header .yit_cart_widget'), 'cart');
    });

    $('#style-picker').find('select').not('#sp-titles-fonts').not('#sp-p-fonts').on('change', function(){
        var spinner_id = $('#stylepicker-spinner');
        spinner_id.css('height', body.height()).toggleClass('hidden');
        handler.trigger('click');
        body.css('overflow' ,'hidden');
        setcookie();
        location.reload();
    });

    $(document).on( 'click', function(event){

        var is_outside = $(event.target).closest(sp_wrapper).length == 0 ? true : false,
            is_closed  = handler.hasClass('closed') ? true : false;

        if(  is_outside && ! is_closed ){
            handler.trigger('click');
        }
    });

    handler.on('click', function () {
        var $this = $(this);
        if ($this.hasClass('closed')) {
            $this.parent().animate({left: 0}, 300, function () {
                $(this).find('.handler').removeClass('closed');
            });
        } else {
            $this.parent().animate({left: '-322px'}, 300, function () {
                $(this).find('.handler').addClass('closed');
            });
        }
        return false;
    });

    handler.parent().delay(1000).animate({left: '-322px'}, 300, function () {
        $(this).find('.handler').addClass('closed');
    });


    $('#sp-checkboxes-topbar').on('click', function () {
        change_checkbox($('#sp-checkboxes-topbar'), $('#topbar'), 'topbar');
        setcookie();
    });

    $('#sp-checkboxes-infobar').on('click', function () {
        change_checkbox($('#sp-checkboxes-infobar'), $('#infobar'), 'infobar');
        setcookie();
    });

    $('#sp-checkboxes-header-row').on('click', function () {
        change_checkbox($('#sp-checkboxes-header-row'), $('#header-row'), 'header-row');
        setcookie();
    });

    $('#sp-checkboxes-cart').on('click', function () {
        change_checkbox($(this), $('#header').find('.yit_cart_widget'), 'cart');
        setcookie();
    });

    //change skin
    $('#sp-skins, #sp-color-skin').on('change', function () {
        var url = $(this).val();
        //setcookie();
        $.removeCookie(cookie_name, { path: '/' });
        window.location.href = url;
    });


    //change skin
    $('#sp-home-example').on('change', function () {
        var slug = $(this).val(),
            skin = $('#sp-skins').val();
        window.location.href = skin + '/' + slug;
        setcookie();
    });


    // headings font
    $('#sp-titles-fonts').on('change', function () {
        change_font($(this), 'gFontH');
        setcookie();
    });

    // paragraph font
    $('#sp-p-fonts').on('change', function () {
        change_font($(this), 'gFontP');
        setcookie();
    });

    $('#sp-reset').on('click', function () {
        $('#stylepicker-spinner').css('height', body.height()).toggleClass('hidden');
        handler.trigger('click');
        $.removeCookie(cookie_name, { path: '/' });
        location.reload();
    });

})(jQuery);