const context = require('./Utils/context');

var express = require('express');
var app = express();
var pug = require('pug');
var callouts = require('./Utils/callouts');
var staticDataLoader = require('./Utils/staticDataLoader');
var NBAAPIConstants = require('./Utils/NBAAPIConstants');
var FantasyConstants = require('./Utils/FantasyConstants');
var dataReformatter = require('./Utils/dataReformatter');
const compiledFunction = pug.compileFile('./templates/home.pug');

var appRes;
var dateOption;
const emitter = require('./Utils/globalEmitter');
emitter.on(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI + 'success', function(result) {
  var formattedData = dataReformatter.reformatNBAPlayerDashboard('LEAGUE_DASHBOARD_API', result.headers, result.rowSet);

  appRes.end(compiledFunction({
    dashboardHeaders:formattedData[0],
    dashboardRowSet:formattedData[1],
    teamRosters:JSON.stringify(FantasyConstants),
    fantasyScoring:JSON.stringify(FantasyConstants.scoring()),
    dateOption:dateOption
  }));
});
emitter.on(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI + 'success', function(result) {
  var formattedData = dataReformatter.reformatNBAPlayerDashboard('LEAGUE_SCOREBOARD_API', result.headers, result.rowSet);

  appRes.end(compiledFunction({
    scoreBoardHeaders:formattedData[0],
    scoreBoardRowSet:formattedData[1],
  }));
});
emitter.on(NBAAPIConstants.ALL_PLAYERS_API.URI + 'success', function(result) {
  var formattedData = dataReformatter.reformatNBAPlayerDashboard('ALL_PLAYERS_API', result.headers, result.rowSet);

  appRes.end(compiledFunction({
    allPlayersHeaders:formattedData[0],
    allPlayersRowSet:formattedData[1],
  }));
});
emitter.on('calloutserror', function(err) {
  appRes.send(err);
});

var processRequest = function() {
  if (context.IS_HEROKU) {
    staticDataLoader.load(dateOption);
  }
  else {
    var params = JSON.parse(JSON.stringify(NBAAPIConstants.LEAGUE_DASHBOARD_API.Params)); //really???
    if (dateOption !== 'Full') {
      var date = new Date();
      if (dateOption === 'Today') {
        //date set by default
      }
      else if (dateOption === 'Yesterday') {
        date.setDate(date.getDate() - 1);
      }

      params.DateFrom = date.toISOString();
      params.DateTo = date.toISOString();
    }
    callouts.performRequest(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI, 'GET', params);
    callouts.performRequest(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI, 'GET', NBAAPIConstants.LEAGUE_SCOREBOARD_API.Params);
    callouts.performRequest(NBAAPIConstants.ALL_PLAYERS_API.URI, 'GET', NBAAPIConstants.ALL_PLAYERS_API.Params);
  }
  // callouts.performRequest('/players/'+LastName+'/'+FirstName, 'GET', null, true); //todo images??
};

app.get('/', function (req, res) {
  appRes = res;
  //if no params, figure out if today or yesterday (fallback behavior)
  var date = new Date();
  if (date.getHours() < 12) {
    dateOption = 'Yesterday';
  }
  else {
    dateOption = 'Today';
  }
  processRequest();
});

app.get('/Today', function (req, res) {
  appRes = res;
  dateOption = 'Today';
  processRequest();
});

app.get('/Yesterday', function (req, res) {
  appRes = res;
  dateOption = 'Yesterday';
  processRequest();
});

app.get('/Full', function (req, res) {
  appRes = res;
  dateOption = 'Full';
  processRequest();
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Here goes nothin\'');
});
