var NBAAPIConstants = require('./NBAAPIConstants');
var FantasyConstants = require('./FantasyConstants');
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
    if (APIName.URI === LEAGUE_DASHBOARD_API.URI) {
      formattedHeaders.push({title:"FPts"}); //this is shamefully lazy
    }

    var formattedRowSet = [];
    for (var row in rowSet) {
      var formattedRow = [];
      var fPts = 0;
      var FGA = 0;
      var FGM = 0;
      for (var col in desiredColIndices) {
        if (desiredColIndices[col].endsWith('%')) {
          var pct;
          if (parseFloat(rowSet[row][desiredColIndices[col-1]]) === 0) {
            pct = 0;
          }
          else {
            pct = 100 * (parseFloat(rowSet[row][desiredColIndices[col-2]])/parseFloat(rowSet[row][desiredColIndices[col-1]]))
          }
          formattedRow.push(Math.round(pct*10)/10);
          continue;
        }

        if (isNaN(parseFloat(rowSet[row][desiredColIndices[col]]))) {
          formattedRow.push(rowSet[row][desiredColIndices[col]]);
        }
        else {
          var num = parseFloat(rowSet[row][desiredColIndices[col]]);
          formattedRow.push(Math.round(num));
          if (formattedHeaders[col].title === NBAAPIConstants.NBA_FGATTEMPTED) {FGA = num;}
          else if (formattedHeaders[col].title === NBAAPIConstants.NBA_FGMADE) {FGM = num;}
          if (!isNaN(parseFloat(FantasyConstants.scoring()[formattedHeaders[col].title]))) {
            fPts += (num * parseFloat(FantasyConstants.scoring()[formattedHeaders[col].title]));
          }
        }
      }
      if (APIName.URI === LEAGUE_DASHBOARD_API.URI) {
        fPts += (FGA - FGM) * FantasyConstants.scoring()[NBAAPIConstants.NBA_FGATTEMPTED + '-' + NBAAPIConstants.NBA_FGMADE]; //yuck
        formattedRow.push(Math.round(fPts*10)/10);
      }
      formattedRowSet.push(formattedRow);
    }

    return [JSON.stringify(formattedHeaders), JSON.stringify(formattedRowSet)];
}
