var express = require('express');
var server = express();
 
var server = express();
server.use(express.static(__dirname + '/htdocs'));
 
var port = 8000;
server.listen(port, function() {
    console.log('server listening on port ' + port);
});