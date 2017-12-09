var NBAAPIConstants = require('./NBAAPIConstants');
module.exports.reformatNBAPlayerDashboard = function(APIName, headers, rowSet) {
    var desiredColIndices = [];
    for (var key in NBAAPIConstants[APIName].DesiredCols) {
      if (key.endsWith('%')) {
        //we compute these columns
        desiredColIndices.push(key);
        continue;
      }
      for (var i in headers) {
        if (headers[i] === key) {
          desiredColIndices.push(i);
        }
      }
    }

    var formattedHeaders = [];
    for (var colIndex in desiredColIndices) {
      if (desiredColIndices[colIndex].endsWith('%')) {
        //we compute these columns
        formattedHeaders.push({title:desiredColIndices[colIndex]});
        continue;
      }
      formattedHeaders.push({title:NBAAPIConstants[APIName].DesiredCols[headers[desiredColIndices[colIndex]]]});
    }

    var formattedRowSet = [];
    for (var row in rowSet) {
      var formattedRow = [];
      for (var col in desiredColIndices) {
        if (desiredColIndices[col].endsWith('%')) {
          var pct;
          if (parseFloat(rowSet[row][desiredColIndices[col-1]]) === 0) {
            pct = 0;
          }
          else {
            pct = 1000 * (parseFloat(rowSet[row][desiredColIndices[col-2]])/parseFloat(rowSet[row][desiredColIndices[col-1]]))
          }
          formattedRow.push(Math.round(pct)/10);
          continue;
        }

        if (isNaN(parseFloat(rowSet[row][desiredColIndices[col]]))) {
          formattedRow.push(rowSet[row][desiredColIndices[col]]);
        }
        else {
          formattedRow.push(Math.round(parseFloat(rowSet[row][desiredColIndices[col]])));
        }
      }
      formattedRowSet.push(formattedRow);
    }

    return [JSON.stringify(formattedHeaders), JSON.stringify(formattedRowSet)];
}
