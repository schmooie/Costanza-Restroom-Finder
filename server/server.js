var app = require('express')();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var restify = require('express-restify-mongoose');
var http = require('http');

mongoose.connect('mongodb://mongo:mymongo@novus.modulusmongo.net:27017/n2osopaB');

var Restroom = mongoose.model('Restroom', {
	oid: Number,
	coords: [Number, Number],
	name: String,
	category: String
});

app.use(bodyParser());
app.use(methodOverride());
restify.serve(app, Restroom);

app.route('/api/near?')
.get(function(req,res, next) {
	return Restroom.find({
		coords: {$near: [parseFloat(req.query.lon), parseFloat(req.query.lat)], $maxDistance: 0.0145 }
	}, function(err, restrooms) {
		if (!err) {
			return res.json(restrooms);
		} else {
			return res.send(err);
		}
	});
});

http.createServer(app).listen(3000, function () {
	console.log('Listening on 3000');
});