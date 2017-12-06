var express = require('express');
var pug = require('pug');
const compiledFunction = pug.compileFile('./templates/home.pug');


const emitter = require('./globalEmitter');
require('./callouts')();
var app = express();

app.get('/', function (req, res) {
  emitter.on('calloutsuccess', function(result) {
    var formattedHeaders = [];
    for (var key in result.headers) {
      formattedHeaders.push({title:result.headers[key]}); //todo seriously??
    }
    res.send(compiledFunction({
      headers:JSON.stringify(formattedHeaders),
      rowSet:JSON.stringify(result.rowSet)
    }));
  });
  emitter.on('calloutserror', function(err) {
    res.send(err);
  });
  performRequest('/stats/leaguedashplayerstats', 'GET', {'SeasonType':'Regular Season',
                                                          'MeasureType':'Base',
                                                          'PerMode':'Totals',
                                                          'PlusMinus':'N',
                                                          'PaceAdjust':'N',
                                                          'Rank':'N',
                                                          'Season':'2017-18',
                                                          'Month':'0',
                                                          'LastNGames':'0',
                                                          'Period':'0',
                                                          'OpponentTeamID':'0',
                                                          'DateFrom':'',
                                                          'DateTo':'',
                                                          'VsConference':'',
                                                          'GameSegment':'',
                                                          'SeasonSegment':'',
                                                          'GameScope':'',
                                                          'PlayerExperience':'',
                                                          'PlayerPosition':'',
                                                          'StarterBench':'',
                                                          'VsDivision':'',
                                                          'Outcome':'',
                                                          'Location':''});
  // performRequest('/stats/commonallplayers', 'GET', {'LeagueID':'00','Season':'2017-18','IsOnlyCurrentSeason':'1'});

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
