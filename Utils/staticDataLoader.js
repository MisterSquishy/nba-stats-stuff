const emitter = require('./globalEmitter');
const NBAAPIConstants = require('./NBAAPIConstants');

module.exports.load = function(dateParam) {
  var data = require('../data/' + dateParam.toLowerCase() + '.json');
  emitter.emit(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI + 'success', data.resultSets[0]);
  data = require('../data/scoreboard.json');
  emitter.emit(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI + 'success', data.resultSets[0]);
  data = require('../data/allplayers.json');
  emitter.emit(NBAAPIConstants.ALL_PLAYERS_API.URI + 'success', data.resultSets[0]);
}
