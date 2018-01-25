(function() {
	API = 'https://www.cryptopia.co.nz/api/';
	var prevRes = null;
	var curRes = null;
	var pairList = ['XVG_BTC', 'LTC_BTC', 'DOGE_BTC', 'LINDA_BTC', 'NEO_BTC', 'ETN_BTC'];

	// initial data request
	getMarketOrderGroups();

	function processMarketOrderGroups(result) {
		var res = JSON.parse(result).Data;
		console.log(res);

		prevRes = curRes;
		curRes = res;
		var length = res.length;

		var prevPrice;
		var curPrice;
		var diff;
		var percent;

		if (prevRes) {
			for (var i = 0; i < length; i++) {
				prevPrice = Number.parseFloat(prevRes[i].Sell[0].Price);
				curPrice = Number.parseFloat(curRes[i].Sell[0].Price);
				console.log(curRes[i].Market, prevPrice.toFixed(8), curPrice.toFixed(8));

				diff = curPrice - prevPrice;
				percent = parseFloat((diff*100/prevPrice).toFixed(2));
				console.info(percent);

				if (percent >= 0.01) {
					console.warn('place trade');
				}
			}
		}
	}

	// get data 
	setInterval(function() {

		getMarketOrderGroups();

	}, 60000);

	function getMarketOrderGroups() {
		var url = API + 'GetMarketOrderGroups/' + pairList.join('-');
		httpGetAsync(url, processMarketOrderGroups);
	}

	// helper functions
	function httpGetAsync(theUrl, callback) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(xmlHttp.responseText);
		};
		xmlHttp.open('GET', theUrl, true); // true for asynchronous 
		xmlHttp.send(null);
	}

	function httpPostAsync(theUrl, callback, params) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.onreadystatechange = function() {
			if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
				callback(xmlHttp.responseText);
		};
		xmlHttp.open('POST', theUrl, true); // true for asynchronous 
		xmlHttp.send(params.join('&'));
	}
})();