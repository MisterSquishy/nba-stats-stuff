var express = require('express');
var pug = require('pug');
var callouts = require('./Utils/callouts');
var NBAAPIConstants = require('./Utils/NBAAPIConstants');
var FantasyConstants = require('./Utils/FantasyConstants');
var dataReformatter = require('./Utils/dataReformatter');
const compiledFunction = pug.compileFile('./templates/home.pug');

const emitter = require('./Utils/globalEmitter');
var app = express();

app.get('/', function (req, res) {
  emitter.on('calloutsuccess', function(result) {
    var formattedData = dataReformatter.reformatNBAPlayerDashboard('LEAGUE_DASHBOARD_API', result.headers, result.rowSet);

    res.end(compiledFunction({
      headers:formattedData[0],
      rowSet:formattedData[1],
      teamRosters:JSON.stringify(FantasyConstants)
    }));
  });
  emitter.on('calloutserror', function(err) {
    res.send(err);
  });
  callouts.performRequest(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI, 'GET', NBAAPIConstants.LEAGUE_DASHBOARD_API.Params);
  // callouts.performRequest('/players/'+LastName+'/'+FirstName, 'GET', null, true); //todo images??

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
