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
  var rebatePercent = 10;
  var rebate = rebatePercent / 100;
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

    if (days === 7) {
      result -= rebate * result;
      isRebate = true;
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

  $('[name="order_tariff"][value="' + getParameterByName('order_tariff') + '"]').prop('checked', true);

  $('[name="order_tariff"]').on('click', function (event) {
    history.replaceState({}, null, '?' + this.name + '=' + this.value);
  });

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
      stepped: true
    }
  });

  formNewOrderSlider.noUiSlider.on('update', function (values, handle) {
    price = $(TARIFF_PRICE_SELECTOR).filter(':checked').data('tarif-price');
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
