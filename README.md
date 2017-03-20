# TrackMeNot
My fork of original TrackMeNot - Chrome extension repository. Experimenting, improving, sometimes breaking things.

Original repo [here](https://github.com/vtoubiana/TrackMeNot) and it's Chrome variant [here](https://github.com/vtoubiana/TrackMeNot-Chrome). They don't seem to be very active.

The original code seems to have a history and isn't properly maintained. It also seems that Chrome version had been hastily forked from original Firefox extension. From the comments in code it seem that even authors themselves do not understand exactly how it works. And it had some bugs.

I am no expert in javascript or writing extensions for Chrome, far from that but it seems fun to play with that and test some ideas.

Most of the changes I have made are in the main logic - trackmenot.js

## So far

* improved importing keywords from RSS feeds - original code had a bug and imported from only the last RSS in the list, sometimes multiple times

* added more verbose messages to console - trying to understand how it really works

* refarctored code for some functions - changed names to more descriptive

* changed logic for random selection of queries - this is where I am playing currently testing various ideas so it changes often and might be suboptimal

* improved roll function, renamed and re-factored some others

* added non-uniform distribution of query length
