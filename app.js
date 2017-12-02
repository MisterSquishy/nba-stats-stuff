var express = require('express');
var chart = require('chart');
require('./callouts')();
var app = express();

app.get('/', function (req, res) {
  performRequest('/stats/commonallplayers', 'GET', {'LeagueID':'00','Season':'2017-18','IsOnlyCurrentSeason':'1'}, res.send.bind(res), res.send.bind(res));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
