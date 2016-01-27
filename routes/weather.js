var express = require('express');
var router = express.Router();
router.route('/forecast')

.get(function(req, res, next) {
	var reqDateString = req.query.date;
	var dateParts = reqDateString.split("/");
	var reqDate = new Date(dateParts[2], dateParts[0], dateParts[1], req.query.hour, 0, 0, 0); 
	
	var request = require('sync-request');
	var response = request('GET', 'http://api.openweathermap.org/data/2.5/forecast?q=' + req.query.location + '&appid=13086734c6d45a7cd736d537e16af1d3');
	var body = response.getBody().toString();
	var obj = JSON.parse(body);
	var list = obj.list;
	var result = {};
	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var weather = item.weather[0];
		var datetime = item.dt;
		var dt = getDateFromUnixString(datetime);
		if(dt.getDate() == reqDate.getDate()) {
			var hourDifference = dt.getHours() - reqDate.getHours();
			if(hourDifference <= 0 && hourDifference >= -3) {
				result = { "dt": dt, "weather": weather };
				break;
			}
		}
	}
		  
	res.status(200);
	res.send({
		success: true,
		result: result
	});
});

var getDateFromUnixString = function(unixString) {
	return new Date(unixString*1000);
}

module.exports = router;