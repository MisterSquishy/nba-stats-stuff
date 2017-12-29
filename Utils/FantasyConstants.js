var NBAAPIConstants = require('./NBAAPIConstants');
module.exports = {
  DavidsTheYounger : [
                    "Nikola Jokic",
                    "Kawhi Leonard",
                    "DeMarcus Cousins",
                    "Giannis Antetokounmpo",
                    "Andre Drummond",
                    "Victor Oladipo",
                    "Damian Lillard",
                    "Draymond Green",
                    "Chris Paul",
                    "Kemba Walker",
                    "Ben Simmons",
                    "DeMar DeRozan",
                    "Clint Capela"
                  ],
  DavidsTheWiser : [
                    "Russell Westbrook",
                    "Kyle Lowry",
                    "James Harden",
                    "Jimmy Butler",
                    "Stephen Curry",
                    "Anthony Davis",
                    "Kristaps Porzingis",
                    "Kevin Durant",
                    "Karl-Anthony Towns",
                    "Paul George",
                    "Joel Embiid",
                    "Kevin Love",
                    "LeBron James"
                  ],
  DavidsTheYoungerOld : [
                      "Giannis Antetokounmpo",
                      "Andre Drummond",
                      "Russell Westbrook",
                      "John Wall",
                      "Paul Millsap",
                      "Rudy Gobert",
                      "DeAndre Jordan",
                      "Draymond Green",
                      "Paul George",
                      "Ben Simmons",
                      "Eric Bledsoe",
                      "Tyreke Evans",
                      "Enes Kanter",
                      "Jusuf Nurkic",
                      "James Johnson"
                    ],
  DavidsTheWiserOld : [
                      "Blake Griffin",
                      "Jimmy Butler",
                      "Aaron Gordon",
                      "Kemba Walker",
                      "Devin Booker",
                      "Kevin Durant",
                      "Dwight Howard",
                      "Karl-Anthony Towns",
                      "Pau Gasol",
                      "Anthony Davis",
                      "Damian Lillard",
                      "Avery Bradley",
                      "Steven Adams",
                      "Donovan Mitchell",
                      "Allen Crabbe"
                    ],
  scoring : function() {
              var scoreMap = {};
              scoreMap[NBAAPIConstants.NBA_POINTS] = 1;
              scoreMap[NBAAPIConstants.NBA_ASSISTS] = 1.5;
              scoreMap[NBAAPIConstants.NBA_REBOUNDS] = 1.2;
              scoreMap[NBAAPIConstants.NBA_STEALS] = 3;
              scoreMap[NBAAPIConstants.NBA_BLOCKS] = 3;
              scoreMap[NBAAPIConstants.NBA_TURNOVERS] = -1;
              scoreMap[NBAAPIConstants.NBA_FGATTEMPTED + '-' + NBAAPIConstants.NBA_FGMADE] = -0.5;
              return scoreMap;
            }
}
