(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  (function() {
    var config;
    config = this.config;
    return this.TimesheetVersion = (function() {
      function TimesheetVersion() {
        this.stopPolling = __bind(this.stopPolling, this);
        this.pollComplete = __bind(this.pollComplete, this);
        this.parseCurrentVersion = __bind(this.parseCurrentVersion, this);
        this.update = __bind(this.update, this);
      }

      TimesheetVersion.prototype.pollLength = 20;

      TimesheetVersion.prototype.update = function() {
        clearTimeout(this.pendingPoll);
        return $.ajax({
          url: "" + config.protocol + "://" + config.subdomain + config.domain + "/time/weekly/check_for_updates",
          cache: false,
          success: this.parseCurrentVersion,
          complete: this.pollComplete
        });
      };

      TimesheetVersion.prototype.parseCurrentVersion = function(data) {
        if (data == null) {
          return;
        }
        if (data.polling_frequency != null) {
          this.pollLength = data.polling_frequency;
        }
        if (data.timesheet_version !== this.currentVersion) {
          this.currentVersion = data.timesheet_version;
          return $(document).trigger("timesheetVersion:change");
        }
      };

      TimesheetVersion.prototype.pollComplete = function(xhr) {
        var is_logged_out;
        is_logged_out = xhr.status === 404;
        if (is_logged_out) {
          return this.stopPolling();
        } else {
          return this.pendingPoll = setTimeout(this.update, this.pollLength * 1000);
        }
      };

      TimesheetVersion.prototype.stopPolling = function() {
        this.currentVersion = null;
        clearTimeout(this.pendingPoll);
        return $(document).trigger("timesheetVersion:clear");
      };

      return TimesheetVersion;

    })();
  })();

}).call(this);
