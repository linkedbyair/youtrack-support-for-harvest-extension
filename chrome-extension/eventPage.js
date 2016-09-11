(function () {

  var importedStr = "imported from Harvest"
  var checkInProgress = []
  var checkDate = []
  var DAY_IN_MS = 864e5;


  chrome.alarms.clearAll(function () {
    chrome.alarms.create('hourly', { periodInMinutes: 60 })
  })

  chrome.alarms.onAlarm.addListener(function (alarm) {
    switch(alarm.name) {
      case 'hourly':
        process()
        break;
      case 'checkInProgress':
        checkInProgress.forEach(function (id) {
          process(id)
        })
        break;
      case 'possiblyOffline':
        checkDate.forEach(function (date) {
          process(null, date)
        })
    }
  })

  function process (id, date) {
    if (!(youtrackUrl && harvestUrl && harvestAuth)) { return }

    var cDate = date || +new Date
    var cDateKey = checkDate.indexOf(cDate)
    if(cDateKey) {
      delete checkDate[cDateKey]
      if (!checkDate.join()) {
        checkDate = []
      }
    }

    harvestGetTime(function (data) {
      // if today less than hour
      if (!data.day_entries.length) {
        if (!date && (new Date).getHours() < 1) {
          var yesterday = +new Date - DAY_IN_MS
          return process(null, yesterday)
        }
      }
      data.day_entries.forEach(function (entry) {
        var issueId = (entry.notes || '').match(/^([A-Z]+-\d+)/)
        if (!issueId) { return } // not YT entry

        issueId = issueId[1]

        var checkingIdKey = checkInProgress.indexOf(entry.id)
        if (checkingIdKey) {
          delete checkInProgress[checkingIdKey]
          if (!checkInProgress.join()) {
            checkInProgress = []
          }
        }

        if (entry.timer_started_at) { // unfinished
          checkInProgress.push(entry.id)
          chrome.alarms.get('checkInProgress', function (alarm) {
            if (!alarm) {
              chrome.alarms.create('checkInProgress', {delayInMinutes: 10})
            }
          })
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
              ytAddWorkItem(issueId, JSON.stringify(workData), _f, function (xhttp) {
                data = xhttp.responseJSON
                // if no worktype - add w/o it
                if (xhttp.status == 400 && data.value == "Unknown worktype name") {
                  delete workData.worktype
                  ytAddWorkItem(issueId, JSON.stringify(workData), _f, function () {
                    // TODO determine errors (404, unreachable, offline)
                    addOfflineAlarm(workData.date)
                  })
                } else {
                  // TODO determine errors (404, unreachable, offline)
                  addOfflineAlarm(workData.date)
                }

              })
            }
          }, function () {
            // TODO determine errors (404, unreachable, offline, logged out)
            addOfflineAlarm(date)
          })
        }
      })

    }, function () { // TODO count errors, on 10 - show red icon ?
      addOfflineAlarm(date, 2) // TODO if offline than we won't spam any server, since this is the first request
    }, id, date)

  }

  function addOfflineAlarm(date, delay) {
    delay = delay || 30
    checkDate.push(date)
    chrome.alarms.get('possiblyOffline', function (alarm) {
      if (!alarm) {
        chrome.alarms.create('possiblyOffline', {delayInMinutes: delay})
      }
    })
  }

  chrome.browserAction.onClicked.addListener(function () {
    process()
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

  function harvestGetTime (success, error, id, date) {
    var url = harvestUrl + "/daily/"

    if(id) {
      url += 'show/' + id

    } else if (date) {
      var d = new Date(date)
      url += +dayOfYear(d) + '/' + d.getFullYear()
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
