(function() {
  (function() {
    var canBeClosed, setRunningTimerIcon, shouldClose, waitUntilChromeAutofocuses;
    canBeClosed = true;
    shouldClose = false;
    window.addEventListener("load", (function(_this) {
      return function() {
        var iframe;
        iframe = document.querySelector("iframe");
        waitUntilChromeAutofocuses(iframe);
        iframe.src = "" + _this.config.url + "/platform/timer?service=chrome.google.com&format=platform&external_item_id=1&external_group_id=1";
        return iframe.addEventListener("load", function() {
          return iframe.classList.add("is-loaded");
        });
      };
    })(this));
    window.addEventListener("message", function(e) {
      var height, iframe, isRunning, matches, message;
      iframe = document.querySelector("iframe");
      message = e.data;
      if (message === "lightbox:close") {
        if (canBeClosed) {
          return window.close();
        } else {
          return shouldClose = true;
        }
      } else if (matches = message.match(/height:([0-9]+)/)) {
        height = matches[1];
        return iframe.style.height = "" + height + "px";
      } else if (matches = message.match(/timer:(started|stopped)/)) {
        isRunning = matches[1] === "started";
        return setRunningTimerIcon(isRunning);
      }
    });
    setRunningTimerIcon = function(isRunning) {
      var options, state;
      state = isRunning ? "on" : "off";
      canBeClosed = false;
      options = {
        path: {
          "19": "images/h-toolbar-" + state + "@19px.png",
          "38": "images/h-toolbar-" + state + "@38px.png"
        }
      };
      chrome.browserAction.setIcon(options, function() {
        if (shouldClose) {
          return window.close();
        }
      });
      return chrome.browserAction.setTitle({
        title: isRunning ? "View the running Harvest timer" : "Start a Harvest timer"
      });
    };
    return waitUntilChromeAutofocuses = function(element) {
      return element.getBoundingClientRect().width;
    };
  })();

}).call(this);
