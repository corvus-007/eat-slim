window.util = (function () {
  'use strict';

  var $ = window.jQuery;

  return {
    KEYCODE_ESC: 27,
    setMaxHeight: function (selector) {
      var maxHeight;
      var elements = document.querySelectorAll(selector);

      if (!elements.length) {
        return;
      }

      maxHeight = Array.from(elements).reduce(function findMaxHeight(prevValue, element) {
        var currentValue = element.offsetHeight;
        return (prevValue > currentValue) ? prevValue : currentValue;
      }, 0);

      Array.from(elements).forEach(function specifyMaxHeight(it) {
        it.style.height = maxHeight + 'px';
      });
    },
    declOfNum: function (titles) {
      var number = Math.abs(number);
      var cases = [2, 0, 1, 1, 1, 2];

      return function (number) {
        return titles[
          number % 100 > 4 && number % 100 < 20 ?
          2 :
          cases[number % 10 < 5 ? number % 10 : 5]
        ];
      };
    },
    getScrollbarWidth: function() {
      var div = document.createElement('div');

      div.style.overflowY = 'scroll';
      div.style.width = '50px';
      div.style.height = '50px';
      div.style.visibility = 'hidden';

      document.body.appendChild(div);
      var scrollWidth = div.offsetWidth - div.clientWidth;
      document.body.removeChild(div);

      return scrollWidth;
    },
  };
})();

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

window.newOrder = (function () {
  'use strict';

  var $ = window.jQuery;
  var formNewOrder = document.querySelector('.form-new-order');

  if (!formNewOrder) {
    return;
  }

  var formNewOrderSlider = formNewOrder.querySelector('#form-new-order-slider');
  var TOTAL_SUM_SELECTOR = '[data-order-role="total-sum"]';
  var REBATE_SELECTOR = '[data-order-role="rebate"]';
  var TARIFF_PRICE_SELECTOR = '[data-tarif-price]';
  var DAYS_INPUT_SELECTOR = '[data-order-role="days-input"]';
  var TOTAL_SUM_INPUT_SELECTOR = '[data-order-role="total-input"]';
  var REBATE_INPUT_SELECTOR = '[data-order-role="rebate-input"]';
  var CONTROLS_SELECTOR = '[data-order-role="control"]';
  var rebates = {
    "10": 10 / 100,
    "15": 15 / 100
  };
  var rebatePercent = 0;
  var rebate = 10 / 100;
  var price = 0;
  var days = 0;
  var currentTotal = 0;
  var isRebate = false;

  function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function calcOrder() {
    var result = price * days;
    isRebate = false;

    if (days >= 30) {
      result -= rebates['10'] * result;
      isRebate = true;
      rebatePercent = 15;
    } else if (days >= 7) {
      result -= rebate * result;
      isRebate = true;
      rebatePercent = 10;
    }

    return result;
  }

  function updateRebateText(days) {
    var text = 'Без скидки';

    if (days >= 30) {
      text = 'Cкидка <b>15%</b>';
    } else if (days >= 7) {
      text = 'Cкидка <b>10%</b>';
    }

    return text;
  }

  $('[name="order_tariff"][value="' + getParameterByName('order_tariff') + '"]').prop('checked', true);

  $('[name="order_tariff"]').on('click', function (event) {
    history.replaceState({}, null, '?' + this.name + '=' + this.value);
  });

  noUiSlider.create(formNewOrderSlider, {
    start: 2,
    // behaviour: 'snap',
    connect: [true, false],
    tooltips: true,
    step: 1,
    range: {
      'min': 1,
      'max': 31
    },
    pips: {
      mode: 'values',
      // values: 8,
      values: [1, 2, 3, 4, 5, 7, 14, 21, 31],
      density: 100 / 31,
      stepped: true,
      format: {
        to: function (value) {
          var roundValue = Math.round(value);
          switch (roundValue) {
            case 7:
              return '1 неделя';
            case 14:
              return '2 недели';
            case 21:
              return '3 недели';
            case 31:
              return '1 месяц';
            default:
              return roundValue;
          }
        }
      }
    },
    format: {
      to: function (value) {
        var roundValue = Math.round(value);
        // switch (roundValue) {
        //   case 7:
        //     return '1 неделя';
        //   case 14:
        //     return '2 недели';
        //   case 21:
        //     return '3 недели';
        //   default:
        // }
        return roundValue;
      },
      from: function (value) {
        var roundValue = Math.round(value);
        switch (roundValue) {
          case 7:
            return '1 неделя';
          case 14:
            return '2 недели';
          case 21:
            return '3 недели';
          case 31:
            return '1 месяц';
          default:
        }
        return roundValue;
      }
    }
  });

  formNewOrderSlider.noUiSlider.on('update', function (values, handle) {
    price = $(TARIFF_PRICE_SELECTOR).filter(':checked').data('tarif-price');
    // debugger;
    days = parseInt(values[handle], 10);
    currentTotal = calcOrder();

    $(REBATE_SELECTOR).html(updateRebateText(days));
    $(DAYS_INPUT_SELECTOR).val(days);
    $(TOTAL_SUM_SELECTOR).html(currentTotal + ' руб');
    $(TOTAL_SUM_INPUT_SELECTOR).val(currentTotal + ' руб');
    if (isRebate) {
      $(REBATE_INPUT_SELECTOR).val(rebatePercent + '%');
    } else {
      $(REBATE_INPUT_SELECTOR).val('0%');
    }
  });

  $(formNewOrder).on('change input', CONTROLS_SELECTOR, function (event) {
    price = $(TARIFF_PRICE_SELECTOR).filter(':checked').data('tarif-price');
    days = parseInt(formNewOrderSlider.noUiSlider.get());
    currentTotal = calcOrder();

    $(REBATE_SELECTOR).html(updateRebateText(days));
    $(DAYS_INPUT_SELECTOR).val(days);
    $(TOTAL_SUM_SELECTOR).html(currentTotal + ' руб');
    $(TOTAL_SUM_INPUT_SELECTOR).val(currentTotal + ' руб');
    if (isRebate) {
      $(REBATE_INPUT_SELECTOR).val(rebatePercent + '%');
    } else {
      $(REBATE_INPUT_SELECTOR).val('0%');
    }
  });
})();

