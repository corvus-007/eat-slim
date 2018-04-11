window.calculator = (function () {
  'use strict';

  var $ = window.jQuery;
  var formCalculator = document.querySelector('.form-calculator');
  var FORM_CALCULATOR_CONTROLS_SELECTOR = '[data-calculator-role="control"]';
  var FORM_CALCULATOR_OUTPUT_CALORIES_SELECTOR = '[data-calculator-role="output-calories"]';
  var FORM_CALCULATOR_OUTPUT_TARIFF_SELECTOR = '[data-calculator-role="output-tariff"]';
  var FORM_CALCULATOR_SUBMIT_SELECTOR = '.form-calculator__submit';
  var RATIO_SLIM = 0.2;
  var RATIO_MUSCLE = 0.1;
  var RATIO_TONE = 0;
  var tariffs = [{
      id: 'lite',
      name: 'Lite',
      price: 500,
      calories: 1200
    },
    {
      id: 'lite-2',
      name: 'Lite+',
      price: 550,
      calories: 1400
    },
    {
      id: 'fitness',
      name: 'Fitness',
      price: 600,
      calories: 1600
    },
    {
      id: 'fitness-2',
      name: 'Fitness+',
      price: 650,
      calories: 1800
    }
  ];
  var calories = 0;
  var gender = '';
  var personTarget = '';
  var personWeight = 0;
  var personHeight = 0;
  var personAge = 0;
  var coeffActivity = 0;
  var tariffName = '';
  var tariffId = '';
  var tariffCalories = 0;

  function calcCaloriesMan() {
    return (
      (9.99 * personWeight + 6.25 * personHeight - 4.92 * personAge + 5) *
      coeffActivity
    );
  }

  function calcCaloriesWoman() {
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
        result = calcCaloriesMan();
        break;
      case 'female':
        result = calcCaloriesWoman();
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

  if (formCalculator) {
    calories = Math.round(calcForm());
    $(FORM_CALCULATOR_OUTPUT_CALORIES_SELECTOR).text(calories);

    $(formCalculator).on('change input', FORM_CALCULATOR_CONTROLS_SELECTOR, function (event) {
      calories = Math.round(calcForm());
      $(FORM_CALCULATOR_OUTPUT_CALORIES_SELECTOR).text(calories);
      if (calories > 0) {
        for (var i = 0; i < tariffs.length; i++) {
          tariffCalories = tariffs[i].calories;

          if (calories < tariffCalories) {
            tariffName = tariffs[i].name;
            tariffId = tariffs[i].id;
            break;
          }
        }

        if (!tariffName) {
          tariffName = tariffs[tariffs.length-1].name;
          tariffId = tariffs[tariffs.length-1].id;
        }
      }
      $(FORM_CALCULATOR_OUTPUT_TARIFF_SELECTOR).text(tariffName);
      $(FORM_CALCULATOR_SUBMIT_SELECTOR).find('span').text('Заказать')
      console.log(tariffName);
    });

    $(formCalculator).on('submit', function(event) {
      event.preventDefault();
      var action = this.action;
      document.location.href = action + '?order_tariff=' + tariffId;
    });
  }
})();
