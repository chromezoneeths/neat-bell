# Neat Bell

A *very* efficient frontend for ETHSBell.

Here are some estimates of its resource consumption:
* 1 repaint every 5 seconds.
* 1kb every 8 hours, or the first time you open it in a day.
* 3.82kb on the first load, substantially less on future loads thanks to your browser's cache.
* ~3kb per PE data fetch. (This is expensive mostly because it connects to Google Scripts, I can't do much about it.)

Here are its features:
* Displays previous, current, and next periods.
* Tracks period names and class teleconferencing links.
  * All configuration is stored client-side.
* Notifies the user when a new period starts.
* Respects the system's dark mode, if the browser supports it.
* Integrates with the PE board
  * This feature depends on Google servers. If you'd rather not connect to them, don't supply the `pe` key in your configuration and this feature will be disabled.

Here are its caveats:
* It depends on https://bell-api.spaghet.us for sanitized schedule data. (ETHSBell's API changes often.)
* It isn't officially endorsed by the school or by Oliver Leopold (creator of ETHSBell).
* It isn't terribly stable yet, so if something doesn't seem right you should check ETHSBell.
* It doesn't look great.
* It doesn't have a browser extension.
* It doesn't guarantee compatibility with older browsers.
  * Anything supporting ES2017 should work.
  * You can try compiling it yourself for older targets, but it will be larger and it might not work right.