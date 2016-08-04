(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var PlatformCookie, PlatformExtension, TimesheetVersion, config, lastVersion, splashUrl, thisVersion;
    config = this.config;
    TimesheetVersion = this.TimesheetVersion;
    PlatformCookie = this.PlatformCookie;
    PlatformExtension = (function() {
      function PlatformExtension() {
        this.getTimerStatus = __bind(this.getTimerStatus, this);
        this.timesheetVersion = new TimesheetVersion();
        $(document).on("login:change", this.timesheetVersion.update);
        $(document).on("timesheetVersion:clear", this.setRunningTimerIcon.bind(this, false));
        $(document).on("timesheetVersion:change", this.getTimerStatus);
        this.cookie = new PlatformCookie("platform_user_id");
        this.cookie.getCookie();
        chrome.runtime.onMessage.addListener((function(_this) {
          return function(message) {
            return _this.timesheetVersion.update();
          };
        })(this));
      }

      PlatformExtension.prototype.getTimerStatus = function() {
        return $.ajax({
          url: "" + config.url + "/platform/last_running_timer.json",
          cache: false,
          success: (function(_this) {
            return function(data) {
              return _this.setRunningTimerIcon(data != null ? data.day_entry : void 0);
            };
          })(this)
        });
      };

      PlatformExtension.prototype.setRunningTimerIcon = function(running) {
        var state;
        state = running ? "on" : "off";
        chrome.browserAction.setIcon({
          path: {
            "19": "images/h-toolbar-" + state + "@19px.png",
            "38": "images/h-toolbar-" + state + "@38px.png"
          }
        });
        return chrome.browserAction.setTitle({
          title: running ? "View the running Harvest timer" : "Start a Harvest timer"
        });
      };

      return PlatformExtension;

    })();
    new PlatformExtension();
    lastVersion = localStorage.getItem("version");
    thisVersion = chrome.app.getDetails().version;
    localStorage.setItem("version", thisVersion);
    splashUrl = "http://www.getharvest.com/harvest-for-chrome-installed?version=" + thisVersion;
    if (!lastVersion && !localStorage.getItem("firstRunShown")) {
      return chrome.tabs.create({
        url: splashUrl
      });
    } else if (lastVersion !== thisVersion) {
      console.log("Upgrade notice: " + lastVersion + " upgraded to " + thisVersion);
      if (thisVersion === "1.2.0") {
        return chrome.tabs.create({
          url: "" + splashUrl + "&upgrade=true"
        });
      }
    }
  })();

}).call(this);
