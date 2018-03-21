window.util = (function () {
  'use strict';

  return {
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
    }
  }
})();

window.newOrder = (function () {
  var formNewOrder = document.querySelector('.form-new-order');

  if (!formNewOrder) {
    return;
  }

  var formNewOrderSlider = formNewOrder.querySelector('#form-new-order-slider');
  var TOTAL_SUM_SELECTOR = '[data-order-role="total-sum"]';
  var REBATE_SELECTOR = '[data-order-role="rebate"]';
  var TARIFF_PRICE_SELECTOR = '[data-tarif-price]';
  var CONTROLS_SELECTOR = '[data-order-role="control"]';
  var rebate = 10 / 100;
  var price = 0;
  var days = 0;

  function calcOrder() {
    var result = 0;

    result = price * days;
    if (days === 7) {
      result -= rebate * result;
    }

    return result;
  }

  function updateRebateText(days) {
    var text = 'Без скидки';
    if (days === 7) {
      text = 'Cкидка <b>10%</b>';
    }
    return text;
  }

  noUiSlider.create(formNewOrderSlider, {
    start: 2,
    behaviour: 'snap',
    connect: [true, false],
    // tooltips: true,
    padding: [1, 0],
    step: 1,
    range: {
      'min': [1],
      'max': [7, 1]
    },
    pips: {
      mode: 'values',
      values: [2, 3, 4, 5, 6, 7],
      density: 100 / 7,
      stepped: true,
      format: {
        to: function (value) {
          // return parseInt(value) + ' ' + window.util.declOfNum(['день', 'дня', 'дней'])(value);
          var val = parseInt(value);
          if (val === 7) {
            val += (' скидка 10%');
          }
          return val;
        }
      }
    }
  });

  formNewOrderSlider.noUiSlider.on('update', function (values, handle) {
    price = $(TARIFF_PRICE_SELECTOR).filter(':checked').data('tarif-price');
    days = parseInt(values[handle], 10);

    $(REBATE_SELECTOR).html(updateRebateText(days));
    $(TOTAL_SUM_SELECTOR).html(calcOrder() + ' руб');
  });

  $(formNewOrder).on('change input', CONTROLS_SELECTOR, function (event) {
    price = $(TARIFF_PRICE_SELECTOR).filter(':checked').data('tarif-price');
    days = parseInt(formNewOrderSlider.noUiSlider.get());

    $(REBATE_SELECTOR).html(updateRebateText(days));
    $(TOTAL_SUM_SELECTOR).text(calcOrder() + ' руб');
  });
})();

