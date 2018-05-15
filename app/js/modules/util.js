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
    getScrollbarWidth: function () {
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
    getWeekNumber: function (d) {
      // Copy date so don't modify original
      d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
      // Set to nearest Thursday: current date + 4 - current day number
      // Make Sunday's day number 7
      d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
      // Get first day of year
      var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      // Calculate full weeks to nearest Thursday
      var weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
      // Return array of year and week number
      return [d.getUTCFullYear(), weekNo];
    }
  };
})();
