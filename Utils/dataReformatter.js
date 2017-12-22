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
  if (NBAAPIConstants[APIName].URI === NBAAPIConstants.LEAGUE_DASHBOARD_API.URI) {
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

      if (isNaN(rowSet[row][desiredColIndices[col]])) {
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
    if (NBAAPIConstants[APIName].URI === NBAAPIConstants.LEAGUE_DASHBOARD_API.URI) {
      fPts += (FGA - FGM) * FantasyConstants.scoring()[NBAAPIConstants.NBA_FGATTEMPTED + '-' + NBAAPIConstants.NBA_FGMADE]; //yuck
      formattedRow.push(Math.round(fPts*10)/10);
    }
    formattedRowSet.push(formattedRow);
  }

  return [JSON.stringify(formattedHeaders), JSON.stringify(formattedRowSet)];
}

module.exports.createTodayView = function (headers, rows, scoreboard, allPlayers) {
  var gameCol;
  headers = JSON.parse(headers);
  //add column for today's game
  for (var i in headers) {
    if (headers[i].title === NBAAPIConstants.LEAGUE_DASHBOARD_API.DesiredCols.TEAM_ABBREVIATION) {
      headers.splice(parseInt(i) + 1, 0, {"title":"Game"});
      gameCol = parseInt(i) + 1;
      break;
    }
  }

  //find all teams with games today
  var teamsWithGames = {};
  for (var i in scoreboard) {
    teamsWithGames[scoreboard[i][0]] = scoreboard[i][2];
    teamsWithGames[scoreboard[i][1]] = scoreboard[i][2];
  }

  return module.exports.addRestOfPlayers(JSON.stringify(headers), rows, allPlayers, teamsWithGames)
}

module.exports.addRestOfPlayers = function (headers, rows, allPlayers, teamsWithGames) {
  teamsWithGames = teamsWithGames ? teamsWithGames : {};

  //flag gameCol (= team name + 1)
  headers = JSON.parse(headers);
  var gameCol;
  for (var i in headers) {
    if (headers[i].title === NBAAPIConstants.LEAGUE_DASHBOARD_API.DesiredCols.TEAM_ABBREVIATION) {
      gameCol = parseInt(i) + 1;
      break;
    }
  }

  //find all players who already have a row in the dashboard (b/c game is in progress/over)
  rows = JSON.parse(rows);
  var playersWithStats = {};
  for (var row in rows) {
    playersWithStats[rows[row][0]] = row;
  }
  
  //merge in the rest of the players, add game info for the existing players
  var newRows = [];
  for (var i in allPlayers) {
    var row = (playersWithStats.hasOwnProperty(allPlayers[i][0])) ? rows[playersWithStats[allPlayers[i][0]]] : []; //use existing stats if we got them
    for (var j in headers) {
      if (row.length <= j && j < gameCol) { //add in name and team cols
        row.push(allPlayers[i][j]);
      }
      if (j == gameCol &&
        teamsWithGames.hasOwnProperty(NBAAPIConstants.TEAM_ID[allPlayers[i][j - 1]])) {
        //this player's team is playing today, add their game
        row.push(teamsWithGames[NBAAPIConstants.TEAM_ID[allPlayers[i][j - 1]]]);
      }
      else if (row.length <= j) {
        row.push('-');
      }
    }
    newRows.push(row);
  }

  return [JSON.stringify(headers), JSON.stringify(newRows)];
}