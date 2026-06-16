# HighByte Intelligence Hub — IE App Publisher

Publishes the HighByte Intelligence Hub application to Siemens Industrial Edge using `iectl`.

## Prerequisites

- [iectl](https://docs.eu1.edge.siemens.cloud/apis_and_references/iectl/gettingstarted.html) installed
  - install to root directory, or add to path
- Docker Desktop running with TCP enabled on `http://127.0.0.1:2375`
- Linux bash environment
- `jq` installed for parsing JSON output from iectl commands (`sudo apt-get install jq`)
- Publisher workspace initialized (see [Setup](#setup))
- Access to IE Management for importing apps and deploying to devices
- Copy of the existing app pasted into /imports

## Directory Structure

```
.
├── scripts
│   ├── publish-linux.sh      # Main publish script
│   └── publish-windows.ps1   # Main publish script
├── compose-442.yml           # Docker Compose for Intelligence Hub
├── nginx.json                # Reverse proxy configuration
├── hbih-icon.png             # App icon
├── appconfig
│   ├── accept-eula.json      # EULA acceptance JSON Forms schema
│   └── device-hostname.json  # IE Device hostname JSON Forms schema
├── imports                   # Source .app file for import
└── exports                   # Exported .app file after publish
```

## Setup

### Docker TCP on WSL2

Docker Desktop only binds to `127.0.0.1:2375`, which is not reachable from WSL2. Set up a port proxy in PowerShell as Administrator:

```powershell
netsh interface portproxy add v4tov4 listenaddress=<WSL2-gateway-ip> listenport=2375 connectaddress=127.0.0.1 connectport=2375
```

To find your WSL2 gateway IP:

```bash
ip route | grep default | awk '{print $3}'
```

Then set the Docker host in WSL2:

```bash
export DOCKER_HOST=tcp://<WSL2-gateway-ip>:2375
```

### Publisher Workspace

Run once to initialize the publisher workspace:

```bash
./iectl config add publisher --name dev-workspace --workspace ./dev-workspace --dockerurl http://127.0.0.1:2375
./iectl publisher workspace init
```

[ref workspace init](https://docs.eu1.edge.siemens.cloud/apis_and_references/iectl/V2_0_0/publisher/workspace/init.html)

## App Creation

The app to be imported was created with the following command:

```bash
./iectl publisher standalone-app create \
    --appname "HighByte Intelligence Hub" \
    --reponame "highbyte" \
    --appdescription "Provided by HighByte. HighByte Intelligence Hub is an Industrial DataOps solution purpose-built for manufacturers and industrial enterprises. Deploy the Intelligence Hub at the Edge to securely connect OT devices, files, databases, and IT systems — then collect, model, and stream ready-to-consume datasets to target applications without writing or maintaining code." \
    --iconpath "./icons/HighByte-Favicon-Siemens-1024px.png" \
    --webAddress "https://www.highbyte.com" \
    --appId "Pt9CSWFvpzLhLlhABuLLukTbqzhlWC4b"
```

## Usage

Run the publish script to create and export the app:

```bash
./scripts/publish-linux.sh
```

This will:
1. Import the app if it doesn't already exist
2. Delete existing appconfigs
3. Add appconfig schemas for EULA and hostname override
4. Delete the existing app version if it exists
5. Create the app version
6. Export the app to `./export-final`

## App Configuration

When installing on an IE Device, the user will be prompted to configure:

| Config | Description |
|---|---|
| End User License Agreement | User must accept the EULA before the app will start |
| Hostname Override | Custom hostname or reverse proxy address if the Edge Device IP is not directly accessible |

## Architecture

### Overview

Intelligence Hub requires two configuration inputs from the user at deploy time,
collected via IE's appconfig JSON Forms UI:

1. **EULA acceptance** (`accept-eula.json`)
2. **Hostname override** (`device-hostname.json`)

### Flow

1. User installs app on IE Device via IEM
2. User configures app:
   - Accepts EULA
   - Enters IE Device URL (e.g. `https://ie-device-001.company.com`)
3. IEM writes appconfig files to `/appconfig` volume
4. Container starts, entrypoint script:
   - Validates EULA was accepted, exits cleanly if not
   - Extracts `deviceUrl` from `device-hostname.json`
   - Strips any trailing `/` from the URL
   - Appends `/intelligence-hub` subpath to construct the full application URL
   - Writes complete `apiBaseUrl` to `/usr/local/highbyte/configuration/config/settings.json` for the frontend
   - Exports `HIGHBYTE_BASE_URL` and `ACCEPT_EULA` environment variables for the backend
   - Launches Intelligence Hub runtime

### Design Decision: settings.json Generation

Originally the appconfig was intended to generate `/usr/local/highbyte/configuration/config/settings.json`
directly via the JSON Forms output. However since the entrypoint already parses `device-hostname.json`
to extract the URL for the `HIGHBYTE_BASE_URL` environment variable, we use that opportunity to also
append the fixed `/intelligence-hub` subpath and generate `settings.json` here instead.

This simplifies the user input — they only need to enter the base device URL
(e.g. `https://ie-device-001.company.com`) without needing to know the `/intelligence-hub` subpath.

### Config Files

| File | Source | Purpose |
|---|---|---|
| `/appconfig/accept-eula.json` | User via IEM | EULA acceptance flag |
| `/appconfig/device-hostname.json` | User via IEM | IE Device hostname input |
| `/usr/local/highbyte/configuration/config/settings.json` | Generated by entrypoint | Frontend API base URL config |

### Environment Variables

| Variable | Value | Purpose |
|---|---|---|
| `ACCEPT_EULA` | `Y` | Signals backend EULA was accepted |
| `HIGHBYTE_BASE_URL` | `https://ie-device-001.company.com/intelligence-hub` | Backend API base URL |

## Reference

```bash
# List apps
./iectl publisher sa list

# List appconfigs
./iectl publisher sa app-config l -a "HighByte Intelligence Hub"

# Delete an appconfig by ID
./iectl publisher sa app-config delete -a "HighByte Intelligence Hub" --configid "<configid>"

# List iectl configs
./iectl config list

# List workspace
./iectl config workspace list

# Delete app
./iectl publisher sa delete -a "HighByte Intelligence Hub"
```