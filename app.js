var express = require('express');
var pug = require('pug');
const compiledFunction = pug.compileFile('./templates/home.pug');


const emitter = require('./globalEmitter');
require('./callouts')();
var app = express();

app.get('/', function (req, res) {
  emitter.on('calloutsuccess', function(result) {
    console.log(result);
    res.send(compiledFunction({

    }));
  });
  emitter.on('calloutserror', function(err) {
    res.send(err);
  });
  performRequest('/stats/commonallplayers', 'GET', {'LeagueID':'00','Season':'2017-18','IsOnlyCurrentSeason':'1'});

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
