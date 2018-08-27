var tabletMax = 950;
var mobileMax = 767;
var mobileSmallMax = 500;
var throttle = 5;
var scrollTimeout;
var mainDOM = $('.main');

function resize() {
  var windowHeight = window.innerHeight;
  mainDOM.get(0).style.minHeight = windowHeight + 'px';
  mainDOM.find('> .container').get(0).style.minHeight = windowHeight + 'px';
}

resize();

$(document).ready(function() {
  var showPopupButtonsDOM = $('.js-show-popup');
  var popupsDOM = $('.js-popup');
  var popupsCloseDOM = $('.js-popup-close');
  var scrollToDOM = $('.js-scroll-to');
  var contactsFormDOM = $('.js-contacts-form');
  var contactsThanksDOM = $('#js-contacts-thanks');
  var appointmentRow1DOM = $('#js-appointment-row-1');
  var appointmentRow2DOM = $('#js-appointment-row-2');
  var appointmentRow3DOM = $('#js-appointment-row-3');
  var sliders = $('.js-slider');
  var headerLangListDOM = $('.js-header-lang-list');
  var headerLangChoiceDOM = $('.js-header-lang-choice');
  var imagesDOM = $('.js-img');
  var videoDOM = $('.js-video');

  function binds() {
    $(window).ready(function() {
      scrollToTop();
    })

    window.addEventListener('orientationchange', function() {
      resizeAppointment();
      sliders.each(function () {
        if ($(this).hasClass('js-slick-initialize')) {
          $(this).slick('unslick').removeClass('js-slick-initialize');
        }
      })
      setTimeout(slidersInit, 100);
      setImagesSrc();
    });

    $(document).on('click', function() {
      headerLangListDOM.removeClass('visible')
    });

    videoDOM.on('click', function() {
      videoInsert(true);
    });

    headerLangChoiceDOM.on('click', function(event) {
      headerLangListDOM.toggleClass('visible');
      event.stopPropagation();
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
      contactsFormDOM.fadeOut(300, function () {
        contactsThanksDOM.fadeIn(300);
      })
    })
  }

  function videoInsert(autoPlay) {
    videoDOM.addClass('played');
    var videoPlayButtonDOM = videoDOM.find('.about__video-play');
    var videoIframeDOM = videoDOM.find('iframe');
    videoIframeDOM
      .attr('src', videoIframeDOM.data('src') + (autoPlay ? '&autoplay=1' : ''));
    videoPlayButtonDOM.fadeOut(200);
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

  function setImagesSrc() {
    imagesDOM.each(function() {
      if ($(this).css('display') !== 'none') {
        $(this).attr('src', $(this).data('src'));
      }
    });
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

          var childrensDOM = $(this).children();

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
  setImagesSrc();

  if (window.matchMedia('(max-width: 1300px)').matches &&
    (/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent))
  ) {
    videoDOM.addClass('mounted');
    videoInsert(false);
  }
})
