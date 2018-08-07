var tabletMax = 950;
var mobileMax = 767;
var mobileSmallMax = 500;

$(document).ready(function() {
  var headerLangListDOM = $('.js-header-lang-list');
  var headerLangChoiceDOM = $('.js-header-lang-choice');
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
  var scrollListDOM = $('.js-scroll-list');
  var touchStart = 0;
  var scrollParalaxElement = null;
  var sliders = $('.js-slider');

  function binds() {
    $(window).ready(function() {
      scrollToTop();
    })

    $(window).on('wheel', function(event){
      if(event.originalEvent.deltaY > 0){
        scrollParallaxMove();
        scrollDown();
      } else {
        scrollParallaxStop();
      }
    });

    document.addEventListener('touchstart', function(event) {
      touchStart = event.touches[0].screenY;
    });

    document.addEventListener('touchmove', function(event) {
      if (event.touches[0].screenY <= touchStart) {
        scrollDown(true);
        scrollParallaxMove(true);
      } else {
        scrollParallaxStop();
      }
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

    $(document).on('click', function() {
      headerLangListDOM.removeClass('visible')
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
      event.preventDefault();

      var data = $(this).serialize();
      var url = $(this).attr("action");

      $.post(url, data);
      contactsFormDOM.fadeOut(300, function () {
        contactsThanksDOM.fadeIn(300);
      })
    })
  }

  function scrollDown(isTouch) {
    var viewportTop = $(window).scrollTop();
    var tokenCenterTop = tokenCenterDOM.offset().top;

    if (viewportTop + ($(window).height() / 1.5) >= tokenCenterTop &&
      !tokenCenterDOM.hasClass('animated')
    ) {
      tokenCenterDOM.addClass('animated');
    }

    if (window.matchMedia('(max-width: ' + tabletMax + 'px)').matches) {
      return null;
    }

    scrollListDOM.each(function() {
      var elementTop = $(this).offset().top;
      var elementHeight = $(this).height();
      var childWidth = $(this).children().width();
      var elementPosY = elementTop + elementHeight - $(window).height() + 50;

      if (viewportTop >= elementPosY &&
        childWidth > $(this).width() && !$(this).data('fixed')
      ) {
        $(this).data('fixed', 'start');
        scrollParalaxElement = $(this);
        $('body').addClass('fixed');

        if (!isTouch) {
          $('html, body').scrollTop(elementPosY);
          setTimeout(() => {
            $('html, body').scrollTop(elementPosY);
          }, 10);
        }
      }
    });
  }

  function scrollParallaxStop() {
    if (scrollParalaxElement) {
      scrollParalaxElement.removeData('fixed');
      scrollParalaxElement = null;
      $('body').removeClass('fixed');
    }
  }

  function scrollParallaxMove(isTouch) {
    if (scrollParalaxElement) {
      var stepSize = isTouch ? 20 : 50;
      var scrollLeft = scrollParalaxElement.scrollLeft();
      var childWidth = scrollParalaxElement.children().width();
      scrollParalaxElement.scrollLeft(scrollLeft + stepSize);

      if ((scrollLeft + stepSize + scrollParalaxElement.width() >= childWidth) ||
        (scrollLeft === scrollParalaxElement.scrollLeft()) &&
        scrollParalaxElement.data('fixed') === 'start'
      ) {
        scrollParalaxElement.data('fixed', 'stop');
        $('body').removeClass('fixed');
      }
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
            dots: false,
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
