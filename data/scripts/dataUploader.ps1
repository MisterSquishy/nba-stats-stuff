function Parse-GzipStreamData {
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
$dateEnvironmentText = Get-Content -Raw -Path date.postman_environment.json
$dateEnvironment = ConvertFrom-Json –InputObject $dateEnvironmentText
$dateEnvironment.values[0].value = Get-Date -UFormat "%Y-%m-%d" #param 1 is today
$dateEnvironment.values[1].value = Get-Date (Get-Date).AddDays(-1) -UFormat "%Y-%m-%d" #param 2 is yesterday
#TODO: get days of the week
$dateEnvironment | ConvertTo-Json -depth 10 | Set-Content "date.postman_environment.json"
cmd /c "newman run NBAStats.postman_collection.json -e date.postman_environment.json -r json --reporter-json-export CombinedData.json"

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
$data | Set-Content "../sunday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[4].response.stream.data
$data | Set-Content "../monday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[5].response.stream.data
$data | Set-Content "../tuesday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[6].response.stream.data
$data | Set-Content "../wednesday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[7].response.stream.data
$data | Set-Content "../thursday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[8].response.stream.data
$data | Set-Content "../friday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[9].response.stream.data
$data | Set-Content "../saturday.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[10].response.stream.data #callout 11 is full per game
$data | Set-Content "../fullpergame.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[11].response.stream.data #callout 12 is scoreboard
$data | Set-Content "../scoreboard.json"
$data = Parse-GzipStreamData $CombinedData.run.executions[12].response.stream.data #callout 13 is allplayers
$data | Set-Content "../allplayers.json"

# push up to heroku
#GitHub: pdavids02@yahoo.com/TestPassword1!
cmd.exe /c "git config user.email pdavids02@yahoo.com"
cmd.exe /c "git config user.name PJDDataUploader"
cmd.exe /c "git add ../today.json ../yesterday.json ../full.json ../sunday.json ../monday.json ../tuesday.json ../wednesday.json ../thursday.json ../friday.json ../saturday.json ../fullpergame.json ../allplayers.json ../scoreboard.json date.postman_environment.json"
$date = Get-Date
cmd.exe /c "git commit -m `"Data update $date`""
#Heroku: pdavids02@yahoo.com/DataUploader1!
cmd.exe /c "git push origin master"
