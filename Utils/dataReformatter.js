var NBAAPIConstants = require('./NBAAPIConstants');
var FantasyConstants = require('./FantasyConstants');
module.exports.reformatNBAPlayerDashboard = function (APIName, headers, rowSet) {
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
  if (APIName === 'LEAGUE_DASHBOARD_API') {
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
        formattedRow.push(Math.round(num*10)/10);
        if (formattedHeaders[col].title === NBAAPIConstants.NBA_FGATTEMPTED) {FGA = num;}
        else if (formattedHeaders[col].title === NBAAPIConstants.NBA_FGMADE) {FGM = num;}
        if (!isNaN(parseFloat(FantasyConstants.scoring()[formattedHeaders[col].title]))) {
          fPts += (num * parseFloat(FantasyConstants.scoring()[formattedHeaders[col].title]));
        }
      }
    }
    if (APIName === 'LEAGUE_DASHBOARD_API') {
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
      headers.splice(parseInt(i) + 1, 0, { "title": "Game" });
      headers.splice(parseInt(i) + 2, 0, {"title":"Date"});
      gameCol = parseInt(i) + 1;
      break;
    }
  }

  //find all teams with games today
  var teamsWithGames = {};
  for (var i in scoreboard) {
    var homeTeamGameNum = teamsWithGames[scoreboard[i][0]] ? teamsWithGames[scoreboard[i][0]].total : 0;
    var awayTeamGameNum = teamsWithGames[scoreboard[i][1]] ? teamsWithGames[scoreboard[i][1]].total : 0;
    if (homeTeamGameNum === 0) { teamsWithGames[scoreboard[i][0]] = {}; teamsWithGames[scoreboard[i][0]].dates = []; }
    if (awayTeamGameNum === 0) { teamsWithGames[scoreboard[i][1]] = {}; teamsWithGames[scoreboard[i][1]].dates = []; }
    teamsWithGames[scoreboard[i][0]][homeTeamGameNum] = NBAAPIConstants.TEAM_ID_TO_ABBR()[scoreboard[i][1]] + ', ' + scoreboard[i][2];
    teamsWithGames[scoreboard[i][1]][awayTeamGameNum] = '@' + NBAAPIConstants.TEAM_ID_TO_ABBR()[scoreboard[i][0]] + ', ' + scoreboard[i][2];
    teamsWithGames[scoreboard[i][0]].dates.push(new Date(scoreboard[i][3]).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'}));
    teamsWithGames[scoreboard[i][1]].dates.push(new Date(scoreboard[i][3]).toLocaleString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric'}));
    teamsWithGames[scoreboard[i][0]].total = homeTeamGameNum + 1;
    teamsWithGames[scoreboard[i][1]].total = awayTeamGameNum + 1;
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
    var playerGameNum = playersWithStats[rows[row][0]] ? playersWithStats[rows[row][0]].total : 0;
    if (playerGameNum === 0) { playersWithStats[rows[row][0]] = {}; }
    playersWithStats[rows[row][0]][playerGameNum] = row;
    playersWithStats[rows[row][0]].total = playerGameNum + 1;
  }
  
  //merge in the rest of the players, add game info for the existing players
  var newRows = [];
  for (var player in allPlayers) {
    var gameCount = playersWithStats[allPlayers[player][0]] ? playersWithStats[allPlayers[player][0]].total : 1;
    var playerTeam;
    for (var playerGameNum = 0; playerGameNum < gameCount; playerGameNum++) {
      var row = [];
      if (playersWithStats.hasOwnProperty(allPlayers[player][0])) { //use existing stats if we got them
        row = rows[playersWithStats[allPlayers[player][0]][playerGameNum]];
      }
      for (var col in headers) {
        if (row.length <= col && col < gameCol) { //add in name and team cols
          row.push(allPlayers[player][col]);
        }
        if (col == gameCol &&
          teamsWithGames.hasOwnProperty(NBAAPIConstants.TEAM_ABBR_TO_ID[allPlayers[player][col - 1]])) {
          //this player's team is playing today, add their game
          row.splice(parseInt(col), 0, teamsWithGames[NBAAPIConstants.TEAM_ABBR_TO_ID[allPlayers[player][col - 1]]][playerGameNum]);
          playerTeam = NBAAPIConstants.TEAM_ABBR_TO_ID[allPlayers[player][col - 1]];
          row.splice(parseInt(col) + 1, 0, teamsWithGames[NBAAPIConstants.TEAM_ABBR_TO_ID[allPlayers[player][col - 1]]].dates[playerGameNum]);
        }
        else if (row.length <= col) {
          row.push('-');
        }
      }
      newRows.push(row);
    }

    //TODO: If player missed first game of week, stats for second will show up as the first, second will be blank
    if (teamsWithGames[playerTeam]) { //if we're merging in scoreboard info
      for (var futureGameNum = gameCount; futureGameNum < teamsWithGames[playerTeam].total; futureGameNum++) {
        var row = [];
        for (var col in headers) {
          if (row.length <= col && col < gameCol) { //add in name and team cols
            row.push(allPlayers[player][col]);
          }
          if (col == gameCol) {
            //this player's team is playing today, add their game
            row.splice(parseInt(col), 0, teamsWithGames[playerTeam][futureGameNum]);
            row.splice(parseInt(col) + 1, 0, teamsWithGames[playerTeam].dates[futureGameNum]);
          }
          else if (row.length <= col) {
            row.push('-');
          }
        }
        newRows.push(row);
      }
    }  
  }

  return [JSON.stringify(headers), JSON.stringify(newRows)];
}