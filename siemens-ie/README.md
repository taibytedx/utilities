### setup
```
.\iectl config list  
.\iectl config add publisher --name dev-workspace --workspace ./workspace --dockerurl http://127.0.0.1:2375
.\iectl publisher sa list   
.\iectl publisher sa delete -a "Intelligence Hub"       
.\iectl config workspace list    
.\iectl publisher workspace init    
```

### create app
```powershell
.\iectl publisher standalone-app create `                             
    --appname "Intelligence Hub" `
    --reponame "highbyte" `            
    --appdescription "intelligencehub"  `  
    --iconpath ".\hbih-icon.png" `
    --externalUrl "www.highbyte.com" 
```

### create version
 ```powershell
$nginxArg = jq -c 'map_values(map(.headers |= tojson))' nginx.json
$nginxArg

.\iectl publisher sa version create -a "Intelligence Hub" -v "1.0.0" `
    -y compose.yml `
    -n ($nginxArg | ConvertTo-Json -Compress) `
    -t "FromBoxReverseProxy" -s "highbyte" -u "ih/"
```

### add app config for uploading /configuration/config/settings.json
```
.\iectl publisher standalone-app app-config add `
    --appname "Intelligence Hub" `
    --configname "TextConfig" `
    --configdescription "Configure your example application" `
    --hostpath "./cfg-data" `
    --templatename "TextConfigTemplate" `
    --templatedescription "Text Config Template v1" `
    --filepath "./settings.json"
```

### export app
```
.\iectl publisher standalone-app version export `
        --appname "Intelligence Hub" `
        --exportpath .\export `
        --versionnumber "1.0.0"
```


### app config schema
It would be neat if we can use the schema template instead so user can fill out a field instead of uploading a file
```
.\iectl publisher sa app-config add `
    --appname "Intelligence Hub" `
    --configname "SettingsConfig" `
    --configdescription "Configure the API Base URL" `
    --hostpath "./cfg-data" `
    --templatename "SettingsTemplate" `
    --templatedescription "Settings configuration template" `
    --jsonschema `
    --filepath "./settings-schema.json"
```


### how do you parameterize values to the compose file?
is there a way to upload a .env file to pass in environment variables?
```
.\iectl publisher standalone-app app-config add `
    --appname "Intelligence Hub" `
    --configname "UploadConfig" `
    --configdescription "Upload a configuration file" `
    --hostpath "."
```

### reference

```
.\iectl publisher sa list
.\iectl publisher sa app-config l -a "Intelligence Hub"
.\iectl publisher sa app-config delete -a "Intelligence Hub" --configid "UIc3BaEdy1h6c9bTB1x80N6dgFeg6jjZ"
```
