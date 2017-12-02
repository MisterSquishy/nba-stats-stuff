var querystring = require('querystring');
var http = require('http');

var host = 'stats.nba.com';
var sessionId;

module.exports = function() {
  this.performRequest = function(endpoint, method, data, success, failure) {
    var dataString = JSON.stringify(data);
    //nba.com: "I only respond to requests from browsers"
    //also nba.com: "Hi browser, here's a raw data table formatted as JSON"
    var headers = {
      'user-agent': ('Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'),
      'Dnt': ('1'),
      'Accept-Encoding': ('utf-8'),
      'Accept-Language': ('en'),
      'origin': ('http://stats.nba.com')
    };

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
        console.log('HAPPY FACE');
        var responseObject = JSON.parse(responseString);
        console.log(responseObject);
        success(responseObject.resultSets[0]);
      });
    });

    req.on('error', function(err) {
      console.log('SAD FACE');
      console.log(err);
      failure(err);
    });

    req.write(dataString);
    req.end();
  }
}
