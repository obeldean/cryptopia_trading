var apiQuery = require('./api_query.js')
var async = require('async');

var pairList = [
	'XVG_BTC',
	'LTC_BTC',
	'DOGE_BTC',
	'LINDA_BTC',
	'NEO_BTC',
	'ETN_BTC'
];
var tradeList = {};
var buyOrderList = {};
var prevRes = null;
var curRes = null;
var percentVal = 0.1;

var myCallback = function (error, results) {
	console.log(results);
}

// apiQuery(myCallback, 'GetBalance', {Currency: 'DFS'});

// cancel all unfilled orders
cancelBuyOrders();

// get data 
getMarketOrderGroups();
setInterval(getMarketOrderGroups, 10000);

function cancelBuyOrders() {
	// apiQuery(
	// 	function (success, error, data) {
	// 		if (success) {
	// 			console.log('Orders canceled: ', data);
	// 		}
	// 	},
	// 	'CancelTrade',
	// 	{Type: 'All'}
	// );
}

function getMarketOrderGroups() {
	apiQuery(
		processMarketOrderGroups,
		'GetMarketOrderGroups',
		{
			markets: pairList.join('-'),
			count: 5
		}
	);
}

function processMarketOrderGroups(error, result) {
	var res = JSON.parse(result).Data;
	console.log(res);
	console.log('------------------------------------------------');

	prevRes = curRes;
	curRes = res;
	var length = res.length;

	var prevPrice;
	var curPrice;

	if (prevRes) {
		for (var i = 0; i < length; i++) {
			prevPrice = Number.parseFloat(prevRes[i].Sell[0].Price);
			curPrice = Number.parseFloat(curRes[i].Sell[0].Price);
			console.log(curRes[i].Market, prevPrice.toFixed(8), curPrice.toFixed(8));

			if (checkPercentage(prevPrice, curPrice)) {
				placeBuyTrade(curRes[i]);
			}
		}
	}
	console.log('------------------------------------------------');

}

function checkPercentage(prevPrice, curPrice) {

	var diff = curPrice - prevPrice;
	var percent = parseFloat((diff*100/prevPrice).toFixed(2));
	console.log(percent);

	if (percent >= percentVal) {
		return true;
	} else {
		return false;
	}
}

function placeBuyTrade(marketOrderGroup) {
	// Market: The market symbol of the trade e.g. 'DOT/BTC' (not required if 'TradePairId' supplied)
	// TradePairId: The Cryptopia tradepair identifier of trade e.g. '100' (not required if 'Market' supplied)
	// Type: the type of trade e.g. 'Buy' or 'Sell'
	// Rate: the rate or price to pay for the coins e.g. 0.00000034
	// Amount: the amount of coins to buy e.g. 123.00000000

	// check if there is no trade
	if (!tradeList[marketOrderGroup.Market]) {
		console.warn('place trade');
		var market = marketOrderGroup.Market.replace('_', '/');
		var type = 'Buy';
		var rate = 0;
		var amount = 0;

		// compute amount

		// apiQuery(
		// 	function (success, error, data) {
		// 		if (success) {
		// 			console.log('Order placed: ', data.OrderId);
					buyOrderList[marketOrderGroup.Market] = data.OrderId;
		// 		}
		// 	},
		// 	'SubmitTrade',
		// 	{
		// 		Market: market,
		// 		TradePairId: marketOrderGroup.TradePairId,
		// 		Type: type,
		// 		Rate: rate,
		// 		Amount: amount
		// 	}
		// );
	}
}
