# YouTrack support for Harvest Time Tracker extension

This extension adds YouTrack integration for [Harvest Time Tracker](https://chrome.google.com/webstore/detail/harvest-time-tracker/fbpiglieekigmkeebmeohkelfpjjlaia) extension.

## Functional:
1. Adds Harvest tracker button to ordinary issue view and agile issue popup
1. Adds one-way (H -> YT) time tracking synchronization\
    - works within 25 hours (syncs yesterday if triggered in first hour)
    - can be triggered by extension button
    - normally runs every hour automatically
    - if entry is in progress - tries to sync in 10 min
    - can update synced entries

## Notes:
- For initial config see extension options
- Harvest entry notes should start with YouTrack issue id: XYZ-123
- YouTrack entry type can be set from Harvest task. Obviously, YT should contain it in list. "No Type" by default.
- YT work entry always will be set by current logged in user
- Entry will not be sync'ed if it is in progress

## In development:
1. Oauth2 support for Harvest
1. More error handling
1. Refactoring and design
