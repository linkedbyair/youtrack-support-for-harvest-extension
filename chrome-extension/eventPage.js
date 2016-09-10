(function () {

  var importedStr = "imported from Harvest"


  chrome.browserAction.onClicked.addListener(function () {

    if (!(youtrackUrl && harvestUrl && harvestAuth)) { return }

    // if today less than hour
    harvestGetTime(function (data) {
      if (!data.day_entries.length) {
        if (false) { } // TODO if today less than an hour - make request for yesterday
      }
      data.day_entries.forEach(function (entry) {
        var issueId = (entry.notes || '').match(/^([A-Z]+-\d+)/)
        if (!issueId) { return } // not YT entry

        issueId = issueId[1]

        if (entry.timer_started_at) { // unfinished TODO

        } else {
          ytGetWorkItems(issueId, function (data) {
            var workData = {
              date: +new Date(entry.spent_at),
              duration: (entry.hours * 60).toFixed(),
              description: importedStr,
              worktype: {name: entry.task}
            }
            // if no such entry add new
            var sameIssue = data.filter(function (issue) {
              return issue.description == importedStr && issue.duration == workData.duration
            })[0]
            if (!sameIssue) { // TODO update time
              ytAddWorkItem(issueId, JSON.stringify(workData), function () {
              }, function (xhttp) {
                data = xhttp.responseJSON
                // if no worktype - add w/o it
                if (xhttp.status == 400 && data.value == "Unknown worktype name") {
                  delete workData.worktype
                  ytAddWorkItem(issueId, JSON.stringify(workData), function () {
                  }, function () {
                    // TODO try to add later (add date to the storage so it will run with normal flow)
                  })
                }
                // TODO try to add later (add date to the storage so it will run with normal flow)
              })
            }
          }, function () {
            // alert('please login')
            // TODO try to add later (add date to the storage so it will run with normal flow)
          })
        }
      })

    })

  })

  var youtrackUrl, youtrackWIUrl, harvestUrl, harvestAuth
  chrome.storage.sync.get(['youtrack_url', 'harvest_url', 'harvest_login', 'harvest_password'], function (data) {
    youtrackUrl = data.youtrack_url
    youtrackWIUrl = youtrackUrl + '/rest/issue/%issue_id%/timetracking/workitem'
    harvestUrl = data.harvest_url
    harvestAuth = btoa(data.harvest_login + ':' + data.harvest_password)
  })

  function ytGetWorkItems (issueId, success, error) {
    ajax({
      url: youtrackWIUrl.replace('%issue_id%', issueId),
      method: "GET",
      headers: {
        accept: "application/json"
      },
      success: success,
      error: error
    })
  }

  function ytAddWorkItem (issueId, data, success, error) {
    ajax({
      url: youtrackWIUrl.replace('%issue_id%', issueId),
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json"
      },
      success: success,
      error: error,
      data: data
    })
  }

  function harvestGetTime (success, error, yesterday) {
    var url = harvestUrl + "/daily/"
    if (yesterday) {
      var d = new Date
      var yesterdayOfYear = dayOfYear(d) - 1
      url += d.getFullYear() + '/' + yesterdayOfYear
    }
    ajax({
      url: url + '?slim=1',
      headers: {
        'Authorization': 'Basic ' + harvestAuth,
        'Accept': 'application/json'
      },
      success: success,
      error: error
    })
  }

  function ajax (config) {
    if (!config) return false

    config = extend({
      method: 'get',
      success: _f,
      error: _f,
      headers: [],
      data: ''
    }, config)

    if (!config.url) return false

    var _setResponseJSON = function (xhttp) {
      var contentType = xhttp.getResponseHeader('content-type')
      if (~(contentType || '').indexOf('application/json')) {
        xhttp.responseJSON = JSON.parse(xhttp.responseText)
      }
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      _setResponseJSON(xhttp)
      if (xhttp.status >= 200 && xhttp.status < 400) {
        config.success(xhttp.responseJSON || xhttp.responseText)
      } else return config.error(xhttp)
    };
    xhttp.onerror = function () {
      _setResponseJSON(xhttp)
      config.error.apply(this, arguments)
    }
    xhttp.open(config.method, config.url, true);
    Object.keys(config.headers).forEach(function (header) {
      xhttp.setRequestHeader(header, config.headers[header])
    })
    xhttp.send(config.data);
  }

  function dayOfYear (date) {
    var DAY_IN_MS = 864e5;

    function _noon(year, month, day) {
      return new Date(year, month, day, 12, 0, 0);
    }

    if (!date) date = new Date;

    var then = _noon(date.getFullYear(), date.getMonth(), date.getDate()),
      first = _noon(date.getFullYear(), 0, 0);

    return Math.round((then - first) / DAY_IN_MS);
  }

  function extend (obj, obj1) {
    Object.keys(obj1).forEach(function (key) {
      obj[key] = obj1[key]
    })
    return obj
  }

  function _f () {}

})()
