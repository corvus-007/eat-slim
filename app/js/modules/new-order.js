window.newOrder = (function () {
  var formNewOrder = document.querySelector('.form-new-order');

  if (!formNewOrder) {
    return;
  }

  var formNewOrderSlider = formNewOrder.querySelector('#form-new-order-slider');
  var TOTAL_SUM_SELECTOR = '[data-order-role="total-sum"]';
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
      //     return parseInt(value) + ' ' + window.util.declOfNum(['день', 'дня', 'дней'])(value);
      //   }
      // }
    }
  });

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
