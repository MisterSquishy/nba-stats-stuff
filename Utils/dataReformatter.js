var NBAAPIConstants = require('./NBAAPIConstants');
module.exports.reformatNBAPlayerDashboard = function(APIName, headers, rowSet) {
    var desiredColIndices = [];
    for (var key in NBAAPIConstants[APIName].DesiredCols) {
      for (var i in headers) {
        if (headers[i] === key) {
          desiredColIndices.push(i);
        }
      }
    }

    var formattedHeaders = [];
    for (var col in desiredColIndices) {
      formattedHeaders.push({title:NBAAPIConstants[APIName].DesiredCols[headers[desiredColIndices[col]]]});
    }

    var formattedRowSet = [];
    for (var row in rowSet) {
      var formattedRow = [];
      for (var col in desiredColIndices) {
        formattedRow.push(rowSet[row][desiredColIndices[col]]);
      }
      formattedRowSet.push(formattedRow);
    }

    return [JSON.stringify(formattedHeaders), JSON.stringify(formattedRowSet)];
}
