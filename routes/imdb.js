var express = require('express');
var router = express.Router();
router.route('/popular')

.get(function(req, res, next) {
	var request = require('sync-request');
	var response = request('GET', 'http://www.imdb.com/chart/moviemeter');
	var body = response.getBody().toString();
	var result = [];
	var itemPos = body.indexOf("td class=\"titleColumn\">");
	
	while(itemPos != -1) {
		var idStart = body.indexOf("data-titleid=\"tt", itemPos) + "data-titleid=\"tt".length;
		var idEnd = body.indexOf("\"", idStart);
		var id = body.substring(idStart, idEnd);
		
		var ratingStart = body.indexOf("<strong title=\"", itemPos) + "<strong title=\"".length;
		var ratingEnd = body.indexOf("\"", ratingStart);
		var rating = body.substring(ratingStart, ratingEnd);
		
		var imageStart = body.lastIndexOf("<img src=\"", itemPos) + "<img src=\"".length;
		var imageEnd = body.indexOf("\"", imageStart);
		var image = body.substring(imageStart, imageEnd);
		
		var namesStart = body.indexOf("title=\"", itemPos) + "title=\"".length;
		var namesEnd = body.indexOf("\" >", namesStart);
		var names = body.substring(namesStart, namesEnd);
		
		var titleStart = body.indexOf(" >", itemPos) + 2;
		var titleEnd = body.indexOf("</", titleStart);
		var title = body.substring(titleStart, titleEnd);
		
		result.push({ id: id, names: names, title: title, image: image, rating: rating });
		itemPos = body.indexOf("td class=\"titleColumn\">", titleStart);
	}
	res.status(200);
	res.send({
		success: true,
		result: result
	});
});

router.route('/:id')
.get(function(req, res, next) {
	var request = require('sync-request');
	var id = req.params.id;
	var response = request('GET', 'http://www.imdb.com/title/tt' + id + '/');
	var body = response.getBody().toString();
	var result = { id: id };
	var titleStart = body.indexOf("<meta property='og:title' content=\"");
	if(titleStart > -1) {
		titleStart += "<meta property='og:title' content=\"".length;
		var titleEnd = body.indexOf("\"", titleStart);
		var title = body.substring(titleStart, titleEnd);
		result.title = title;
	}
	
	var descStart = body.indexOf("itemprop=\"description\">");
	if(descStart > -1) {
		descStart += "itemprop=\"description\">\n".length;
		var descEnd = body.indexOf("</", descStart);
		var desc = body.substring(descStart, descEnd);
		result.desc = desc.trim().replace("\n", "");
	}
	
	var imageStart = body.indexOf("<link rel='image_src' href=\"");
	if(imageStart > -1) {
		imageStart += "<link rel='image_src' href=\"".length;
		var imageEnd = body.indexOf("\"", imageStart);
		var image = body.substring(imageStart, imageEnd);
		result.image = image;
	}
	
	result.directors = [];
	var directorsStart = body.indexOf("<h4 class=\"inline\">Director");
	var directorsEnd = body.indexOf("<h4 class=\"inline\">Writer");
	var directorStart = body.indexOf("itemprop=\"name\">", directorsStart);
	while(directorStart > -1 && directorStart >= directorsStart && directorStart < directorsEnd) {
		directorStart += "itemprop=\"name\">".length;
		var directorEnd = body.indexOf("</span", directorStart);
		var director = body.substring(directorStart, directorEnd);
		result.directors.push(director);
		directorStart = body.indexOf("itemprop=\"name\">", directorStart);
	}
	
	result.writers = [];
	var writersStart = body.indexOf("<h4 class=\"inline\">Writer");
	var writersEnd = body.indexOf("<h4 class=\"inline\">Star");
	var writerStart = body.indexOf("itemprop=\"name\">", writersStart);
	while(writerStart > -1 && writerStart >= writersStart && writerStart < writersEnd) {
		writerStart += "itemprop=\"name\">".length;
		var writerEnd = body.indexOf("</span", writerStart);
		var writer = body.substring(writerStart, writerEnd);
		result.writers.push(writer);
		writerStart = body.indexOf("itemprop=\"name\">", writerStart);
	}

	result.stars = [];
	var starsStart = body.indexOf("<h4 class=\"inline\">Star");
	var starsEnd = body.indexOf("See full cast & crew");
	
	var starStart = body.indexOf("itemprop=\"name\">", starsStart);
	while(starStart > -1 && starStart >= starsStart && starStart < starsEnd) {
		console.log("star")
		starStart += "itemprop=\"name\">".length;
		var starEnd = body.indexOf("</span", starStart);
		var star = body.substring(starStart, starEnd);
		result.stars.push(star);
		starStart = body.indexOf("itemprop=\"name\">", starStart);
	}
	
	res.status(200);
	res.send({
		success: true,
		result: result
	});
});

module.exports = router;