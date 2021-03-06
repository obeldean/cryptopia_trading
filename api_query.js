var https = require('https');
var async = require('async');
var crypto = require('crypto');

API_KEY = 'API_KEY';
API_SECRET = 'API_SECRET';

function apiQuery(callback2, method, params) {
	if (!params) {
		params = {};
	}
	var public_set = [
		"GetCurrencies",
		"GetTradePairs",
		"GetMarkets",
		"GetMarket",
		"GetMarketHistory",
		"GetMarketOrders",
		"GetMarketOrderGroups"
	];
	var private_set = [
		"GetBalance",
		"GetDepositAddress",
		"GetOpenOrders",
		"GetTradeHistory",
		"GetTransactions",
		"SubmitTrade",
		"CancelTrade",
		"SubmitTip"
	];
	var host_name = 'www.cryptopia.co.nz';
	var uri = '/Api/' + method;
	
	if (public_set.indexOf(method) > -1) {
		if (params) {
			uri += "/" + Object.values(params).join('/');
		}
		
		var options = {
			host: host_name,
			path: uri
		};

		callback = function(response) {
			var str = '';
			response.on('data', function(chunk) {
				str += chunk;
			});
			response.on('end', function() {
				return callback2(null, str);
			});
		}

		https.request(options, callback).end();
	
	} else if (private_set.indexOf(method) > -1) {
		var nonce = Math.floor(new Date().getTime() / 1000);
		var md5 = crypto.createHash('md5').update(JSON.stringify(params)).digest();
		var requestContentBase64String = md5.toString('base64');
		var signature = API_KEY + "POST" + encodeURIComponent('https://' + host_name + uri).toLowerCase() + nonce + requestContentBase64String;
		var hmacsignature = crypto.createHmac('sha256', new Buffer(API_SECRET, "base64")).update(signature).digest().toString('base64');
		var header_value = "amx " + API_KEY + ":" + hmacsignature + ":" + nonce;
		var headers = {
			'Authorization': header_value,
			'Content-Type': 'application/json; charset=utf-8',
			'Content-Length' : Buffer.byteLength(JSON.stringify(params)),
		};
		var options = {
			host: host_name,
			path: uri,
			method: 'POST',
			headers: headers
		};
		callback = function(response) {
			var str = '';
			response.on('data', function(chunk) {
				str += chunk;
			});
			response.on('end', function() {
				return callback2(null, str);
			});
		}
		var req = https.request(options, callback);
		req.write(JSON.stringify(params));
		req.end();
	}
}

module.exports = apiQuery;

// async.series(
// 	[ function(callback) { 
// 		// Public: 
// 		// apiQuery( callback, "GetCurrencies" ); 

// 		// apiQuery( callback, "GetMarket", [ 100, 6 ] ); 

// 		// Private: 
// 		apiQuery( callback, "GetBalance" ); 

// 		// apiQuery( callback, "SubmitTrade", { 'Market': "020/DOGE", 'Type': "Sell", 'Rate': 0.001, 'Amount': 1000 } ) 
// 		// ['{"Success":true,"Error":null,"Data":{"OrderId":496433,"FilledOrders":[]}}' ] 

// 		// apiQuery( callback, 'CancelTrade', {
// 		// 	'CancelType': 'Trade', 'OrderId': 496433 
// 		// } );
// 		// [ '{"Success":true,"Error":null,"Data":[496433]}' ] 
// 	} ], 
// 	function(error, results) {
// 		console.log(results);
// 	}
// );