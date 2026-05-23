# HighByte Intelligence Hub — IE App Publisher

Publishes the HighByte Intelligence Hub application to Siemens Industrial Edge using `iectl`.

## Prerequisites

- [iectl](https://docs.eu1.edge.siemens.cloud/apis_and_references/iectl/gettingstarted.html) installed
- Docker Desktop running with TCP enabled on `http://127.0.0.1:2375`
- Publisher workspace initialized (see [Setup](#setup))

## Directory Structure

```
.
├── publish.ps1               # Main publish script
├── compose-442.yml           # Docker Compose for Intelligence Hub
├── nginx.json                # Reverse proxy configuration
├── hbih-icon.png             # App icon
└── app-config/
    ├── accept-eula.json      # EULA acceptance JSON Forms schema
    └── device-url.json       # IE Device URL JSON Forms schema
```

## Setup

Run once to initialize the publisher workspace:

```powershell
.\iectl config add publisher --name dev-workspace --workspace ./workspace --dockerurl http://127.0.0.1:2375
.\iectl publisher workspace init
```

## Usage

Run the publish script to create and export the app:

```powershell
.\publish.ps1
```

This will:
1. Delete the existing app if it exists
2. Create the app with metadata and icon
3. Create a new version with the compose and nginx configuration
4. Add app-config schemas for EULA and IE Device URL
5. Export the app to `./export`

## App Configuration

When installing on an IE Device, the user will be prompted to configure:

| Config | Description |
|---|---|
| End User License Agreement | User must accept the EULA before the app will start |
| IE Device URL | URL of the IE Device hosting Intelligence Hub, e.g. `https://ie-device-001.company.com` |

## Entrypoint Behavior

At container start the entrypoint script:

1. Validates EULA was accepted — exits cleanly if not
2. Reads the IE Device URL from `/appConfig/device-url.json`
3. Strips any trailing `/` from the URL
4. Appends `/intelligence-hub` subpath to construct the full application URL
5. Writes `apiBaseUrl` to `/usr/local/highbyte/configuration/config/settings.json` for the frontend
6. Exports `ACCEPT_EULA` and `HIGHBYTE_BASE_URL` environment variables for the backend
7. Launches the Intelligence Hub runtime

## Reference

```powershell
# List apps
.\iectl publisher sa list

# List app-configs
.\iectl publisher sa app-config l -a "HighByte Intelligence Hub"

# Delete an app-config by ID
.\iectl publisher sa app-config delete -a "HighByte Intelligence Hub" --configid "<configid>"

# List iectl configs
.\iectl config list

# List workspace
.\iectl config workspace list

# Delete app
.\iectl publisher sa delete -a "HighByte Intelligence Hub"
```
