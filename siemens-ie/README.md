### setup
```
.\iectl config list
.\iectl config add publisher --name dev-workspace --workspace ./workspace --dockerurl http://127.0.0.1:2375
.\iectl publisher sa list
.\iectl config workspace list
.\iectl publisher workspace init
.\iectl publisher sa delete -a "HighByte Intelligence Hub"
```

### create app
```powershell
.\iectl publisher standalone-app create `
    --appname "HighByte Intelligence Hub" `
    --reponame "highbyte" `
    --appdescription "HighByte Intelligence Hub is an industrial data operations solution, designed specifically for data modeling, orchestration and governance allowing to seamlessly connect, contextualize and transform data from both operational technology (OT) and information technology (IT) sources."  `
    --iconpath ".\hbih-icon.png" `
    --webAddress "https://www.highbyte.com" 
```

### create version
 ```powershell
$nginxArg = jq -c 'map_values(map(.headers |= tojson))' nginx.json
echo $nginxArg

.\iectl publisher sa version create -a "HighByte Intelligence Hub" -v "4.4.2-rev1" `
    -y compose-442.yml `
    -n ($nginxArg | ConvertTo-Json -Compress) `
    -t "FromBoxReverseProxy" -s "intelligence-hub" -u "intelligence-hub/" `
    -c "Please view the complete release notes and patch history for details on new features, fixes, breaking changes, and security updates at https://www.highbyte.com/resources/release-notes/version-4-4"
```

### add JSON Schema app config for uploading /configuration/config/settings.json
```
.\iectl publisher sa app-config add `
    --appname "HighByte Intelligence Hub" `
    --configname "SettingsConfig" `
    --configdescription "Assign the URL for Intelligence Hub" `
    --hostpath "app-config" `
    --templatename "ConfigurationSettingsTemplate" `
    --templatedescription "Configuration Settings Template Schema V1" `
    --jsonschema `
    --filepath "./app-config/settings.json"
```

### add JSON Schema app config for getting user input for accepting EULA
```
.\iectl publisher sa app-config add `
    --appname "HighByte Intelligence Hub" `
    --configname "AcceptEulaConfig" `
    --configdescription "Accept EULA forms" `
    --hostpath "app-config" `
    --templatename "AcceptEulaTemplate" `
    --templatedescription "Accept EULA Template Schema V1" `
    --jsonschema `
    --filepath "./app-config/accept-eula.json"
```

### export app
```
.\iectl publisher standalone-app version export `
    --appname "HighByte Intelligence Hub" `
    --exportpath .\export `
    --versionnumber "4.4.2-rev1"
```

### reference

```
.\iectl publisher sa list
.\iectl publisher sa app-config l -a "HighByte Intelligence Hub"
.\iectl publisher sa app-config delete -a "HighByte Intelligence Hub" --configid "UIc3BaEdy1h6c9bTB1x80N6dgFeg6jjZ"
```

