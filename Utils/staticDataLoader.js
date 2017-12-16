const emitter = require('./globalEmitter');

module.exports.load = function(dateParam) {
  var data = require('../data/' + dateParam.toLowerCase() + '.json');
  emitter.emit('calloutsuccess', data.resultSets[0]);
}
