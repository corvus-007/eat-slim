document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var $ = window.jQuery;
  var WEEKS_COUNT = 3;
  var POPUP_MODIFY_SHOW_CLASS = 'popup-calculator--open';
  var controller = new ScrollMagic.Controller();
  var scene;
  var weekNumber = window.util.getWeekNumber(new Date())[1];
  var currentWeek = (weekNumber % WEEKS_COUNT) ? (weekNumber % WEEKS_COUNT) - 1 : WEEKS_COUNT - 1;

  $.fancybox.defaults.animationEffect = 'zoom-in-out';

  $('.welcome__to-choose-tariff').on('click', function (event) {
    event.preventDefault();

    var targetSection = $(this).attr('href');
    var targetOffset = $(targetSection).offset().top;

    TweenMax.to(window, 1, {
      scrollTo: {
        y: targetOffset
      },
      ease: Power3.easeOut
    });
  });

  svg4everybody();

  var tlHeader = new TimelineLite();
  tlHeader
    .staggerFrom('.page-header__inner > *', 0.4, {
      y: -50,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.4)
    }, 0.2)
    .staggerFrom('.welcome__title, .welcome__subtitle, .welcome__text, .welcome__actions', 0.4, {
      autoAlpha: 0,
      x: 20,
      ease: Back.easeOut.config(1.4)
    }, 0.2, '-=0.4')
    .from('.welcome__dish', 0.4, {
      autoAlpha: 0,
      scale: 0.85,
      x: 100,
      ease: Back.easeOut.config(1.4)
    });


  var tlHowIt = new TimelineLite();
  tlHowIt.staggerFrom('.how-it-work__item', 0.8, {
    y: -100,
    autoAlpha: 0,
    ease: Back.easeOut.config(1.4)
  }, 0.3);
  scene = new ScrollMagic.Scene({
      triggerElement: '.how-it-work',
      reverse: false
    })
    .setTween(tlHowIt)
    .addTo(controller);


  var tlWeeklyMenu = new TimelineLite();
  tlWeeklyMenu
    .from('.tariff-menu-tabs__menu', 0.5, {
      y: 50,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.4)
    })
    .from('.weekly-menu-tabs__menu', 0.5, {
      y: 50,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.4)
    }, '-=0.3')
    .staggerFrom('.tariff-menu-tabs__pane:first-of-type .tariff-menu-set-slider__item:nth-child(' + (currentWeek + 1) + ') .weekly-menu-tabs__pane:first-of-type .menu-for-day__item', 0.5, {
      y: 50,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.4)
    }, 0.2)
    .from('.menu-for-day__footer', 0.5, {
      y: 50,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.4)
    });
  scene = new ScrollMagic.Scene({
      triggerElement: '.weekly-menu',
      reverse: false
    })
    .setTween(tlWeeklyMenu)
    .addTo(controller);


  var tlTariffPlans = new TimelineLite();
  tlTariffPlans
    .staggerFrom('.tariff-plans__item', 0.7, {
      y: 100,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.5)
    }, 0.3)
    .from('.tariff-plans__footer', 0.6, {
      y: 40,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.4)
    });
  scene = new ScrollMagic.Scene({
      triggerElement: '.tariff-plans',
      reverse: false
    })
    .setTween(tlTariffPlans)
    .addTo(controller);

  $('input[type="tel"]').mask('+7 (999) 999-99-99', {});

  $('.tariff-menu-tabs').tabslet();
  $('.weekly-menu-tabs').tabslet();

  $('.tariff-menu-set-nav-slider').each(function () {
    $(this)
      .find('.tariff-menu-set-nav-slider__item')
      .eq(currentWeek)
      .addClass('tariff-menu-set-nav-slider__item--current-week')
      .attr('title', 'Текущая неделя');
  });

  $('.tariff-menu-set-slider').each(function () {
    var $tariffMenuSetNavSlider = $(this).prev('.tariff-menu-set-nav-slider');

    $tariffMenuSetNavSlider.flickity({
      pageDots: false,
      initialIndex: currentWeek
    });

    $(this).flickity({
      asNavFor: $tariffMenuSetNavSlider[0],
      prevNextButtons: false,
      draggable: false,
      pageDots: false
    });
  });

  $('.tariff-menu-tabs').on('_after', function () {
    $('.tariff-menu-set-nav-slider').flickity('resize');
    $('.tariff-menu-set-slider').flickity('resize');
  });

  if (window.matchMedia("(max-width: 991px)").matches) {
    $('.tariff-menu-tabs, .weekly-menu-tabs').on('_after', function () {
      $('.menu-for-day-slider').flickity('resize');
    });

    $('.menu-for-day-slider').flickity({
      prevNextButtons: false,
      groupCells: '75%'
    });
  }

  $('.reviews-slider').flickity({
    wrapAround: true,
    dragThreshold: 10
  });

  function showPopup(popupSelector) {
    var popup = document.querySelector(popupSelector);
    var popupClose = popup.querySelector('.popup-calculator__close');

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = window.util.getScrollbarWidth() + 'px';
    popup.classList.add(POPUP_MODIFY_SHOW_CLASS);

    popupClose.addEventListener('click', function (event) {
      event.preventDefault();
      closePopup(popupSelector);
    });
  }

  function closePopup(popupSelector) {
    var popup = document.querySelector(popupSelector);

    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    popup.classList.remove(POPUP_MODIFY_SHOW_CLASS);
  }

  var formCalculator = document.querySelector('.form-calculator');
  var FORM_CALCULATOR_CONTROLS_SELECTOR = '[data-calculator-role="control"]';
  var FORM_CALCULATOR_OUTPUT_SELECTOR = '[data-calculator-role="output"]';

  $('[data-popup-target]').on('click', function (event) {
    event.preventDefault();
    var popupTargetSelector = this.dataset.popupTarget;
    if (formCalculator) {
      showPopup(popupTargetSelector);
    }
  });
});
