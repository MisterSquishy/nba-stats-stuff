module.exports = {
  //fantasy value cats
  NBA_POINTS : 'Pts',
  NBA_REBOUNDS : 'Rebs',
  NBA_ASSISTS : 'Asts',
  NBA_STEALS : 'Stls',
  NBA_BLOCKS : 'Blks',
  NBA_FGMADE : 'FGM',
  NBA_FGATTEMPTED : 'FGA',
  NBA_FGPCT : 'FG%',
  NBA_TURNOVERS : 'TOs',
  //bonus value cats
  NBA_FTMADE : 'FTM',
  NBA_FTATTEMPTED : 'FTA',
  NBA_FTPCT : 'FT%',
  NBA_MINUTES : 'MIN',
  NBA_PLUSMINUS : '+/-',
  //other column headers
  NBA_NAME : 'Name',
  NBA_TEAM : 'Team',
  NBA_GAMESPLAYED : 'GP',
  //team IDs hardcoded
  TEAM_ID : {
    'ATL':'1610612737',
    'BOS':'1610612738',
    'BKN':'1610612751',
    'CHA':'1610612766',
    'CHI':'1610612741',
    'CLE':'1610612739',
    'DAL':'1610612742',
    'DEN':'1610612743',
    'DET':'1610612765',
    'GSW':'1610612744',
    'HOU':'1610612745',
    'IND':'1610612754',
    'LAC':'1610612746',
    'LAL':'1610612747',
    'MEM':'1610612763',
    'MIA':'1610612748',
    'MIL':'1610612749',
    'MIN':'1610612750',
    'NOP':'1610612740',
    'NYK':'1610612752',
    'OKC':'1610612760',
    'ORL':'1610612753',
    'PHI':'1610612755',
    'PHX':'1610612756',
    'POR':'1610612757',
    'SAC':'1610612758',
    'SAS':'1610612759',
    'TOR':'1610612761',
    'UTA':'1610612762',
    'WAS':'1610612764'
  },
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
              'MIN':'Min',
              'PTS':'Pts',
              'FGM':'FGM',
              'FGA':'FGA',
              'FG%':'FG%', //special case, computes %age from prior 2 cols
              'REB':'Rebs',
              'AST':'Asts',
              'STL':'Stls',
              'BLK':'Blks',
              'TOV':'TOs',
              'FTM':'FTM',
              'FTA':'FTA',
              'FT%':'FT%', //special case, computes %age from prior 2 cols
              'PLUS_MINUS':'+/-'
            }
  },
  LEAGUE_SCOREBOARD_API : {
    URI : '/stats/scoreboard',
    Params : {
      'GameDate':(new Date).toISOString().slice(0,10),
      'LeagueID':'00',
      'DayOffset':'0'
    },
    DesiredCols : {
        'HOME_TEAM_ID':'Team1',
        'VISITOR_TEAM_ID':'Team2',
        'GAME_STATUS_TEXT':'Status'
    }
  },
  ALL_PLAYERS_API : {
    URI : '/stats/commonallplayers',
    Params : {
      'LeagueID':'00',
      'Season':'2017-18',
      'IsOnlyCurrentSeason':'1'
    },
    DesiredCols : {
        'DISPLAY_FIRST_LAST':'Name',
        'TEAM_ABBREVIATION':'Team'
    }
  }
}
