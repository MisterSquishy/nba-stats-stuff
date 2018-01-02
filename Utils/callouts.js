var querystring = require('querystring');
var http = require('http');

var host = 'stats.nba.com';
//nba.com: "I only respond to requests from browsers"
//also nba.com: "Hi browser, here's a raw data table formatted as JSON"
var headers = {
  'user-agent': ('Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'),
  'Dnt': ('1'),
  'Accept-Encoding': ('utf-8'),
  'Accept-Language': ('en'),
  'origin': ('http://stats.nba.com')
};
var sessionId;

const emitter = require('./globalEmitter');

//NOTE: I more or less stopped updating this when I found out heroku IPs are blacklisted
//The data is fetched and uploaded by data/scripts, and then processed by staticDataLoader
module.exports.performRequest = function(endpoint, method, data) {
    var dataString = JSON.stringify(data);
    var endpointName = endpoint;

    if (method == 'GET') {
      endpoint += '?' + querystring.stringify(data);
    }
    else {
      headers = {
        'Content-Type': 'application/json',
        'Content-Length': dataString.length +','
      } + headers;
    }

    var options = {
      host: host,
      path: endpoint,
      method: method,
      headers: headers
    };

    var req = http.request(options, function(res) {
      res.setEncoding('utf-8');

      var responseString = '';

      res.on('data', function(data) {
        responseString += data;
      });

      res.on('end', function() {      
        var responseObject = JSON.parse(responseString);
        return emitter.emit(endpointName + 'success', responseObject.resultSets[0]);
      });
    });

    req.on('error', function(err) {
      return emitter.emit('callouterror', err);
    });

    req.write(dataString);
    req.end();
}
