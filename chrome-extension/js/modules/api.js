define(['jquery', 'utils'],
function ($, utils) {

  var youtrackUrl, youtrackWIUrl, harvestUrl, harvestAuth
  function reInitOptions (cb) {
    chrome.storage.sync.get(['youtrack_url', 'harvest_url', 'harvest_login', 'harvest_password'], function (data) {
      youtrackUrl = data.youtrack_url + '/rest/'
      youtrackWIUrl = youtrackUrl + 'issue/%issue_id%/timetracking/workitem'
      harvestUrl = data.harvest_url
      harvestAuth = btoa(data.harvest_login + ':' + data.harvest_password)

      ;(cb || utils._f)()
    })
  }
  reInitOptions()

  function isOptionsPresent() {
    return youtrackUrl && harvestUrl && harvestAuth
  }

  // used to check YT url
  function ytGetProjectIds(success, error) {
    $.ajax({
      url: youtrackUrl + 'admin/project/',
      success: success,
      error: error,
      dataType: 'json'
    })
  }

  function ytGetWorkItems(issueId, success, error) {
    $.ajax({
      url: youtrackWIUrl.replace('%issue_id%', issueId),
      dataType: 'json',
      success: success,
      error: error
    })
  }

  function ytAddWorkItem(issueId, data, success, error) {
    $.ajax({
      url: youtrackWIUrl.replace('%issue_id%', issueId),
      method: "POST",
      success: success,
      error: error,
      data: data,
      dataType: 'json'
    })
  }

  function harvestGetTime(success, error, id, date) {
    var url = harvestUrl + "/daily/"

    if (id) {
      url += 'show/' + id

    } else if (date) {
      var d = new Date(date)
      url += +utils.dayOfYear(d) + '/' + d.getFullYear()
    }
    $.ajax({
      url: url + '?slim=1',
      headers: {
        accept: 'application/json',
        authorization: 'Basic ' + harvestAuth
      },
      dataType: 'json',
      success: success,
      error: error
    })
  }

  return {
    ytGetWorkItems: ytGetWorkItems,
    ytAddWorkItems: ytAddWorkItem,
    harvestGetTime: harvestGetTime,
    isOptionsPresent: isOptionsPresent,
    reInitOptions: reInitOptions,
    ytGetProjectIds: ytGetProjectIds
  }
});
