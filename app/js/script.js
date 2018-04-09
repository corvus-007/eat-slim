document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var $ = window.jQuery;
  var POPUP_MODIFY_SHOW_CLASS = 'popup--open';
  var BODY_POPUP_SHOWED_CLASS = 'is-popup-open';
  var controller = new ScrollMagic.Controller();
  var scene;

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
    .staggerFrom('.page-header__inner > *', 0.5, {
      y: -50,
      autoAlpha: 0,
      ease: Back.easeOut.config(1.4)
    }, 0.3, 0.3)
    .staggerFrom('.welcome__title, .welcome__subtitle, .welcome__text, .welcome__actions', 0.5, {
      autoAlpha: 0,
      x: 20,
      ease: Back.easeOut.config(1.4)
    }, 0.2, '-=0.4')
    .from('.welcome__dish', 0.5, {
      autoAlpha: 0,
      scale: 0.9,
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
      offset: -150,
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
    .staggerFrom('.tariff-menu-tabs__pane:first-of-type .weekly-menu-tabs__pane:first-of-type .menu-for-day__item', 0.5, {
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
      offset: -150,
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

  if (window.matchMedia("(max-width: 991px)").matches) {
    $('.weekly-menu-tabs').on('_after', function () {
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

  function getScrollBarWidth() {
    // создадим элемент с прокруткой
    var div = document.createElement('div');

    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';

    // при display:none размеры нельзя узнать
    // нужно, чтобы элемент был видим,
    // visibility:hidden - можно, т.к. сохраняет геометрию
    div.style.visibility = 'hidden';

    document.body.appendChild(div);
    var scrollWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);

    return scrollWidth;
  }

  function showPopup(popupSelector) {
    var popup = document.querySelector(popupSelector);
    var popupClose = popup.querySelector('.popup__close');

    // document.body.classList.add(BODY_POPUP_SHOWED_CLASS);
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = getScrollBarWidth() + 'px';
    popup.classList.add(POPUP_MODIFY_SHOW_CLASS);

    popupClose.addEventListener('click', function (event) {
      event.preventDefault();
      closePopup(popupSelector);
    });
  }

  function closePopup(popupSelector) {
    var popup = document.querySelector(popupSelector);

    // document.body.classList.remove(BODY_POPUP_SHOWED_CLASS);
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    popup.classList.remove(POPUP_MODIFY_SHOW_CLASS);
  }

  var formCalculator = document.querySelector('.form-calculator');
  var FORM_CALCULATOR_CONROLS_SELECTOR = '[data-calculator-role="control"]';
  var FORM_CALCULATOR_OUTPUT_SELECTOR = '[data-calculator-role="output"]';
  var RATIO_SLIM = 0.2;
  var RATIO_MUSCLE = 0.1;
  var RATIO_TONE = 0;
  var gender = '';
  var personTarget = '';
  var personWeight = 0;
  var personHeight = 0;
  var personAge = 0;
  var coeffActivity = 0;

  function calcFormForMan() {
    return (
      (9.99 * personWeight + 6.25 * personHeight - 4.92 * personAge + 5) *
      coeffActivity
    );
  }

  function calcFormForWoman() {
    return (
      (9.99 * personWeight + 6.25 * personHeight - 4.92 * personAge - 161) *
      coeffActivity
    );
  }

  function calcForm() {
    var result = 0;
    var resultTarget = 0;
    gender = formCalculator.querySelector('input[name="gender"]:checked').value;
    personTarget = formCalculator.querySelector('input[name="targetPerson"]:checked').value;
    personWeight = formCalculator.weight.value ?
      parseFloat(formCalculator.weight.value) :
      0;
    personHeight = formCalculator.height.value ?
      parseFloat(formCalculator.height.value) :
      0;
    personAge = formCalculator.age.value ? parseFloat(formCalculator.age.value) : 0;
    coeffActivity = parseFloat(formCalculator.querySelector('input[name="activity"]:checked').value);

    if (!personWeight || !personHeight || !personAge) {
      return 0;
    }

    switch (gender) {
      case 'male':
        result = calcFormForMan();
        break;
      case 'female':
        result = calcFormForWoman();
        break;
      default:
        break;
    }

    switch (personTarget) {
      case 'slim':
        result -= result * RATIO_SLIM;
        break;
      case 'muscle':
        result += result * RATIO_MUSCLE;
        break;
      case 'tone':
        result += result * RATIO_TONE;
        break;
      default:
        break;
    }

    return result;
  }

  $('[data-popup-target]').on('click', function (event) {
    event.preventDefault();
    var popupTargetSelector = this.dataset.popupTarget;
    if (formCalculator) {
      showPopup(popupTargetSelector);
    }
  });

  if (formCalculator) {
    $(FORM_CALCULATOR_OUTPUT_SELECTOR).text(Math.round(calcForm()));
    $(formCalculator).on('change input', FORM_CALCULATOR_CONROLS_SELECTOR, function (
      event
    ) {
      $(FORM_CALCULATOR_OUTPUT_SELECTOR).text(Math.round(calcForm()));
    });
  }
});
