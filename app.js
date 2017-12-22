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

const emitter = require('./Utils/globalEmitter');
var params = {};
var completedCallouts = [];
emitter.on(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI + 'success', function(result) {
  var formattedData = dataReformatter.reformatNBAPlayerDashboard('LEAGUE_DASHBOARD_API', result.headers, result.rowSet);

  params.dashboardHeaders = formattedData[0];
  params.dashboardRowSet = formattedData[1];
  params.teamRosters = JSON.stringify(FantasyConstants);
  params.fantasyScoring = JSON.stringify(FantasyConstants.scoring());
  params.dateOption = dateOption;

  completedCallouts.push(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI);
  emitter.emit('calloutsuccess');
});
emitter.on(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI + 'success', function(result) {
  var formattedData = dataReformatter.reformatNBAPlayerDashboard('LEAGUE_SCOREBOARD_API', result.headers, result.rowSet);

  params.scoreboardRowSet = JSON.parse(formattedData[1]);

  completedCallouts.push(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI);
  emitter.emit('calloutsuccess');
});
emitter.on(NBAAPIConstants.ALL_PLAYERS_API.URI + 'success', function(result) {
  var formattedData = dataReformatter.reformatNBAPlayerDashboard('ALL_PLAYERS_API', result.headers, result.rowSet);

  params.allPlayersRowSet = JSON.parse(formattedData[1]);

  completedCallouts.push(NBAAPIConstants.ALL_PLAYERS_API.URI);
  emitter.emit('calloutsuccess');
});
emitter.on('calloutsuccess', function() {
  if (completedCallouts.length === 3) {
    if (dateOption === 'Today') {
      var formattedData = dataReformatter.createTodayView(params.dashboardHeaders, params.dashboardRowSet, params.scoreboardRowSet, params.allPlayersRowSet);
      params.dashboardHeaders = formattedData[0];
      params.dashboardRowSet = formattedData[1];
    }
    else if (dateOption === 'Yesterday') {
      var formattedData = dataReformatter.addRestOfPlayers(params.dashboardHeaders, params.dashboardRowSet, params.allPlayersRowSet);
      params.dashboardHeaders = formattedData[0];
      params.dashboardRowSet = formattedData[1];
    }
    //frontend doesn't need these
    delete params.allPlayersRowSet;
    delete params.scoreboardRowSet;
    appRes.end(compiledFunction(params));
  }
});
emitter.on('calloutserror', function(err) {
  appRes.send(err);
});

var appRes;
var dateOption;
var processRequest = function() {
  completedCallouts = [];
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
