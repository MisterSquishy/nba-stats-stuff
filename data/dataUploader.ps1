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
$dateEnvironment | ConvertTo-Json -depth 10 | Set-Content "date.postman_environment.json"
cmd /c "newman run NBAStats.postman_collection.json -e date.postman_environment.json -r json --reporter-json-export CombinedData.json"

# update json files
$CombinedDataText = Get-Content  -Raw -Path  CombinedData.json
$CombinedData = ConvertFrom-Json –InputObject $CombinedDataText

$fulldata = Parse-GzipStreamData $CombinedData.run.executions[0].response.stream.data #callout 1 is full
$fulldata | Set-Content "full.json"
$todaydata = Parse-GzipStreamData $CombinedData.run.executions[1].response.stream.data #callout 2 is today
$todaydata | Set-Content "today.json"
$yesterdaydata = Parse-GzipStreamData $CombinedData.run.executions[2].response.stream.data #callout 3 is yesterday
$yesterdaydata | Set-Content "yesterday.json"
$yesterdaydata = Parse-GzipStreamData $CombinedData.run.executions[3].response.stream.data #callout 4 is scoreboard
$yesterdaydata | Set-Content "scoreboard.json"
$yesterdaydata = Parse-GzipStreamData $CombinedData.run.executions[4].response.stream.data #callout 5 is allplayers
$yesterdaydata | Set-Content "allplayers.json"

# push up to heroku
#GitHub: pdavids02@yahoo.com/TestPassword1!
cmd.exe /c "git config user.email pdavids02@yahoo.com"
cmd.exe /c "git config user.name PJDDataUploader"
cmd.exe /c "git add today.json yesterday.json full.json allplayers.json scoreboard.json date.postman_environment.json"
$date = Get-Date
cmd.exe /c "git commit -m `"Data update $date`""
#Heroku: pdavids02@yahoo.com/DataUploader1!
cmd.exe /c "git push origin master"
