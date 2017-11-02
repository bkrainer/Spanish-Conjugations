const express = require('express');
const app = express();
const path = require('path');

app.set('port', (process.env.PORT || 5000));

app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.get('/', function(request, response) {
	response.sendFile(app.get('views') + '/pages/index.html');
});

app.listen(app.get('port'), function() {
	console.log('server started on port', app.get('port'));
});
