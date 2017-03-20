/*******************************************************************************    
    This file is part of TrackMeNot (Chrome version).

    TrackMeNot is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation,  version 2 of the License.

    TrackMeNot is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
 ********************************************************************************/
var _ = chrome.i18n.getMessage;


if (!TRACKMENOT) var TRACKMENOT = {};

TRACKMENOT.TMNSearch = function() {
    var tmn_tab_id = -1;
    var tmn_tab = null;
    var useTab = false;
    var enabled = true;
    var debug_ = true;
    var load_full_pages = false;
    var last_url = "";
    var stop_when = "start"
    var useIncrementals = true;
    var incQueries = [];
    var searchEngines = "google";
    var engine = 'google';
    var TMNQueries = {};
    var branch = "extensions.trackmenot."
    var feedList = "http://feeds.musicchartfeeds.com/itunes-pop-chart~http://www.todayonline.com/feed/singapore~http://www.straitstimes.com/news/singapore/rss.xml~http://stackoverflow.com/feeds/tag/android+or+html+or+javascript+or+python~https://news.ycombinator.com/rss~https://trends.google.com/trends/hottrends/atom/feed?pn=p5";
    var tmnLogs = [];
    var disableLogs = false;
    var saveLogs = true;
    var kwBlackList = [];
    var useBlackList = true;
    var useDHSList = false;
    var typeoffeeds = [];
    var zeitgeist = ["facebook", "youtube", "netflix", "amazon", "grab", "Donald Trump", "7-Eleven", "Lee Chong Wei", "Nintendo Switch", "Google Pixel", "Emily Blunt", "JJ Lin", "Beauty and the Beast", "weather Bali", "hotels Thailand", "Bali flights", "Bangkok", "Denpasar", "Jakarta", "Lombok", "uber Kuta", "Air Asia", "Traveloka promo", "Tiger", "Chiangi", "Phuket", "Ko Samui", "hotel deals"]
    var tmn_timeout = 60000;
    var prev_engine = "None"
    var burstEngine = '';
    var burstTimeout = 6000;
    var burstEnabled = true;
    var tmn_searchTimer = null;
    var burstCount = 0;
    var tmn_id = 0;
    var tmn_logged_id = 0;
    var tmn_mode = 'timed';
    var tmn_errTimeout = null;
    var tmn_scheduledSearch = false;
    var tmn_query = 'No query sent yet';
    var currentTMNURL = '';
    var tmn_option_tab = null;
    var worker_tab, worker_opt;


    //var search_script = [data.url("jquery.js"),data.url("tmn_search.js")];

    var skipex = new Array(
        /calendar/i, /advanced/i, /click /i, /terms/i, /Groups/i,
        /Images/, /Maps/, /search/i, /cache/i, /similar/i, /&#169;/,
        /sign in/i, /help[^Ss]/i, /download/i, /print/i, /Books/i, /rss/i,
        /google/i, /bing/i, /yahoo/i, /aol/i, /html/i, /ask/i, /xRank/,
        /permalink/i, /aggregator/i, /trackback/, /comment/i, /More/,
        /business solutions/i, /result/i, / view /i, /Legal/, /See all/,
        /links/i, /submit/i, /Sites/i, / click/i, /Blogs/, /See your mess/,
        /feedback/i, /sponsored/i, /preferences/i, /privacy/i, /News/,
        /Finance/, /Reader/, /Documents/, /windows live/i, /tell us/i,
        /shopping/i, /Photos/, /Video/, /Scholar/, /AOL/, /advertis/i,
        /Webmasters/, /MapQuest/, /Movies/, /Music/, /Yellow Pages/,
        /jobs/i, /answers/i, /options/i, /customize/i, /settings/i,
        /Developers/, /cashback/, /Health/, /Products/, /QnABeta/,
        /<more>/, /Travel/, /Personals/, /Local/, /Trademarks/,
        /cache/i, /similar/i, /login/i, /mail/i, /feed/i
    )

    var testAd_google = function(anchorClass, anchorlink) {
        return (anchorlink &&
            (anchorClass == 'l' || anchorClass == 'l vst') &&
            anchorlink.indexOf('http') == 0 &&
            anchorlink.indexOf('https') != 0);
    }

    var testAd_yahoo = function(anchorClass, anchorlink) {
        return (anchorClass == '\"yschttl spt\"' || anchorClass == 'yschttl spt');
    }

    var testAd_aol = function(anchorClass, anchorlink) {
        return (anchorClass == '\"find\"' || anchorClass == 'find' &&
            anchorlink.indexOf('https') != 0 && anchorlink.indexOf('aol') < 0);
    }

    var testAd_bing = function(anchorClass, anchorlink) {
        return (anchorlink &&
            anchorlink.indexOf('http') == 0 &&
            anchorlink.indexOf('https') != 0 &&
            anchorlink.indexOf('msn') < 0 &&
            anchorlink.indexOf('live') < 0 &&
            anchorlink.indexOf('bing') < 0 &&
            anchorlink.indexOf('microsoft') < 0 &&
            anchorlink.indexOf('WindowsLiveTranslator') < 0)
    }

    var testAd_baidu = function(anchorClass, anchorlink) {
        return (anchorlink &&
            anchorlink.indexOf('baidu') < 0 &&
            anchorlink.indexOf('https') != 0);
    }


    var getButton_google = " var getButton = function(  ) {var button = getElementsByAttrValue(document,'button', 'name', 'btnG' );     if ( !button ) button = getElementsByAttrValue(document,'button', 'name', 'btnK' );return button;}"
    var getButton_yahoo = " var getButton = function(  ) {return getElementsByAttrValue(document,'input', 'class', 'sbb' ); } "
    var getButton_bing = " var getButton = function(  ) {return document.getElementById('sb_form_go');}  "
    var getButton_aol = " var getButton = function (  ) {return document.getElementById('csbbtn1');   }"
    var getButton_baidu = " var getButton = function (  ){ return getElementsByAttrValue(document,'input', 'value', '????' ); }"



    SearchBox_google = "var searchbox = function( ) { return getElementsByAttrValue(document,'input', 'name', 'q' ); } "
    SearchBox_yahoo = "var searchbox = function(  ) { return document.getElementById('yschsp');}"
    SearchBox_bing = "var searchbox = function(  ) {return document.getElementById('sb_form_q'); } "
    SearchBox_aol = "var searchbox = function(  ) {return document.getElementById('csbquery1');  }"
    SearchBox_baidu = "var searchbox = function(  ) {return document.getElementById('kw');}"


    var suggest_google = ['gsr', 'td', function(elt) {
        return (elt.hasAttribute('class') && elt.getAttribute('class') == 'gac_c')
    }]

    var suggest_yahoo = ['atgl', 'a', function(elt) {
        return elt.hasAttribute('gossiptext')
    }]

    var suggest_bing = ['sa_drw', 'li', function(elt) {
        return (elt.hasAttribute('class') && elt.getAttribute('class') == 'sa_sg')
    }]

    var suggest_baidu = ['st', 'tr', function(elt) {
        return (elt.hasAttribute('class') && elt.getAttribute('class') == 'ml')
    }]

    var suggest_aol = ['ACC', 'a', function(elt) {
        return (elt.hasAttribute('class') && elt.getAttribute('class') == 'acs')
    }]




    var engines = [{
            'id': 'google',
            'name': 'Google Search',
            'urlmap': "https://www.google.com/search?hl=en&q=|",
            'regexmap': "^(https?:\/\/[a-z]+\.google\.(co\\.|com\\.)?[a-z]{2,3}\/(search){1}[\?]?.*?[&\?]{1}q=)([^&]*)(.*)$",
            "host": "(www\.google\.(co\.|com\.)?[a-z]{2,3})$",
            "testad": "var testad = function(ac,al) {return ( al&& (ac=='l'  || ac=='l vst')&& al.indexOf('http')==0 && al.indexOf('https')!=0);}",
            'box': SearchBox_google,
            'button': getButton_google
        },
        {
            'id': 'yahoo',
            'name': 'Yahoo! Search',
            'urlmap': "http://search.yahoo.com/search;_ylt=" + getYahooId() + "?ei=UTF-8&fr=sfp&fr2=sfp&p=|&fspl=1",
            'regexmap': "^(http:\/\/[a-z.]*?search\.yahoo\.com\/search.*?p=)([^&]*)(.*)$",
            "host": "([a-z.]*?search\.yahoo\.com)$",
            "testad": "var testad = function(ac,al) {return ( ac=='\"yschttl spt\"' || ac=='yschttl spt');}",
            'box': SearchBox_yahoo,
            'button': getButton_yahoo
        },
        {
            'id': 'bing',
            'name': 'Bing Search',
            'urlmap': "http://www.bing.com/search?q=|",
            'regexmap': "^(http:\/\/www\.bing\.com\/search\?[^&]*q=)([^&]*)(.*)$",
            "host": "(www\.bing\.com)$",
            "testad": "var testad = function(ac,al) {return ( al&& al.indexOf('http')==0&& al.indexOf('https')!=0 && al.indexOf('msn')<0 && al.indexOf('live')<0  && al.indexOf('bing')<0&& al.indexOf('microsoft')<0 && al.indexOf('WindowsLiveTranslator')<0 )    }",
            'box': SearchBox_bing,
            'button': getButton_bing
        },
        {
            'id': 'baidu',
            'name': 'Baidu Search',
            'urlmap': "http://www.baidu.com/s?wd=|",
            'regexmap': "^(http:\/\/www\.baidu\.com\/s\?.*?wd=)([^&]*)(.*)$",
            "host": "(www\.baidu\.com)$",
            "testad": "var testad = function(ac,al) {return ( al&& al.indexOf('baidu')<0 && al.indexOf('https')!=0  );}",
            'box': SearchBox_baidu,
            'button': getButton_baidu
        },
        {
            'id': 'aol',
            'name': 'Aol Search',
            'urlmap': "http://search.aol.com/aol/search?q=|",
            'regexmap': "^(http:\/\/[a-z0-9.]*?search\.aol\.com\/aol\/search\?.*?q=)([^&]*)(.*)$",
            "host": "([a-z0-9.]*?search\.aol\.com)$",
            "testad": "var testad = function(ac,al){return(ac=='\"find\"'||ac=='find'&& al.indexOf('https')!=0 && al.indexOf('aol')<0 );}",
            'box': SearchBox_aol,
            'button': getButton_aol
        }
    ]




    function getEngIndexById(id) {
        for (var i = 0; i < engines.length; i++) {
            if (engines[i].id == id) return i
        }
        return -1
    }

    function getEngineById(id) {
        return engines.filter(function(a) {
            return a.id == id
        })[0]
    }




    function updateEngineList() {
        chrome.storage.local.set({
            engines: JSON.stringify(engines)
        });
        sendMessageToOptionScript("TMNSendEngines", engines);
        sendOptionToTab();
    }



    function sendMessageToOptionScript(title, message) {
        chrome.runtime.sendMessage({
            "options": title,
            "param": message
        })
    }

    function handleMessageFromOptionScript(title, handler) {
        worker_opt.port.on(title, handler)
    }


    function sendMessageToPanelScript(title, message) {
        chrome.runtime.sendMessage(title, message)
    }

    function handleMessageFromPanelScript(title, handler) {
        tmn_panel.port.on(title, handler)
    }




    function sendOptionParameters() {
        debug("Sending perameters")
        var panel_inputs = {
            "options": getOptions(),
            "query": tmn_query,
            "engine": prev_engine
        }
        sendMessageToPanelScript("TMNSendOption", panel_inputs)
        tmn_panel.port.on("TMNOpenOption", openOptionWindow)
        tmn_panel.port.on("TMNSaveOptions", saveOptionFromTab)
    }

    function openOptionWindow() {
        tabs.open({
            url: data.url("options.html"),
            onReady: runScript
        });
    }

    function runScript(tab) {
        worker_opt = tab.attach({
            contentScriptFile: [data.url("jquery.js"), data.url("option-script.js")]
        });
        sendOptionToTab();
        /*handleMessageFromOptionScript("TMNSaveOptions",saveOptionFromTab)
        handleMessageFromOptionScript("TMNOptionsShowLog", sendLogToOption)
        handleMessageFromOptionScript("TMNOptionsShowQueries", sendQueriesToOption)
        handleMessageFromOptionScript("TMNOptionsClearLog", clearLog)
        handleMessageFromOptionScript("TMNValideFeeds", validateFeeds)
        handleMessageFromOptionScript("TMNAddEngine",addEngine)
        handleMessageFromOptionScript("TMNDelEngine",delEngine)*/
    }



    function sendOptionToTab() {
        var tab_inputs = {
            "options": getOptions()
        }
        sendMessageToOptionScript("TMNSendEngines", engines)
        sendMessageToOptionScript("TMNSetOptionsMenu", tab_inputs)
    }

    function clearLog() {
        tmnLogs = [];
        sendLogToOption();
    }

    function saveOptionFromTab(options) {
        if (enabled != options.enabled) {
            if (options.enabled) restartTMN();
            else stopTMN();
        }
        debug("useTab: " + options.useTab)
        tmn_timeout = options.timeout;
        searchEngines = options.searchEngines;
        burstEnabled = options.burstMode;
        disableLogs = options.disableLogs;
        saveLogs = options.saveLogs;
        useBlackList = options.use_black_list;
        if (useDHSList != options.use_dhs_list) {
            if (options.use_dhs_list) {
                readDHSList();
                typeoffeeds.push('dhs');
            } else {
                typeoffeeds.splice(typeoffeeds.indexOf('dhs'), 1)
                TMNQueries.dhs = null;
            }
            useDHSList = options.use_dhs_list;
        }

        kwBlackList = options.kw_black_list.split(',');
        debug("Searched engines: " + searchEngines)
        changeTabStatus(options.useTab);
        saveOptions();
    }


    function changeTabStatus(useT) {
        if (useT == useTab) return;
        if (useT) {
            useTab = useT;
            createTab();
        } else {
            useTab = useT;
            deleteTab();
        }
    }


    function iniTab(tab) {
        tmn_tab_id = tab.id;
        tmn_win_id = tab.windowId;
        chrome.storage.local.set({
            "tmn_tab_id": tmn_tab_id
        });
    }

    function getTMNTab() {
        debug("Trying to access to the tab: " + tmn_tab_id);
        return tmn_tab_id;
    }

    function deleteTab() {
        chrome.tabs.remove(tmn_tab_id);
        tmn_tab_id = -1;
    }

    function createTab() {
        if (!useTab || tmn_tab_id != -1) return;
        if (debug) cout('Creating tab for TrackMeNot')
        try {
            chrome.tabs.create({
                'active': false,
                'url': 'http://www.google.com'
            }, iniTab);
            return 1;
        } catch (ex) {
            cerr('Can not create TMN tab:', ex);
            return null;
        }
    }


    function addEngine(param) {
        var name = param.name;
        var urlmap = param.urlmap;
        var new_engine = {}
        new_engine.name = name;
        new_engine.id = name.toLowerCase();
        var map = urlmap.replace('trackmenot', '|');
        new_engine.urlmap = map;
        var query_params = map.split('|');
        var kw_param = query_params[0].split('?')[1].split('&').pop();
        new_engine.regexmap = '^(' + map.replace(/\//g, "\\/").replace(/\./g, "\\.").split('?')[0] + "\\?.*?[&\\?]{1}" + kw_param + ")([^&]*)(.*)$"
        engines.push(new_engine);
        debug("Added engine : " + new_engine.name + " url map is " + new_engine.urlmap)
        updateEngineList
    }



    function delEngine(param) {
        var del_engine = param.engine;
        var index = getEngIndexById(del_engine);
        searchEngines = searchEngines.split(',').filter(function(a) {
            return a != del_engine
        }).join(',');
        engines.splice(index, 1)
        saveOptions();
        updateEngineList()
    }

    function getYahooId() {
        var id = "A0geu";
        while (id.length < 24) {
            var lower = Math.random() < .5;
            var num = parseInt(Math.random() * 38);
            if (num == 37) {
                id += '_';
                continue;
            }
            if (num == 36) {
                id += '.';
                continue;
            }
            if (num < 10) {
                id += String.fromCharCode(num + 48);
                continue;
            }
            num += lower ? 87 : 55;
            id += String.fromCharCode(num);
        }
        // cout("GENERATED ID="+id);
        return id;
    }

    function chomp(s) {
        return s.replace(/\n/g, '');
    }

    function cerr(msg, e) {
        var txt = "[ERROR] " + msg;
        if (e) {
            txt += "\n" + e;
            if (e.message) txt += " | " + e.message;
        } else txt += " / No Exception";
        cout(txt);
    }

    function cout(msg) {
        console.log(msg);
    }

    function debug(msg) {
        if (debug_)
            console.log("DEBUG: " + msg);
    }

    function roll(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
        // return Math.floor(Math.random() * (max + 1)) + min;
    }

    function randomElement(array) {
        // cout("Array length: " + array.length)
        var index = roll(0, array.length - 1);
        cout('randomElement: ' + array[index]);
        return array[index];
}


function box_muller() {
// Standard Normal variate using Box-Muller transform.
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}


function roll_gauss(min, max) {
        return Math.floor(box_muller() * (max - min + 1)) + min;
}


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


    function monitorBurst() {
        chrome.webNavigation.onCommitted.addListener(function(e) {
            var url = e.url;
            var tab_id = e.tabId;
            var result = checkForSearchUrl(url);
            if (!result) {
                if (tab_id == tmn_tab_id) {
                    debug("TMN tab tryign to visit: " + url)
                    worker.port.emit("TMNStopLoading");
                }
                return;
            }

            //
            // -- EXTRACT DATA FROM THE URL
            var pre = result[1];
            var query = result[2];
            var post = result[3];
            var eng = result[4];
            var asearch = pre + '|' + post;
            if (tmn_tab_id == -1 || tab_id != tmn_tab_id) {
                debug("Worker find a match for url: " + url + " on engine " + eng + "!")
                if (burstEnabled) enterBurst(eng)
                var updated_SE = getEngineById(eng)
                if (updated_SE && updated_SE.urlmap != asearch) {
                    updated_SE.urlmap = asearch;
                    chrome.storage.local.set({
                        engines: JSON.stringify(engines)
                    });
                    var logEntry = createLog('URLmap', eng, null, null, null, asearch)
                    log(logEntry);
                    debug("Updated url for search engine " + eng + ", new url is " + asearch);
                }
            }
        });

    }

    function checkForSearchUrl(url) {
        var result = null;
        for (var i = 0; i < engines.length; i++) {
            var eng = engines[i]
            var regex = eng.regexmap;
            debug("  regex: " + regex + "  ->\n                   " + url);
            result = url.match(regex);

            if (result) {
                cout(regex + " MATCHED! on " + eng.id);
                break;
            }
        }
        if (!result) return null;

        if (result.length != 4) {
            if (result.length == 6 && eng.id == "google") {
                result.splice(2, 2);
                result.push(eng.id);
                return result;
            }
            cout("REGEX_ERROR: " + url);
            /* for (var i in result)
                cout(" **** "+i+")"+result[i])*/
        }
        result.push(eng.id);
        return result;
    }




    function isBursting() {
        return burstEnabled && burstCount > 0;
    }


    function chooseEngine(engines) {
        return engines[Math.floor(Math.random() * engines.length)]
    }


    function randomQuery() {
        // here query randomization happens
        var qtype = randomElement(typeoffeeds)
        cout('randomQuery: query type: ' + qtype);
        var queries = [];
        if (qtype != 'zeitgeist' && qtype != 'extracted') {
            var queryset = TMNQueries[qtype];
            queries = randomElement(queryset).words;
        } else queries = TMNQueries[qtype];
        var term = chomp(randomElement(queries));
        if (!term || term.length < 1)
            throw new Error("queryIdx=" + queryIdx + " getQuery.term='" + term + "'");
        return term;
    }


    function validateFeeds(param) {
        TMNQueries.rss = [];
        feedList = param.feeds;
        cout("Validating the feeds: " + feedList)
        var feeds = feedList.split(/~/);
        for (var i = 0; i < feeds.length; i++) {
            cout("validateFeeds  ");
            cout(feeds[i]);
            doRssFetch(feeds[i]);
        }
        saveOptions();
    }

    function extractQueries(html) {
        // This if optimized for extracion for Google Search result pages
        if (!html) {
            cout("NO HTML!");
            return;
        }
        var distribution = [1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6, 7, 8];
        var possibleSearchResults = html.split("<span class=\"st\">")
        if (typeof TMNQueries.extracted == 'undefined') {
            TMNQueries.extracted = [];
        }
        var i = possibleSearchResults.length;
        while (i--) {
            var singleSearchResult = possibleSearchResults[i].split('</span>')[0]
            if (singleSearchResult.length < 24 || singleSearchResult.length > 210) continue;
            if (singleSearchResult.indexOf('days ago') != -1 || singleSearchResult.indexOf('1 day ago') != -1 || singleSearchResult.indexOf('hours ago') != -1 || singleSearchResult.indexOf('1 hour ago') != -1) continue;
            if (singleSearchResult.indexOf('mins ago') != -1 || singleSearchResult.indexOf(' 201') != -1 | singleSearchResult.indexOf(' 200') != -1) continue;
            // remove remaining HTML  tags
            var cleanSearchResult = singleSearchResult.replace(/<(?:.|\n)*?>/gm, '');
            cout('extractQueries: ' + cleanSearchResult);
            // removes '&amp;', '&nbsp;' etc.
            cleanSearchResult = cleanSearchResult.replace(/&(.*?);/gm, '');
            // removes '-' and ',' '.'  '(' ')' '?'
            cleanSearchResult = cleanSearchResult.replace(/, |- |\. | \(|\) |\? /gm, ' ');
            // remove glue
            cleanSearchResult = cleanSearchResult.replace(/ and | with | a | an | any | it | has /gm, ' ');
            //  finally replace multiple spaces with single space
           cleanSearchResult = cleanSearchResult.replace( /\s\s+/g, ' ' );
            var resultWords = cleanSearchResult.split(' ');
            /* 
            var j = resultWords.length;
            var uppercaseWords = [];
            while (j--) {
                var firstLetter = resultWords[j].charAt(0);
                if(firstLetter != firstLetter.toUpperCase()) continue;
                uppercaseWords.push(resultWords[j]);
            }
            cout('extractQueries - Uppercase: ' +  uppercaseWords.join(' '));
            */
            /* Random words
            var randomHalfLength = Math.floor((Math.random()  - 0.5)* Math.floor(resultWords.length/2));
            var randomLength = Math.floor((Math.random() - 0.5) * resultWords.length);
            var randomWords =  resultWords.slice(randomHalfLength, randomLength).join(' '); 
            cout('extractQueries - random: ' + randomWords); 
            */

            // My intuition is that typical search length has different distribution then uniform
            // TODO - better
            var randomLength = distribution[roll(0, 15)];
            var firstWords = resultWords.slice(0, randomLength).join(' ');
            cout('extractQueries - shorted: ' + firstWords);

            addQuery(firstWords, TMNQueries.extracted);
        }
        // Longest queries should be removed  with highier priority ?  TODO
        while (TMNQueries.extracted.length > 200) {
           // var rand = roll(0, TMNQueries.extracted.length - 1);
            TMNQueries.extracted.sort(function(a, b){
                      // ASC  -> a.length - b.length DESC -> b.length - a.length
                      return b.length - a.length;
                    })
            // TMNQueries.extracted.splice(rand, 1);
            TMNQueries.extracted.splice(0, 1);
            // And ocasionally nuke shortest words
            if (roll(0,100) > 95) {
                TMNQueries.extracted.splice(150, 50);
            }
        }
        cout(TMNQueries.extracted);
    }

    function isBlackList(term) {
        if (!useBlackList) return false;
        var words = term.split(/\W/g);
        for (var i = 0; i < words.length; i++) {
            if (kwBlackList.indexOf(words[i].toLowerCase()) >= 0)
                return true;
        }
        return false;
    }

    function queryOk(a) {
        for (i = 0; i < skipex.length; i++) {
            if (skipex[i].test(a))
                return false
        }
        return true;
    }

    function addQuery(term, queryList) {
        var noniso = new RegExp("[^a-zA-Z0-9_.\ \\u00C0-\\u00FF+]+", "g");

        term = term.replace(noniso, '')
        term = chomp(term);

        if (isBlackList(term))
            return false;

        if (!term || (term.length < 3) || (queryList.indexOf(term) > 0))
            return false;

        if (term.indexOf("\"\"") > -1 || term.indexOf("--") > -1)
            return false;

        // test for negation of a single term (eg '-prison') 
        if (term.indexOf("-") == 0 && term.indexOf(" ") < 0)
            return false;

        if (!queryOk(term))
            return false;

        queryList.push(term);
        //gtmn.cout("adding("+gtmn._queries.length+"): "+term);

        return true;
    }


    // returns # of keywords added
    function filterKeyWords(rssTitles, feedUrl) {
        var addStr = ""; //tmp-debugging
        var forbiddenChar = new RegExp("[ \d{1,2}\.@#<>\"\\\/,;'Õ{}:?%|\^~`=]+", "g");
        var splitRegExp = new RegExp('[\\[\\]\\(\\)\\"\']+', "g");
        var wordArray = rssTitles.split(forbiddenChar);

        for (var i = 0; i < wordArray.length; i++) {
            if (!wordArray[i].match('-----')) {
                var word = wordArray[i].split(splitRegExp)[0];
                if (word && word.length > 2) {
                    W: while (i < (wordArray.length) && wordArray[i + 1] && !(wordArray[i + 1].match('-----') ||
                            wordArray[i + 1].match(splitRegExp))) {
                        var nextWord = wordArray[i + 1]; // added new check here -dch
                        if (nextWord != nextWord.toLowerCase()) {
                            nextWord = chomp(nextWord.toLowerCase().replace(/\s/g, '').replace(/[(<>"'Õ&]/g, ''));
                            if (nextWord.length > 1) {
                                word += ' ' + nextWord;
                            }
                        }
                        i++;
                    }
                    word = word.replace(/-----/g, '')
                    addStr += word + ", "; //tmp
                }
            }
        }
        return addStr;
    }


    // returns # of keywords added - No it doesn't
    function addRssTitles(xmlData, feedUrl) {
        //cout('addRssTitles: ');
        var rssTitles = "";
        var feedTitles = xmlData.getElementsByTagName("title");
        // cout(feedTitles);
        if (!feedTitles || feedTitles.length < 2) {
            cerr("no items(" + feedTitles + ") for rss-feed: " + feedUrl);
            return 0;
        }
        var feedObject = {};
        feedObject.name = feedTitles[0].firstChild.nodeValue;
        feedObject.words = [];
        cout('addRSSTitles : ' + feedTitles[0].firstChild.nodeValue);
        for (var i = 1; i < feedTitles.length; i++) {
            if (feedTitles[i].firstChild) {
                rssTitles = feedTitles[i].firstChild.nodeValue;
                rssTitles += " ----- ";
            }
            var queryToAdd = filterKeyWords(rssTitles, feedUrl);
            addQuery(queryToAdd, feedObject.words);
        }
        cout(feedObject.name + " : " + feedObject.words)
        TMNQueries.rss.push(feedObject);

        return 1;
    }


    function readDHSList() {
        TMNQueries.dhs = [];
        var i = 0;
        var req = new XMLHttpRequest();
        req.overrideMimeType("application/json");
        req.open('GET', chrome.extension.getURL("dhs_keywords.json"), true);
        req.onreadystatechange = function() {
            var response = JSON.parse(req.responseText);
            var keywords = response.keywords;
            for (var cat of keywords) {
                TMNQueries.dhs[i] = {};
                TMNQueries.dhs[i].category_name = cat.category_name;
                TMNQueries.dhs[i].words = [];
                for (var word of cat.category_words)
                    TMNQueries.dhs[i].words.push(word.name)
                i++;
            }
        };
        req.send(null);
    }


    function doRssFetch(feedUrl) {
        cout('doRSSFetch: ' + feedUrl);
        try {
            var req = new XMLHttpRequest();
            req.open('GET', feedUrl, true); // false == not async
            req.onreadystatechange = function() {
                if (req.readyState == 4 && req.status == 200 && req.responseXML != null) {
                    cout("doRSSFetch: Recieved feed from " + feedUrl);
                    var adds = addRssTitles(req.responseXML, feedUrl);
                    // cout(req.responseXML);
                    //cout(req.responseText);
                }
            }
            req.send();
        } catch (ex) {
            cout("[WARN]  doRssFetch(" + feedUrl + ")\n" +
                "  " + ex.message + " | Using defaults...");
            return; // no adds here...             
        }
    }

    function getSubQuery(queryWords) {
        var incQuery = "";
        var randomArray = new Array();
        for (var k = 0; k < queryWords.length; k++) {
            randomIndex = roll(0, queryWords.length - 1);
            if (randomArray.indexOf(randomIndex) < 0)
                randomArray.push(randomIndex);
        }
        randomArray.sort()
        for (k = 0; k < randomArray.length - 1 && k < 5; k++) {
            incQuery += queryWords[randomArray[k]] + ' ';
        }
        incQuery += queryWords[randomArray[k]];
        if (incQueries)
            incQueries.push(chomp(incQuery));
    }


    function getQuery() {
        var term = randomQuery();
        term = chomp(term);
        cout('getQuery: term: ' + term);
        return term;
    }


    function updateOnErr() {
        var details = {
            'text': 'Error'
        };
        var tooltip = {
            'title': 'TMN Error'
        };
        chrome.browserAction.setBadgeBackgroundColor({
            'color': [255, 0, 0, 255]
        })
        chrome.browserAction.setBadgeText(details);
        chrome.browserAction.setTitle(tooltip);
    }

    function updateOnSend(queryToSend) {
        tmn_query = queryToSend;
        var details = {
            'text': queryToSend
        };
        var tooltip = {
            'title': engine + ': ' + queryToSend
        };
        chrome.browserAction.setBadgeBackgroundColor({
            'color': [113, 113, 198, 255]
        })
        chrome.browserAction.setBadgeText(details);
        chrome.browserAction.setTitle(tooltip);
    }

    function createLog(type, engine, mode, query, id, asearch) {
        var logEntry = {
            'type': type,
            "engine": engine
        };
        if (mode) logEntry.mode = tmn_mode
        if (query) logEntry.query = query
        if (id) logEntry.id = id
        if (asearch) logEntry.newUrl = asearch
        return logEntry;
    }

    function doSearch() {
        // removed logic of incremental queries
        // TODO - think of some randomization / mixing / 
        var newquery = getQuery();
        try {
            sendQuery(newquery);
        } catch (e) {
            cerr("error in doSearch", e);
        }
    }

    function sendQuery(queryToSend) {
        tmn_scheduledSearch = false;
        cout("Engine: " + engine)
        var url = getEngineById(engine).urlmap;
        // var isIncr = (queryToSend == null);
        if (!queryToSend) { 
                cout('sendQuery error! queryToSend is null')
                return;
            }
        if (Math.random() < 0.8) queryToSend = queryToSend.toLowerCase();
        if (queryToSend[0] == ' ') queryToSend = queryToSend.substr(1); //remove the first space ;

        if (useTab) {
            if (getTMNTab() == -1) createTab();
            var TMNReq = {
                tmnQuery: queryToSend,
                tmnEngine: getEngineById(engine),
                allEngines: engines,
                tmnUrlMap: url,
                tmnMode: tmn_mode,
                tmnID: tmn_id++
            }
            try {
                chrome.tabs.sendMessage(tmn_tab_id, TMNReq);
                debug('Message sent to the tab');
            } catch (ex) {
                rescheduleOnError();
            }

        } else {
            var queryUrl = queryToURL(url, queryToSend);
            cout('url: ' + url);
            cout("The encoded URL is " + queryUrl);
            updateOnSend(queryToSend);
            currentTMNURL = queryUrl;
            try {
                var req = new XMLHttpRequest();
                req.open('GET', queryUrl, true); // false == not async
                req.onreadystatechange = function() {
                    if (req.readyState == 4 && req.status == 200 && req.responseText != null) {
                        clearTimeout(tmn_errTimeout);
                        reschedule();
                        cout("sendQuery: Recieved search results from " + queryUrl);
                        // cout(req.responseXML);
                        //cout(req.responseText);
                        var logEntry = {
                            type: 'query',
                            engine: engine,
                            mode: tmn_mode,
                            query: queryToSend,
                            id: tmn_id++
                        };
                        log(logEntry);
                        // Not possible to scratch Google Search results ?
                        extractQueries(req.responseText);
                    } else {
                        //cout(req.readyState + " " + req.status);
                    }
                }
                req.send();
            } catch (ex) {
                cout("[WARN]  sendQuery(" + queryUrl + ")\n" + "  " + ex.message);
                rescheduleOnError();
            }
        }
    }


    function queryToURL(url, query) {
        if (Math.random() < 0.76)
            query = query.toLowerCase();
        var urlQuery = url.replace('|', query);
        urlQuery = urlQuery.replace(/ /g, '+');
        var encodedUrl = encodeURI(urlQuery);
        encodedUrl = encodedUrl.replace(/%253/g, "%3");

        return encodedUrl;
    }

    function updateCurrentURL(taburl) {
        currentTMNURL = taburl.url;
        debug("currentTMNURL is :" + currentTMNURL)
    }



    function rescheduleOnError() {
        var pauseAfterError = Math.max(2 * tmn_timeout, 60000);
        tmn_mode = 'recovery';
        burstCount = 0;
        cout("[INFO] Trying again in " + (pauseAfterError / 1000) + "s")
        log({
            'type': 'ERROR',
            'message': 'next search in ' + (pauseAfterError / 1000) + "s",
            'engine': engine
        });
        updateOnErr();

        // reschedule after long pause
        if (enabled)
            scheduleNextSearch(pauseAfterError);
        return false;
    }

    function reschedule() {
        var delay = tmn_timeout;

        if (tmn_scheduledSearch) return;
        else tmn_scheduledSearch = true;

        if (isBursting()) { // schedule for burs t
            delay = Math.min(delay, burstTimeout);
            scheduleNextSearch(delay);
            tmn_mode = 'burst';
            burstCount--;
        } else { // Not bursting, schedule per usual
            tmn_mode = 'timed';
            scheduleNextSearch(delay);
        }
    }

    function scheduleNextSearch(delay) {
        if (!enabled) return;
        if (delay > 0) {
            if (!isBursting()) { // randomize to approach target frequency
                var offset = delay * (Math.random() / 2);
                delay = parseInt(delay) + offset;
            } else { // just simple randomize during a burst           
                delay += delay * (Math.random() - .5);
            }
        }
        if (isBursting()) engine = burstEngine;
        else engine = chooseEngine(searchEngines.split(','));
        debug('NextSearchScheduled on: ' + engine);
        tmn_errTimeout = window.setTimeout(rescheduleOnError, delay * 3);
        tmn_searchTimer = window.setTimeout(doSearch, delay);
    }

    function enterBurst(burst_engine) {
        if (!burstEnabled) return;
        cout("Entering burst mode for engine: " + burst_engine)
        var logMessage = {
            type: 'info',
            message: 'User made a search, start burst',
            engine: burst_engine
        };
        log(logMessage);
        burstEngine = burst_engine;
        burstCount = roll(3, 10);
    }

    function deleteTabWithUrl(tabURL) {
        for (var tab of tabs)
            if (tab.url == tabURL) {
                tab.close();
                return;
            }
    }


    function saveOptions() {
        //ss.storage.kw_black_list = kwBlackList.join(",");
        var options = getOptions();
        localStorage["options_tmn"] = JSON.stringify(options);
        localStorage["tmn_id"] = tmn_id;
        localStorage["gen_queries"] = JSON.stringify(TMNQueries);

    }




    function getOptions() {
        var options = {};
        options.enabled = enabled;
        options.timeout = tmn_timeout;
        options.searchEngines = searchEngines;
        options.useTab = useTab;
        options.burstMode = burstEnabled;
        options.feedList = feedList;
        options.use_black_list = useBlackList;
        options.use_dhs_list = useDHSList;
        options.kw_black_list = kwBlackList.join(",");
        options.saveLogs = saveLogs;
        options.disableLogs = disableLogs;
        return options;
    }


    function initOptions() {
        enabled = true;
        timeout = 90000;
        burstMode = true;
        searchEngines = "google";
        useTab = false;
        useBlackList = true;
        useDHSList = false;
        kwBlackList = ['bomb', 'porn', 'islam', 'bdsm', 'gay'];
        saveLogs = true;
        disableLogs = false;
    }

    function restoreOptions() {
        if (!localStorage["options_tmn"]) {
            initOptions();
            cout("Init: " + enabled)
            return;
        }

        try {
            var options = JSON.parse(localStorage["options_tmn"]);
            enabled = options.enabled;
            debug("Restore: " + enabled)
            useBlackList = options.use_black_list;
            useDHSList = options.use_dhs_list;
            tmn_timeout = options.timeout;
            burstEnabled = options.burstMode;
            searchEngines = options.searchEngines;
            disableLogs = options.disableLogs;
            saveLogs = options.saveLogs;
            useTab = options.useTab;
            TMNQueries = JSON.parse(localStorage["gen_queries"]);
            feedList = options.feedList;
            tmn_id = options.tmn_id;
            tmnLogs = JSON.parse(localStorage["logs_tmn"]);
            engines = JSON.parse(localStorage["engines"]);
            if (options.kw_black_list && opions.kw_black_list.length > 0) kwBlackList = options.kw_black_list.split(",");
        } catch (ex) {
            cout('No option recorded: ' + ex)
        }
    }


    function toggleTMN() {
        enabled = !enabled
        return enabled;
    }



    function restartTMN() {
        createTab();
        enabled = true;
        chrome.browserAction.setBadgeText({
            'text': 'On'
        });
        chrome.browserAction.setTitle({
            'title': 'On'
        });
        scheduleNextSearch(4000);
    }


    function stopTMN() {
        enabled = false;
        if (useTab)
            deleteTab();

        chrome.browserAction.setBadgeBackgroundColor({
            'color': [255, 0, 0, 255]
        })
        chrome.browserAction.setBadgeText({
            'text': 'Off'
        });
        chrome.browserAction.setTitle({
            'title': 'Off'
        });
        window.clearTimeout(tmn_searchTimer);
        window.clearTimeout(tmn_errTimeout);
    }

    function preserveTMNTab() {
        if (useTab && enabled) {
            tmn_tab = null;
            cout('TMN tab has been deleted by the user, reload it');
            createTab();
            return;
        }
    }

    function formatNum(val) {
        if (val < 10) return '0' + val;
        return val
    }



    function log(entry) {
        if (disableLogs) return;
        try {
            if (entry != null) {
                if (entry.type == 'query') {
                    if (entry.id && entry.id == tmn_logged_id) return;
                    tmn_logged_id = entry.id;
                }
                var now = new Date();
                entry.date = formatNum(now.getHours()) + ":" + formatNum(now.getMinutes()) + ":" + formatNum(now.getSeconds()) +
                    '   ' + (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear();
            }
        } catch (ex) {
            cout("[ERROR] " + ex + " / " + ex.message + "\nlogging msg");
        }
        tmnLogs.unshift(entry);
        chrome.storage.local.set({
            "logs_tmn": JSON.stringify(tmnLogs)
        });
    }

    function sendClickEvent() {
        if (prev_engine) {
            cout("About to click on " + prev_engine)
            chrome.tabs.sendMessage(tmn_tab_id, {
                tmn_engine: getEngineById(prev_engine)
            });
        }
    }

    function handleRequest(request, sender, sendResponse) {

        if (request.tmnLog) {
            cout("Background logging : " + request.tmnLog);
            var logtext = JSON.parse(request.tmnLog);
            log(logtext);
            sendResponse({});
            return;
        }
        if (request.updateStatus) {
            updateOnSend(request.updateStatus);
            sendResponse({});
            return;
        }
        /*if (request.userSearch) {
                cout("Detected User search")
                enterBurst(request.userSearch); 
                sendResponse({});
                return;
            }*/
        if (request.getURLMap) {
            var tmp_engine = request.getURLMap;
            var urlMap = currentUrlMap[tmp_engine];
            sendResponse({
                "url": urlMap
            })
            return;
        }
        if (request.setURLMap) {
            cout("Background handling : " + request.setURLMap);
            var vars = request.setURLMap.split('--');
            var eng = vars[0];
            var asearch = vars[1];
            currentUrlMap[eng] = asearch;
            localStorage["url_map_tmn"] = JSON.stringify(currentUrlMap);
            var logEntry = {
                'type': 'URLmap',
                "engine": eng,
                'newUrl': asearch
            };
            log(logEntry);
            sendResponse({});
            return;
        }
        cout("Background page received message: " + request.tmn);
        switch (request.tmn) {
            case "currentURL":
                sendResponse({
                    "url": currentTMNURL
                })
                break;
            case "useTab":
                sendResponse({
                    "tmnUseTab": useTab
                });
                break;
            case "pageLoaded": //Remove timer and then reschedule;     
                if (last_url == request.url) break;
                else last_url = request.url
                prev_engine = engine;
                clearTimeout(tmn_errTimeout);
                if (Math.random() < 1) {
                    sendClickEvent();
                }
                reschedule();
                try {
                    var html = request.html;
                    extractQueries(html);
                } catch (ex) {}
                sendResponse({});
                break;
            case "tmnError": //Remove timer and then reschedule;       
                clearTimeout(tmn_errTimeout);
                rescheduleOnError();
                sendResponse({});
                break;
            case "isActiveTab":
                var active = (!sender.tab || sender.tab.id == tmn_tab_id);
                cout("active: " + active)
                sendResponse({
                    "isActive": active
                });
                break;
            case "TMNSaveOptions":
                saveOptionFromTab(request.option);
                sendResponse({});
                break;
            case "TMNResetOptions":
                resetOptions();
                sendResponse({});
                break;
            case "TMNValideFeeds":
                validateFeeds(request.param);
                sendResponse({});
                break;
            case "TMNAddEngine":
                alert(request.engine)
                addEngine(request.engine);
                sendResponse({});
                break;
            case "TMNDelEngine":
                delEngine(request.engine);
                sendResponse({});
                break;
            default:
                // snub them.
        }




    }


    return {

        _handleRequest: function(request, sender, sendResponse) {
            handleRequest(request, sender, sendResponse);
        },


        startTMN: function() {
            restoreOptions();
            //chrome.browserAction.setPopup("tmn_menu.html");
            typeoffeeds.push('zeitgeist');
            TMNQueries.zeitgeist = zeitgeist;

            if (TMNQueries.extracted && TMNQueries.extracted.length > 0) {
                typeoffeeds.push('extracted');
            }

            if (!load_full_pages) stop_when = "start"
            else stop_when = "end"


            typeoffeeds.push('rss');
            TMNQueries.rss = [];
            var feeds = feedList.split(/~/);
            var i = feeds.length;
            // you can only loop in reverse
            while (i--) {
                //cout('Start: Fetching RSS ');
                // cout(feeds[i])
                doRssFetch(feeds[i]);
            }

            if (useDHSList) {
                readDHSList();
                typeoffeeds.push('dhs');
            }

            var engines = searchEngines.split(',');
            engine = chooseEngine(engines);
            monitorBurst();

            if (enabled) {

                chrome.browserAction.setBadgeText({
                    'text': 'ON'
                });
                chrome.browserAction.setTitle({
                    'title': 'TMN is ON'
                });

                createTab();
                scheduleNextSearch(4000);
            } else {
                chrome.browserAction.setBadgeText({
                    'text': 'OFF'
                });
                chrome.browserAction.setTitle({
                    'title': 'TMN is OFF'
                });
            }



            chrome.windows.onRemoved.addListener(function() {
                if (useTabe) {
                    deleteTab();
                }
                if (!saveLogs)
                    chrome.storage.local.set({
                        "logs_tmn": ""
                    });
            });

        },



        _getOptions: function() {
            return getOptions();
        },

        _getLogs: function() {
            return tmnLogs;
        },

        _clearLogs: function() {
            clearLog();
        },

        _getAllQueries: function() {
            return TMNQueries;
            //sendMessageToOptionScript("TMNSendQueries",{queries:allqueries})
        },



        _restartTMN: function() {
            return restartTMN();
        },

        _stopTMN: function() {
            return stopTMN();
        },

        _getEngine: function() {
            return engine;
        },

        _getTargetEngines: function() {
            return engines;
        },

        _getQuery: function() {
            return this.queryToSend;
        },

        _saveOptions: function() {
            return saveOptions();
        },

        _changeTabStatus: function(useT) {
            return changeTabStatus(useT);
        },

        _hideTMNTab: function(tab_id) {
            if (tab_id == tmn_tab_id) {
                cout('TMN tab has been selected by the user, hidding it');
                chrome.tabs.remove(tmn_tab_id);
                return;
            }

        },


        _deleteTabWhenClosing: function(win_id) {
            if (useTabe && tmn_win_id == win_id) {
                cout('TMN win has been closed by the user, close the tab');
                chrome.tabs.remove(tmn_tab_id);
                return;
            }

        },

        _preserveTMNTab: function(tab_id) {
            if (tab_id == tmn_tab_id && useTab) {
                tmn_tab_id = -1;
                cout('TMN tab has been deleted by the user, reload it');
                createTab();
                return;
            }

        },




    }

}();



chrome.runtime.onMessage.addListener(TRACKMENOT.TMNSearch._handleRequest);

//chrome.tabs.onSelectionChanged.addListener(TRACKMENOT.TMNSearch._hideTMNTab);
chrome.tabs.onRemoved.addListener(TRACKMENOT.TMNSearch._preserveTMNTab);
//chrome.windows.onRemoved.addListener(TRACKMENOT.TMNSearch._deleteTabWhenClosing); 

TRACKMENOT.TMNSearch.startTMN();