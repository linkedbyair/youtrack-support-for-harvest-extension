# YouTrack support for Harvest Time Tracker extension

This extension adds support for YouTrack for [Harvest Time Tracker](https://chrome.google.com/webstore/detail/harvest-time-tracker/fbpiglieekigmkeebmeohkelfpjjlaia) extension.

It is also adds manual import of today's harvest entries into YouTrack by extension button click.

Notes:
- For initial config see extension options
- Harvest entry notes should starts with YouTrack issue id: XYZ-123
- YouTrack entry type can be set from Harvest task. Obviously, YT should contain list. Otherwise it will be "No Type".
- YT work entry always will be set by current logged in user
- Entry will not be sync'ed if it is in progress
- If entry has same YT ID, duration within single day it determines as duplicated and will not be sync'ed again
- YT entries can't be updated (yet), so you should create new entry in harvest for new time run

## In development
1. Oauth2 support for Harvest
1. More error handling
1. Refactoring and design
