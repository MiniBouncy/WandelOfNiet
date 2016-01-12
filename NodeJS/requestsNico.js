var getSunriseSunsetCloudsToday = function(location, callback) {
	var http = require('http');
	var options = {
	  host: 'api.openweathermap.org',
	  port: 80,
	  path: '/data/2.5/weather?q=' + location + '&appid=2de143494c0b295cca9337e1e96b00e0'
	};

	http.get(options, function(resp){
	  resp.on('data', function(chunk){
		var obj = JSON.parse(chunk);
		var sunrise = obj.sys.sunrise;
		var sunset = obj.sys.sunset;
		var date = new Date(sunrise * 1000);
		var hours = date.getHours();
		var minutes = "0" + date.getMinutes();
		
		var sunriseFormatted = hours + ':' + minutes.substr(-2);
		
		date = new Date(sunset * 1000);
		hours = date.getHours();
		minutes = "0" + date.getMinutes();
		
		var sunsetFormatted = hours + ':' + minutes.substr(-2);
		
		var clouds = obj.clouds.all;
		
		callback({ "sunrise": sunriseFormatted, "sunset": sunsetFormatted, "clouds": clouds });
	  });
	}).on("error", function(e){
	  console.log("Got error: " + e.message);
	});
	
	callback(null);
}

var getSunriseSunsetCloudsToday_Response = function(info) {
	if(info != null) {
		console.log(info);
	}
}

var getWeatherAtDateHour = function(date, hour, location, callback) {
	var dateParts = date.split("/");
	
	var reqDate = new Date(dateParts[2], dateParts[0], dateParts[1], hour, 0, 0, 0); 
	
	var http = require('http');
	var options = {
	  host: 'api.openweathermap.org',
	  port: 80,
	  path: '/data/2.5/forecast?q=' + location + '&appid=2de143494c0b295cca9337e1e96b00e0'
	};

	var body = '';
	http.get(options, function(resp){
		resp.on('data', function (chunk) {
		  body += chunk;
		});
		resp.on('end', function () {
		  var obj = JSON.parse(body);
		  var list = obj.list;
		  for (var i = 0; i < list.length; i++) {
			var item = list[i];
			var weather = item.weather[0];
			var datetime = item.dt;
			var dt = getDateFromUnixString(datetime);
			if(dt.getDate() == reqDate.getDate()) {
				var hourDifference = dt.getHours() - reqDate.getHours();
				if(hourDifference <= 0 && hourDifference >= -3) {
					callback({ "dt": dt, "weather": weather });
				}
			}
		  }
		});
	});
	
	callback(null);
}

var getWeatherAtDateHour_Response = function(info) {
	if(info != null) {
		console.log(info);
	}
}

var getDateFromUnixString = function(unixString) {
	var date = new Date(unixString*1000);
	return date;
}
//getSunriseSunsetCloudsToday("Hawaii", getSunriseSunsetCloudsToday_Response);
getWeatherAtDateHour("1/16/2016", 12, "Amsterdam", getWeatherAtDateHour_Response);