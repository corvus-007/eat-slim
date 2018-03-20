document.addEventListener('DOMContentLoaded', function () {
  svg4everybody();

  $('input[type="tel"]').mask('+7 (999) 999-99-99', {});

  var POPUP_MODIFY_SHOW_CLASS = 'popup--open';
  var BODY_POPUP_SHOWED_CLASS = 'is-popup-open';

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
