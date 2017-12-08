module.exports = {
  //fantasy value cats
  NBA_POINTS : 'Pts',
  NBA_REBOUNDS : 'Rebs',
  NBA_ASSISTS : 'Asts',
  NBA_STEALS : 'Stls',
  NBA_BLOCKS : 'Blks',
  NBA_FGMADE : 'FGM',
  NBA_FGATTEMPTED : 'FGA',
  NBA_TURNOVERS : 'TOs',
  //bonus value cats
  NBA_FTMADE : 'FTM',
  NBA_FTATTEMPTED : 'FTA',
  NBA_MINUTES : 'MIN',
  NBA_PLUSMINUS : '+/-',
  //other column headers
  NBA_NAME : 'Name',
  NBA_TEAM : 'Team',
  NBA_GAMESPLAYED : 'GP',
  //stuff about what columns to include/exclude for each API
  LEAGUE_DASHBOARD_API : {
    URI : '/stats/leaguedashplayerstats',
    Params : {
              'SeasonType':'Regular Season',
              'MeasureType':'Base',
              'PerMode':'Totals',
              'PlusMinus':'N',
              'PaceAdjust':'N',
              'Rank':'N',
              'Season':'2017-18',
              'Month':'0',
              'LastNGames':'0',
              'Period':'0',
              'OpponentTeamID':'0',
              'DateFrom':'',
              'DateTo':'',
              'VsConference':'',
              'GameSegment':'',
              'SeasonSegment':'',
              'GameScope':'',
              'PlayerExperience':'',
              'PlayerPosition':'',
              'StarterBench':'',
              'VsDivision':'',
              'Outcome':'',
              'Location':''
            },
    DesiredCols : {
              'PLAYER_NAME':'Name',
              'TEAM_ABBREVIATION':'Team',
              'GP':'GP',
              'MIN':'Min',
              'PTS':'Pts',
              'FGM':'FGM',
              'FGA':'FGA',
              'REB':'Reb',
              'AST':'Ast',
              'STL':'Stl',
              'BLK':'Blk',
              'TOV':'TO',
              'FTM':'FTM',
              'FTA':'FTA',
              'PLUS_MINUS':'+/-'
            }
  }
  //other stuff?
}