window.outCover = (function() {
  'use strict';

  var $ = window.jQuery;
  var outCover = document.querySelector('.out-cover');
  var outCoverCloseWrapper = outCover.querySelector(
    '.out-cover__close-wrapper'
  );
  var outCoverBody = outCover.querySelector('.out-cover__body');
  var outCoverMainNavWrapper = outCover.querySelector(
    '.out-cover__main-nav-wrapper'
  );
  var outCoverFooter = outCover.querySelector('.out-cover__footer');
  var outCoverToggler = document.querySelector('.out-cover-toggler');
  var outCoverClose = outCover.querySelector('.out-cover__close');
  var scrollWidth = window.util.getScrollbarWidth();
  var scrollPageValue = 0;

  var onOutCoverEscPress = function(event) {
    if (event.keyCode === window.util.KEYCODE_ESC) {
      hideOutCover();
    }
  };

  var getSumHeight = function() {
    var result = 0;

    for (var i = 0; i < arguments.length; i++) {
      result += arguments[i].offsetHeight;
    }

    return result;
  };

  var showOutCover = function() {
    scrollPageValue = window.pageYOffset;
    outCoverBody.style.height =
      'calc(100% - (' +
      getSumHeight(outCoverCloseWrapper, outCoverFooter) +
      'px))';
    document.body.classList.add('no-scroll');
    outCover.classList.add('out-cover--opened');
    document.addEventListener('keydown', onOutCoverEscPress);
  };

  var hideOutCover = function() {
    outCover.classList.remove('out-cover--opened');
    document.body.classList.remove('no-scroll');
    window.scrollTo(0, scrollPageValue);
    document.removeEventListener('keydown', onOutCoverEscPress);
  };

  outCoverToggler.addEventListener('click', function(event) {
    event.preventDefault();
    showOutCover();
  });

  outCoverClose.addEventListener('click', function(event) {
    event.preventDefault();
    hideOutCover();
  });

  return {
    mainNavWrapper: outCoverMainNavWrapper,
    show: showOutCover,
    hide: hideOutCover
  };
})();

