requirejs.config(requirejsConfig);
requirejs(['api', 'utils'],
function (api, utils) {

  var importedStr = "imported from Harvest"
  var checkInProgress = []
  var checkDate = []


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
    if (!api.isOptionsPresent()) { return }

    var cDate = date || +new Date
    var cDateKey = checkDate.indexOf(cDate)
    if(cDateKey) {
      delete checkDate[cDateKey]
      if (!checkDate.join('')) {
        checkDate = []
      }
    }

    api.harvest.time.get(id, date, function (data) {
      // if today less than hour
      if (!data.day_entries.length) {
        if (!date && (new Date).getHours() < 1) {
          var yesterday = +new Date - utils.DAY_IN_MS
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
          if (!checkInProgress.join('')) {
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
          api.youtrack.workItem.getAll(issueId, function (data) {
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
              api.youtrack.workItem.add(issueId, JSON.stringify(workData), null, function (xhr) {
                var data = xhr.responseJSON
                // if no worktype - add w/o it
                if (xhr.status == 400 && data.value == "Unknown worktype name") {
                  delete workData.worktype
                  api.youtrack.workItem.add(issueId, JSON.stringify(workData), null, function () {
                    addOfflineAlarm(workData.date) // TODO no need to make request with worktype again
                  })
                } else {
                  addOfflineAlarm(workData.date)
                }

              })
            }
          }, function (xhr) {
            switch (xhr.status) {
              case 403: // TODO logged out, maybe make an ajax request to YT url (w/ oauth redirect)
                break;
              case 404: // TODO issue id is not found / have not access
                break;
              default:
                addOfflineAlarm(date)
            }
          })
        }
      })

    }, function () { // TODO count errors, on 10 - show red icon ?
      addOfflineAlarm(date, 2) // TODO if offline than we won't spam any server, since this is the first request
    })

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

});
