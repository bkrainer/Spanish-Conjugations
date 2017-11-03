const express = require('express');
const app = express();
const path = require('path');

app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

var data = require(__dirname + '/public/data/verbs.json');

/* On page load, serve index.html */
app.get('/', function(request, response) {
	response.sendFile(app.get('views') + '/pages/index.html');
});

app.get('/verbs', function(request, response) {
	response.send(data);
});

app.listen(app.get('port'), function() {
	console.log('server started on port', app.get('port'));
});
