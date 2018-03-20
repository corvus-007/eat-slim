'use strict';

window.util = (function () {
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
    }
  }
})();

window.newOrder = (function () {
  var formNewOrder = document.querySelector('.form-new-order');
  var formNewOrderSlider = formNewOrder.querySelector('#form-new-order-slider');
  var TOTAL_SUM_SELECTOR = '[data-order-role="total-sum"]';
  var TARIFF_PRICE_SELECTOR = '[data-tarif-price]';
  var CONTROLS_SELECTOR = '[data-order-role="control"]';

  function declOfNum(titles) {
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

  if (!formNewOrder) {
    return;
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
      // format: {
      //   to: function (value) {
      //     return parseInt(value) + ' ' +  declOfNum(['день', 'дня', 'дней'])(value);
      //   }
      // }
    }
  });

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

  formNewOrderSlider.noUiSlider.on('update', function (values, handle) {
    price = $(TARIFF_PRICE_SELECTOR).filter(':checked').data('tarif-price');
    days = parseInt(values[handle], 10);
    $(TOTAL_SUM_SELECTOR).text(calcOrder() + ' руб');
  });

  $(formNewOrder).on('change input', CONTROLS_SELECTOR, function (event) {
    console.log('change input');
    price = $(TARIFF_PRICE_SELECTOR).filter(':checked').data('tarif-price');
    days = parseInt(formNewOrderSlider.noUiSlider.get());

    $(TOTAL_SUM_SELECTOR).text(calcOrder() + ' руб');
  });
})();

