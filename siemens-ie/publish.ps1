# Stop when there is an error with the following commands
$ErrorActionPreference = "Stop"

# Delete existing app
.\iectl publisher sa delete -a "HighByte Intelligence Hub"

# Create app
.\iectl publisher standalone-app create `
    --appname "HighByte Intelligence Hub" `
    --reponame "highbyte" `
    --appdescription "HighByte Intelligence Hub is an industrial data operations solution, designed specifically for data modeling, orchestration and governance allowing to seamlessly connect, contextualize and transform data from both operational technology (OT) and information technology (IT) sources." `
    --iconpath ".\hbih-icon.png" `
    --webAddress "https://www.highbyte.com"

# Build nginx arg
$nginxArg = jq -c 'map_values(map(.headers |= tojson))' nginx.json

# Create version
.\iectl publisher sa version create -a "HighByte Intelligence Hub" -v "4.4.2-rev1" `
    -y compose-442.yml `
    -n ($nginxArg | ConvertTo-Json -Compress) `
    -t "FromBoxReverseProxy" -s "intelligence-hub" -u "intelligence-hub/" `
    -c "Please view the complete release notes and patch history for details on new features, fixes, breaking changes, and security updates at https://www.highbyte.com/resources/release-notes/version-4-4"

# Add IE Device URL app config
.\iectl publisher sa app-config add `
    --appname "HighByte Intelligence Hub" `
    --configname "IE_Device_URL" `
    --configdescription "Specify the URL of the target device hosting Intelligence Hub" `
    --hostpath "appconfig" `
    --templatename "DeviceURLTemplate" `
    --templatedescription "Device URL Template Schema V1" `
    --jsonschema `
    --filepath "./appconfig/device-url.json"

# Add EULA app config
.\iectl publisher sa app-config add `
    --appname "HighByte Intelligence Hub" `
    --configname "End_User_License_Agreement" `
    --configdescription "Review and Accept EULA: https://www.highbyte.com/hubfs/highbyte_intelligence_hub_eula.pdf" `
    --hostpath "appconfig" `
    --templatename "AcceptEulaTemplate" `
    --templatedescription "Accept EULA Template Schema V1" `
    --jsonschema `
    --filepath "./appconfig/accept-eula.json"

# Export version
.\iectl publisher standalone-app version export `
    --appname "HighByte Intelligence Hub" `
    --exportpath .\export `
    --versionnumber "4.4.2-rev1"
