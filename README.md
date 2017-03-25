# TrackMeNot
My fork of original TrackMeNot - Chrome extension repository. Experimenting, improving, sometimes breaking things.

Original repo [here](https://github.com/vtoubiana/TrackMeNot) and it's Chrome variant [here](https://github.com/vtoubiana/TrackMeNot-Chrome). They don't seem to be very active.

The original code seems to have a history and isn't actively maintained. It also seems that Chrome version had been hastily forked from original Firefox extension. From the comments in code it seem that even authors themselves do not understand exactly how it works. And it had some bugs.

I am no expert in javascript or writing extensions for Chrome, far from that but it seems fun to play with that and test some ideas.

Most of the changes I have made are in the main logic - trackmenot.js

## So far

* improved import of keywords from RSS feeds - original code had a bugs and imported from only the last RSS in the list, sometimes multiple times

* added more verbose messages to console - trying to understand how it really works

* re-factored code for some functions - changed names to more descriptive

* changed logic for random selection of queries - **this is where I am playing currently** testing various ideas so it is evolving and might be suboptimal

* removed logic of incremental queries - for now

* improved roll() function

* changed logic of *zeitgeist* queries. But I am still not happy with the results.

* added non-uniform distributions, for example for selecting query length

* added XregExp.js library - now we could process queries and results in languages other then English

* added nlp_compromise.js library - we are now using NLP to extract meaningful search terms from noise - like 'Noun', 'Person', 'City'

* removed multiple bugs - some introduced by myself

* optimized some logic flow 

## How it works

[TrackMeNot webpage](https://cs.nyu.edu/trackmenot/)

[Read the FAQ](https://cs.nyu.edu/trackmenot/faq.html) of original extension (but keep in mind that I have augmented the logic). 

This is quite neat extension. In short it is sending queries in the background to chosen search engines. It is quite smart - if you do some searches using for example Google in Singapore the extension will learn about is and start directing queries to www.google.com.sg and using all the parameters from your original query. So it mimics your original search. 

Even more if you enable burst mode the extension will start sending a flood of queries right after your search so your original search is lost between random queries. I really like this feature.

You have to seed the extension using three types of sources - rss (the extension is extracting titles form RSS feeds) and zeitgest (it could be edited in code for now) - some everlasting popular search terms like youtube or facebook. Later on the extension will start scrapping search results and using them as seed for generating new queries.

## Remarks

I am optimizing mostly for (or against) Google Search ignoring other search engines. At least at the moment.

This extension is a bit schizophrenic cause using XRegExp I am able to proces queries and results also in other scipts then ISO like Chinese or Japanese but at the same time I am using NLP and some other logic that works only for English. Well, it has to stay that way I guess.
