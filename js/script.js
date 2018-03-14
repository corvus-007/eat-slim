document.addEventListener('DOMContentLoaded', function() {
  svg4everybody();

  var POPUP_MODIFY_SHOW_CLASS = 'popup--open';
  var BODY_POPUP_SHOWED_CLASS = 'is-popup-open';

  $('.weekly-menu-tabs').tabslet({
    animation: true
  });

  function showPopup(selector) {
    var popup = document.querySelector(selector);
    var popupClose = popup.querySelector('.popup__close');
    document.body.classList.add(BODY_POPUP_SHOWED_CLASS);
    popup.classList.add(POPUP_MODIFY_SHOW_CLASS);

    popupClose.addEventListener('click', function(event) {
      event.preventDefault();
      closePopup(selector);
    });
  }

  function closePopup(selector) {
    var popup = document.querySelector(selector);
    document.body.classList.remove(BODY_POPUP_SHOWED_CLASS);
    popup.classList.remove(POPUP_MODIFY_SHOW_CLASS);
  }

  $('[data-popup-target]').on('click', function(event) {
    event.preventDefault();
    var popupTargetSelector = this.dataset.popupTarget;
    showPopup(popupTargetSelector);
  });

  var formProfile = document.querySelector('.form-profile');
  var FORM_PROFILE_CONROLS_SELECTOR = '[data-profile-role="control"]';
  var FORM_PROFILE_OUTPUT_SELECTOR = '[data-profile-role="output"]';
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
    gender = formProfile.querySelector('input[name="gender"]:checked').value;
    personTarget = formProfile.querySelector('input[name="targetPerson"]:checked').value;
    personWeight = formProfile.weight.value
      ? parseFloat(formProfile.weight.value)
      : 0;
    personHeight = formProfile.height.value
      ? parseFloat(formProfile.height.value)
      : 0;
    personAge = formProfile.age.value ? parseFloat(formProfile.age.value) : 0;
    coeffActivity = parseFloat(formProfile.querySelector('input[name="activity"]:checked').value);

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

  // $(FORM_PROFILE_OUTPUT_SELECTOR).text(Math.round(calcForm()));

  $(formProfile).on('change input', FORM_PROFILE_CONROLS_SELECTOR, function(
    event
  ) {
    $(FORM_PROFILE_OUTPUT_SELECTOR).text(Math.round(calcForm()));
  });
});
