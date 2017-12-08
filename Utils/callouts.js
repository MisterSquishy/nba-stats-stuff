var querystring = require('querystring');
var http = require('http');

var host = 'stats.nba.com';
var imagehost = 'nba-players.herokuapp.com'
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

module.exports.performRequest = function(endpoint, method, data, imageSearch) {
    var dataString = JSON.stringify(data);

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
      host: (imageSearch ? imagehost : host),
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
        return emitter.emit('calloutsuccess', responseObject.resultSets[0]);
      });
    });

    req.on('error', function(err) {
      return emitter.emit('callouterror', err);
    });

    req.write(dataString);
    req.end();
}
