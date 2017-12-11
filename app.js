var express = require('express');
var app = express();
var pug = require('pug');
var callouts = require('./Utils/callouts');
var NBAAPIConstants = require('./Utils/NBAAPIConstants');
var FantasyConstants = require('./Utils/FantasyConstants');
var dataReformatter = require('./Utils/dataReformatter');
const compiledFunction = pug.compileFile('./templates/home.pug');

var appRes;
var dateOption;
const emitter = require('./Utils/globalEmitter');
emitter.on('calloutsuccess', function(result) {
  console.log('Callout succeeded');
  var formattedData = dataReformatter.reformatNBAPlayerDashboard('LEAGUE_DASHBOARD_API', result.headers, result.rowSet);

  appRes.end(compiledFunction({
    headers:formattedData[0],
    rowSet:formattedData[1],
    teamRosters:JSON.stringify(FantasyConstants),
    fantasyScoring:JSON.stringify(FantasyConstants.scoring()),
    dateOption:dateOption
  }));
  console.log('Data sent to frontend');
});
emitter.on('calloutserror', function(err) {
  appRes.send(err);
});

var processRequest = function() {
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
  console.log('Going to call out\n' + JSON.stringify(params));
  callouts.performRequest(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI, 'GET', params);
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
  console.log('App started');
});
