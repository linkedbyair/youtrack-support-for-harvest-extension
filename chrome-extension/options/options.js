(function () {// TODO check provided options for correctness

  var youtrack_url = document.getElementById('youtrack_url')
  var harvest_url = document.getElementById('harvest_url')
  var harvest_login = document.getElementById('harvest_login')
  var harvest_password = document.getElementById('harvest_password')

// Saves options to chrome.storage
function save_options(e) {
  e.preventDefault()
  chrome.storage.sync.set({
    youtrack_url: youtrack_url.value,
    harvest_url: harvest_url.value,
    harvest_login: harvest_login.value,
    harvest_password: harvest_password.value
  }, function () {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default values
  chrome.storage.sync.get({
    youtrack_url: '',
    harvest_url: '',
    harvest_login: '',
    harvest_password: ''
  }, function (items) {
    youtrack_url.value = items.youtrack_url;
    harvest_url.value = items.harvest_url;
    harvest_login.value = items.harvest_login;
    harvest_password.value = items.harvest_password;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('form').addEventListener('submit', save_options);

})()
