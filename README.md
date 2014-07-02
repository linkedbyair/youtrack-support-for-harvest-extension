# Linked by Air customization of the Harvest Chrome extension

Currently based on version 2.04 in the 
[Chrome Store](https://chrome.google.com/webstore/detail/harvest-time-tracker/fbpiglieekigmkeebmeohkelfpjjlaia)

## Additional features compared to the official version:

* Track time in [YouTrack](http://www.jetbrains.com/youtrack/). Timer icon appears on the 
  full issue view, and on the popup in the agile view when you double-click an issue card.
* Basecamp: Fixes an apparent bug with URL links from Harvest reports to Basecamp, even in
  extension version 2.04. (Doesn't fix previous time entries, only new ones.)
* Basecamp: Timer icon appears on closed issues too.
* Harvest: When viewing a detailed time report or the uninvoiced time report on the Harvest
  website, you can click the hours in the far right column to jump to the timesheet for that
  date and employee. This makes it easier to edit time entries when viewing the report for
  a client, such as to change the task type (e.g. from billable to non-billable) or the
  description.

## Installation

The easiest way to install is clone this repository.
Then in Chrome go to [chrome://extensions](chrome://extensions).
Optionally tick "Developer mode" at the top.
Drag the checked-out repository folder into the browser.
Don't move or delete the folder after that.
If you update the repository, just go back to [chrome://extensions](chrome://extensions) 
and click "Reload".
