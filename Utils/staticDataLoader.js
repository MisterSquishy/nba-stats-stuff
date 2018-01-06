const emitter = require('./globalEmitter');
const NBAAPIConstants = require('./NBAAPIConstants');

module.exports.load = function (dateParam) {
  if (dateParam !== 'Weekly') {
    var data;
    data = require('../data/' + dateParam.toLowerCase() + '.json');
    emitter.emit(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI + 'success', data.resultSets[0]);
    data = require('../data/scoreboard.json');
    emitter.emit(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI + 'success', data.resultSets[0]);
  }
  else {
    var dashboardData;
    for (var dayOfWeek of new Set(['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'])) {
      if (!dashboardData) {
        dashboardData = JSON.parse(JSON.stringify(require('../data/' + dayOfWeek + '.json').resultSets[0])); //clone to avoid weird two-way binding
      }
      else {
        dashboardData.rowSet = dashboardData.rowSet.concat(require('../data/' + dayOfWeek + '.json').resultSets[0].rowSet);
      }
    }
    emitter.emit(NBAAPIConstants.LEAGUE_DASHBOARD_API.URI + 'success', dashboardData);

    var scoreboardData;
    for (var dayOfWeek of new Set(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])) {
      if (!scoreboardData) {
        scoreboardData = JSON.parse(JSON.stringify(require('../data/scoreboard' + dayOfWeek + '.json').resultSets[0])); //clone to avoid weird two-way binding
      }
      else {
        scoreboardData.rowSet = scoreboardData.rowSet.concat(require('../data/scoreboard' + dayOfWeek + '.json').resultSets[0].rowSet);
      }
    }
    emitter.emit(NBAAPIConstants.LEAGUE_SCOREBOARD_API.URI + 'success', scoreboardData);
  }
  
  var playerData = require('../data/allplayers.json');
  emitter.emit(NBAAPIConstants.ALL_PLAYERS_API.URI + 'success', playerData.resultSets[0]);
}
