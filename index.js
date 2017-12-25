const express = require('express');
const app = express();
const path = require('path');

app.set('port', (process.env.PORT || 5000));

app.set('app', __dirname + '/app');
var appDir = app.get('app');

app.use(
	express.static(path.join(appDir, '/public'))
);
app.use(
	'/bower_components',
	express.static(path.join(appDir, 'bower_components'))
);

var data = require(appDir + '/public/data/verbs.json');

/* On page load, serve index.html */
app.get('/', function(request, response) {
	response.sendFile(appDir + '/index.html');
});

app.get('/verbs', function(request, response) {
	response.send(data);
});

app.listen(app.get('port'), function() {
	console.log('server started on port', app.get('port'));
});
