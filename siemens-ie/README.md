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
    -t "FromBoxReverseProxy" -s "intelligence-hub" -u "ih/ui/index.html"
```

### add JSON Schema app config for uploading /configuration/config/settings.json
```
.\iectl publisher sa app-config add `
    --appname "Intelligence Hub" `
    --configname "IE Device URL" `
    --configdescription "Assign the Base URL of IED + /ih subpath" `
    --hostpath "config_vol" `
    --templatename "ConfigurationSettingsTemplate" `
    --templatedescription "Configuration Settings Template Schema V2" `
    --jsonschema `
    --filepath "./app-config/settings.json"
```

### add JSON Schema app config for getting user input for accepting EULA
```
.\iectl publisher sa app-config add `
    --appname "Intelligence Hub" `
    --configname "EULA" `
    --configdescription "Accept EULA forms" `
    --hostpath "./cfg-data" `
    --templatename "AcceptEulaTemplate" `
    --templatedescription "Accept EULA Template Schema V2" `
    --jsonschema `
    --filepath "./app-config/accept-eula.json"
```

### export app
```
.\iectl publisher standalone-app version export `
        --appname "Intelligence Hub" `
        --exportpath .\export `
        --versionnumber "1.0.0"
```

### reference

```
.\iectl publisher sa list
.\iectl publisher sa app-config l -a "Intelligence Hub"
.\iectl publisher sa app-config delete -a "Intelligence Hub" --configid "UIc3BaEdy1h6c9bTB1x80N6dgFeg6jjZ"
```

