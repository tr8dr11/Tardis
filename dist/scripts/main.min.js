var tabletMax = 950;
var mobileMax = 767;
var mobileSmallMax = 500;
var throttle = 5;
var scrollTimeout;

$(document).ready(function() {
  var showPopupButtonsDOM = $('.js-show-popup');
  var popupsDOM = $('.js-popup');
  var popupsCloseDOM = $('.js-popup-close');
  var scrollToDOM = $('.js-scroll-to');
  var tokenCenterDOM = $('.js-token-animate');
  var contactsFormDOM = $('.js-contacts-form');
  var contactsThanksDOM = $('#js-contacts-thanks');
  var appointmentRow1DOM = $('#js-appointment-row-1');
  var appointmentRow2DOM = $('#js-appointment-row-2');
  var appointmentRow3DOM = $('#js-appointment-row-3');
  var sliders = $('.js-slider');

  function binds() {
    $(window).ready(function() {
      scrollToTop();
    })

    $(window).on('scroll', function(event){
      scroll();
    });

    $(window).on('resize', function() {
      resizeAppointment();
      sliders.each(function() {
        if ($(this).hasClass('js-slick-initialize')) {
          $(this).slick('unslick').removeClass('js-slick-initialize');
        }
      })
      setTimeout(slidersInit, 100);
    });

    showPopupButtonsDOM.on('click', function(event) {
      var popupId = $(this).data('id-popup');
      $(`#${popupId}`).fadeToggle(300);
      event.preventDefault();
    });

    popupsDOM.on('click', function(event) {
      if (!$(event.target).closest('.popup__container').length) {
        $(this).fadeToggle(300);
      }
    });

    popupsCloseDOM.on('click', function() {
      $(this).closest('.popup').fadeToggle(300);
    });

    scrollToDOM.on('click', function(event) {
      var selector = $(this).data('scroll-to');
      $('html, body').animate({ scrollTop: $(selector).offset().top }, 1000);
      event.preventDefault();
    });

    contactsFormDOM.on('submit', function(event) {
      event.preventDefault();

      var data = $(this).serialize();
      var url = $(this).attr("action");

      $.post(url, data);
      contactsFormDOM.fadeOut(300, function () {
        contactsThanksDOM.fadeIn(300);
      })
    })
  }

  function scroll() {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(function () {
        var viewportTop = $(window).scrollTop();
        var tokenCenterTop = tokenCenterDOM.offset().top;

        if (viewportTop + ($(window).height() / 1.5) >= tokenCenterTop &&
          !tokenCenterDOM.hasClass('animated')
        ) {
          tokenCenterDOM.addClass('animated');
        }

        scrollTimeout = null;
      })
    }
  }

  function resizeAppointment() {
    if (window.matchMedia('(max-width: ' + mobileMax + 'px)').matches) {
      appointmentRow1DOM.css('min-height', 'auto');
      appointmentRow2DOM.css('min-height', 'auto');

      setTimeout(function () {
        var appointmentRow1Height = appointmentRow1DOM.height();
        var appointmentRow2And3Height = appointmentRow2DOM.height() + appointmentRow3DOM.height();

        if (appointmentRow1Height > appointmentRow2And3Height) {
          appointmentRow2DOM.css('min-height', appointmentRow1Height - appointmentRow3DOM.height());
        } else {
          appointmentRow1DOM.css('min-height', appointmentRow2And3Height);
        }
      }, 1);
    }
  }

  function slidersInit() {
    var slidesToShow = 0;
    if (window.matchMedia('(max-width: ' + tabletMax + 'px)').matches) {
      slidesToShow = 2;
    }

    if (window.matchMedia('(max-width: ' + mobileSmallMax + 'px)').matches) {
      slidesToShow = 1;
    }

    if (slidesToShow) {
      sliders.each(function () {
        if (!$(this).hasClass('js-slick-initialize')) {

          const childrensDOM = $(this).children();

          $(this).slick({
            infinite: false,
            slidesToShow: slidesToShow,
            adaptiveHeight: true,
            dots: true,
          }).addClass('js-slick-initialize');

          childrensDOM.css('min-height', 'auto');

          if (slidesToShow > 1) {
            var slideMaxHeight = 0;
            childrensDOM.each(function () {
              if ($(this).height() > slideMaxHeight) {
                slideMaxHeight = $(this).height();
              }
            });

            childrensDOM.css('min-height', slideMaxHeight);
          }
        }
      })
    }
  }

  function scrollToTop() {
    $('html, body').scrollTop(0);
  }

  binds();
  resizeAppointment();
  slidersInit();
  setTimeout(scrollToTop, 1);
})
