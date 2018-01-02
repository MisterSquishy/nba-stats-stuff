const emitter = require('./globalEmitter');
const NBAAPIConstants = require('./NBAAPIConstants');

module.exports.load = function (dateParam) {
  var data;
  if (dateParam !== 'Weekly') {
    data = require('../data/' + dateParam.toLowerCase() + '.json');
    emitter.emit(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI + 'success', data.resultSets[0]);
    data = require('../data/scoreboard.json');
    emitter.emit(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI + 'success', data.resultSets[0]);
  }
  else {
    for (var dayOfWeek of new Set(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])) {
      if (!data) {
        data = require('../data/' + dayOfWeek + '.json').resultSets[0];
      }
      else {
        data.rowSet.concat(require('../data/' + dayOfWeek + '.json').resultSets[0].rowSet);
      }
    }
    emitter.emit(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI + 'success', data);

    data = null;
    for (var dayOfWeek of new Set(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])) {
      if (!data) {
        data = require('../data/scoreboard' + dayOfWeek + '.json').resultSets[0];
      }
      else {
        data.rowSet.concat(require('../data/' + dayOfWeek + '.json').resultSets[0].rowSet);
      }
    }
    emitter.emit(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI + 'success', data);
  }
  
  data = require('../data/allplayers.json');
  emitter.emit(NBAAPIConstants.ALL_PLAYERS_API.URI + 'success', data.resultSets[0]);
}
