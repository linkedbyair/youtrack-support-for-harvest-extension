(function() {
  (function() {
    return window.addEventListener("message", function(evt) {
      var _ref;
      if (evt.source !== window) {
        return;
      }
      if ((_ref = evt.data) !== "timer:started" && _ref !== "timer:stopped") {
        return;
      }
      return chrome.runtime.sendMessage(evt.data);
    });
  })();

}).call(this);
