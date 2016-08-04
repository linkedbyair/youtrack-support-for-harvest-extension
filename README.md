# customization of the Harvest Chrome extension

Currently based on version 2.1.2 in the 
[Chrome Store](https://chrome.google.com/webstore/detail/harvest-time-tracker/fbpiglieekigmkeebmeohkelfpjjlaia)

## Additional features compared to the official version:

* Track time in [JetBrains YouTrack](http://www.jetbrains.com/youtrack/). Timer icon appears on the 
  full issue view, and on the popup in the agile view when you double-click an issue card.
  Your YouTrack must be configured to force SSL (in YouTrack global settings).
* Basecamp: Fixes an apparent bug with URL links from Harvest reports to Basecamp, even in
  extension version 2.04. (Doesn't fix previous time entries, only new ones.)
* Basecamp: Timer icon appears on closed issues too.
* Harvest: When viewing a detailed time report or the uninvoiced time report on the Harvest
  website, you can click the hours in the far right column to jump to the timesheet for that
  date and employee. This makes it easier to edit time entries when viewing the report for
  a client, such as to change the task type (e.g. from billable to non-billable) or the
  description.

## Installation

1. Go to [Releases](https://github.com/linkedbyair/harvest-chrome/releases) in this GitHub repository.
1. Download the .crx for the latest release.
1. Then in Chrome go to [chrome://extensions](chrome://extensions).
1. Optionally tick "Developer mode" at the top.
1. Drag the .crx into the browser.
1. You can delete the .crx after that.
1. If you repeat later with a newer version it _should_ automatically replace the previous version.

## Working on the extension

1. Clone this repository.
1. Then in Chrome go to [chrome://extensions](chrome://extensions).
1. Optionally tick "Developer mode" at the top.
1. Delete an existing .crx-based version, if any (it won't have "Source" or "Reload" links).
1. Drag the `harvest-chrome-extension` subfolder from the checked-out repository folder into the browser.
1. Don't move or delete the folder after that.
1. Make code changes in the `harvest-chrome-extension` subfolder. Then just go back to [chrome://extensions](chrome://extensions) and click "Reload" to test.
1. Bump the version number in `manifest.json`.
1. Commit and push your changes.
