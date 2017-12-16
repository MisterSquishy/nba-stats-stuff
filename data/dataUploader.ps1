# get data from nba
# todo update dates in environment file
$date = Get-Date -UFormat "%Y-%m-%d"
newman run NBAStats.postman_collection.json -e date.post_environment.json -r 'json' --reporter-json-export CombinedData.json

# update json files
# todo parse stuff out of CombinedData.json
$fulldata = ???
$todaydata = ???
$yesterdaydata = ???

# push up to heroku
git add today.json yesterday.json full.json
git commit -m "Data update " + $date
heroku login
echo "pdavids02@yahoo.com`r" | heroku
echo "DataUploader1!`r" | heroku
git push heroku master
