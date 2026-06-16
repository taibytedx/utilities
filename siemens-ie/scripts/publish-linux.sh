#!/bin/bash

# Stop when there is an error with the following commands
set -eo pipefail

APP_NAME="HighByte Intelligence Hub"
APP_VERSION="4.4.2"
APP_ID="Pt9CSWFvpzLhLlhABuLLukTbqzhlWC4b"
COMPOSE_FILE="compose-442.yml"

# If app doesn't exist, import
if ! ./iectl publisher sa list | jq -e '.[] | select(.title == "'"$APP_NAME"'")' > /dev/null 2>&1; then
    ./iectl publisher standalone-app import -a "./imports/${APP_ID}_${APP_VERSION}.app"
fi

## App Config

# Delete all app-configs for the app
./iectl publisher sa app-config l -a "$APP_NAME" \
    | jq -r '.[].appConfigId' \
    | while read -r configId; do
        ./iectl publisher standalone-app app-config delete \
            -a "$APP_NAME" \
            -c "$configId"
    done

# Add EULA app config
./iectl publisher sa app-config add \
    --appname "$APP_NAME" \
    --configname "ACCEPT_EULA" \
    --configdescription "Intelligence Hub requires acceptance of the End User License Agreement before starting." \
    --hostpath "appconfig" \
    --templatename "AcceptEulaTemplate" \
    --templatedescription "Accept EULA Template Schema V1" \
    --jsonschema \
    --filepath "./appconfig/accept-eula.json"

# Add hostname override app config
./iectl publisher sa app-config add \
    --appname "$APP_NAME" \
    --configname "HostnameOverride" \
    --configdescription "Specify a custom hostname or reverse proxy address if the Edge Device IP is not directly accessible." \
    --hostpath "appconfig" \
    --templatename "HostnameOverrideTemplate" \
    --templatedescription "Hostname Override Template Schema V1" \
    --jsonschema \
    --filepath "./appconfig/device-hostname.json"

## App Version

# Delete app version if it exists
./iectl publisher standalone-app version delete -a "$APP_NAME" -v "$APP_VERSION" || true

# Build nginx arg string
nginxArg=$(jq -c 'map_values(map(.headers |= tojson))' nginx.json)

# Create version
./iectl publisher sa version create -a "$APP_NAME" -v "$APP_VERSION" \
    -y "$COMPOSE_FILE" \
    -n "${nginxArg}" \
    -t "FromBoxReverseProxy" -s "intelligence-hub" -u "intelligence-hub/" \
    -c "Provided by HighByte. Please view the complete release notes and patch history for details on new features, fixes, breaking changes, and security updates at https://www.highbyte.com/resources/release-notes/version-4-4"

# Export version
./iectl publisher standalone-app version export \
    --appname "$APP_NAME" \
    --exportpath ./exports \
    --versionnumber "$APP_VERSION"
