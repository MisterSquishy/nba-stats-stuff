const emitter = require('./globalEmitter');

module.exports.load = function(dateParam) {
  var data = require('../data/' + dateParam.toLower() + '.json');
  emitter.emit('calloutsuccess', data.resultSets[0]);
}
