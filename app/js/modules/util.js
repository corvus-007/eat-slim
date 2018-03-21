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
