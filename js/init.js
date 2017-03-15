(function ($) {
    "use strict"; // Start of use strict

    // jQuery for page scrolling feature - requires jQuery Easing plugin
    $('a.page-scroll').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: ($($anchor.attr('href')).offset().top - $('.navbar').outerHeight())
        }, 1250, 'easeInOutExpo');
        event.preventDefault();
    });

    // Highlight the top nav as scrolling occurs
    $('body').scrollspy({
        target: '.navbar-fixed-top',
        offset: 51
    })

    // Closes the Responsive Menu on Menu Item Click
    $('.navbar-collapse ul li a').click(function () {
        $('.navbar-toggle:visible').click();
    });

    $('body').click(function (e) {
        //e.preventDefault();
        if ($(window).width() <= 767) {
            $('.navbar-collapse').hide();
        }
    });

    $('.navbar-toggle').click(function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();
        $('.navbar-collapse').slideToggle();
    });

    $('body').click(function(){
        $('.navbar-collapse').slideUp();
    })

    // Offset for Main Navigation
    $('#mainNav').affix({
        offset: {
            top: 100
        }
    })

    $('.icon-play').click(function (e) {
        e.preventDefault();
        $('.video-modal').modal('show');
    });

    $('.video-modal').on('shown.bs.modal', function () {
        $('.video-in-modal').get(0).play();
    });

    $('.video-modal').on('hide.bs.modal', function () {
        $('.video-in-modal').get(0).pause();
    });


    $('.col-c-box').hover(function () {
        $(this).find('.overlay').fadeIn(200)
    }, function () {
        $(this).find('.overlay').fadeOut(200)
    });

    $(window).load(function (e) {
        $(window).scrollTop(0);
    });


    function addCollapse() {
        if ($(window).width() < 400) {
            $('.navbar-collapse').addClass('collapse')
        } else {
            $('.navbar-collapse').removeClass('collapse')
        }
    }

    addCollapse();
    $(window).resize(addCollapse);

})(jQuery); // End of use strict


$(document).ready(function () {
    var v_height = $(".bg-video.video-full-width").height();
    //alert(v_height);
    $("#riverview-video").css('height' , v_height);
});


$(window).resize(function () {
    var v_height = $(".bg-video.video-full-width").height();
    //alert(v_height);
    $("#riverview-video").css('height' , v_height);
});
