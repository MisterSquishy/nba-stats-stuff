﻿function Parse-GzipStreamData {
    Param ([Byte[]]$b)

    $sb = New-Object -TypeName "System.Text.StringBuilder";

    $gZipStream = New-Object System.IO.MemoryStream( , $b )
    $gZipData = New-Object IO.Compression.GZipStream $gZipStream, ([System.IO.Compression.CompressionMode]::Decompress)
    $gZipBaseStream = $gZipData.BaseStream
    $parsedgZipString = ""
    for($i = 0; $i -lt $gZipBaseStream.Length; $i++) {
        $parsedgZipString = $sb.Append($([System.Text.Encoding]::ASCII.GetString($gZipBaseStream.ReadByte())))
    }
    return $parsedgZipString
}

Set-Location $(Split-Path $MyInvocation.MyCommand.Path)

# get data from nba
$daysFromMonday = @{"Sunday" = 6; "Monday" = 7; "Tuesday" = 1; "Wednesday" = 2; "Thursday" = 3; "Friday" = 4; "Saturday" = 5;}
$dateEnvironmentText = Get-Content -Raw -Path date.postman_environment.json
$dateEnvironment = ConvertFrom-Json –InputObject $dateEnvironmentText
$dateEnvironment.values[0].value = Get-Date -Date 2018-01-22 -UFormat "%Y-%m-%d" #Get-Date -UFormat "%Y-%m-%d" #HARDCODED DATES TO MIDSEASON #param 1 is today
$dateEnvironment.values[1].value = Get-Date -Date 2018-01-21 -UFormat "%Y-%m-%d" #Get-Date (Get-Date).AddDays(-1) -UFormat "%Y-%m-%d" #HARDCODED DATES TO MIDSEASON #param 2 is yesterday
$lastMonday = Get-Date -Date 2018-01-15 #(Get-Date).AddDays(-$daysFromMonday.Get_Item([string](Get-Date).DayOfWeek)) #HARDCODED DATES TO MIDSEASON
$dateEnvironment.values[2].value = Get-Date $lastMonday -UFormat "%Y-%m-%d"
$dateEnvironment.values[3].value = Get-Date $lastMonday.AddDays(1) -UFormat "%Y-%m-%d"
$dateEnvironment.values[4].value = Get-Date $lastMonday.AddDays(2) -UFormat "%Y-%m-%d"
$dateEnvironment.values[5].value = Get-Date $lastMonday.AddDays(3) -UFormat "%Y-%m-%d"
$dateEnvironment.values[6].value = Get-Date $lastMonday.AddDays(4) -UFormat "%Y-%m-%d"
$dateEnvironment.values[7].value = Get-Date $lastMonday.AddDays(5) -UFormat "%Y-%m-%d"
$dateEnvironment.values[8].value = Get-Date $lastMonday.AddDays(6) -UFormat "%Y-%m-%d"

$dateEnvironment | ConvertTo-Json -depth 10 | Set-Content "date.postman_environment.json"
newman run NBAStats.postman_collection.json -e date.postman_environment.json -r json --reporter-json-export CombinedData.json

# update json files
$CombinedDataText = Get-Content  -Raw -Path  CombinedData.json
$CombinedData = ConvertFrom-Json –InputObject $CombinedDataText

$data = Parse-GzipStreamData $CombinedData.run.executions[0].response.stream.data #callout 1 is full
$data | Set-Content "../full.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[1].response.stream.data #callout 2 is today
$data | Set-Content "../today.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[2].response.stream.data #callout 3 is yesterday
$data | Set-Content "../yesterday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[3].response.stream.data #these are for days of the week
$data | Set-Content "../monday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[4].response.stream.data
$data | Set-Content "../tuesday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[5].response.stream.data
$data | Set-Content "../wednesday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[6].response.stream.data
$data | Set-Content "../thursday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[7].response.stream.data
$data | Set-Content "../friday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[8].response.stream.data
$data | Set-Content "../saturday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[9].response.stream.data
$data | Set-Content "../sunday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[10].response.stream.data #callout 11 is full per game
$data | Set-Content "../fullpergame.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[11].response.stream.data #today's scoreboard
$data | Set-Content "../scoreboard.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[12].response.stream.data #this week's scoreboard
$data | Set-Content "../scoreboardMonday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[13].response.stream.data
$data | Set-Content "../scoreboardTuesday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[14].response.stream.data
$data | Set-Content "../scoreboardWednesday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[15].response.stream.data
$data | Set-Content "../scoreboardThursday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[16].response.stream.data
$data | Set-Content "../scoreboardFriday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[17].response.stream.data
$data | Set-Content "../scoreboardSaturday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[18].response.stream.data
$data | Set-Content "../scoreboardSunday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[19].response.stream.data #callout 20 is allplayers
$data | Set-Content "../allplayers.json"

# push up to heroku
#GitHub: pdavids02@yahoo.com/TestPassword1!
git config user.email pdavids02@yahoo.com
git config user.name PJDDataUploader
git add ../today.json ../yesterday.json ../full.json ../sunday.json ../monday.json ../tuesday.json ../wednesday.json ../thursday.json ../friday.json ../saturday.json ../fullpergame.json ../allplayers.json ../scoreboard.json ../scoreboardSunday.json ../scoreboardMonday.json ../scoreboardTuesday.json ../scoreboardWednesday.json ../scoreboardThursday.json ../scoreboardFriday.json ../scoreboardSaturday.json date.postman_environment.json
$date = Get-Date
git commit -m "`"Data update $date`""
#Heroku: pdavids02@yahoo.com/DataUploader1!
git push origin master
