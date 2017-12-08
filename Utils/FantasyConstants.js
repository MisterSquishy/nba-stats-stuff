var NBAAPIConstants = require('./NBAAPIConstants');
module.exports = {
  DavidsTheYounger : [
                      "Giannis Antetokounmpo",
                      "Andre Drummond",
                      "Russell Westbrook",
                      "John Wall",
                      "Paul Millsap",
                      "Rudy Gobert",
                      "Deandre Jordon",
                      "Draymond Green",
                      "Paul George",
                      "Ben Simmons",
                      "Elfrid Payton",
                      "Eric Bledsoe",
                      "Tyreke Evans",
                      "Enes Kanter",
                      "Jusuf Nurkic",
                      "Kyle Kuzma",
                      "James Johnson"
                    ],
  DavidsTheWiser : [
                      "Blake Griffin",
                      "Jimmy Butler",
                      "Aaron Gordon",
                      "Kemba Walker",
                      "Devin Booker",
                      "Kevin Durant",
                      "Rajon Rondo",
                      "Dwight Howard",
                      "Karl-Anthony Towns",
                      "Pau Gasol",
                      "Derrick Favors",
                      "Anthony Davis",
                      "Damian Lillard",
                      "Avery Bradley",
                      "Dennis Smith Jr.",
                      "Steven Adams",
                      "D'Angelo Russell"
                    ],
  scoring : function() {
              var scoreMap = {};
              scoreMap[NBAAPIConstants.NBA_POINTS] = 1;
              scoreMap[NBAAPIConstants.NBA_ASSISTS] = 1.5;
              scoreMap[NBAAPIConstants.NBA_REBOUNDS] = 1.2;
              scoreMap[NBAAPIConstants.NBA_STEALS] = 3;
              scoreMap[NBAAPIConstants.NBA_BLOCKS] = 3;
              scoreMap[NBAAPIConstants.NBA_TURNOVERS] = -1;
              scoreMap[NBAAPIConstants.NBA_FGMISSED] = -0.5;
              return scoreMap;
            }
}
