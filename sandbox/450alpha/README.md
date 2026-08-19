# 450 release

Local Docker Compose stack for testing a Highbyte Intelligence Hub central node, a remote node, a staging node, and an MQTT node, fronted by a Caddy reverse proxy. Optional Postgres and Grafana/OTel (LGTM) observability services are included behind profiles.

## Getting just this directory

To pull down only `450alpha/` instead of the whole repo, use a cone-mode sparse checkout:

```bash
git clone --no-checkout --filter=blob:none <repo-url> <local-dir>
cd <local-dir>
git sparse-checkout init --cone
git sparse-checkout set utilities/sandbox/450alpha
git checkout <branch>
```

If you already have a sparse checkout of the repo and just want to add this directory to it:

```bash
git sparse-checkout add utilities/sandbox/450alpha
```

## Prerequisites

- Docker and Docker Compose
- Access to the latest Highbyte Intelligence Hub **Alpha** image
- A `.env` file in this directory setting `IMAGE_VERSION` to that image (referenced by [docker-compose.yaml](docker-compose.yaml)):

  ```
  IMAGE_VERSION=<registry>/<image>:<tag>
  ```

## Services

| Service | Purpose | Profile |
|---|---|---|
| `caddy` | Reverse proxy, exposes everything on host port `49995` | default |
| `highbyteCentralNode` | Central Intelligence Hub node | default |
| `highbyteRemote1Node` | Remote node 1 | default |
| `highbyteStagingNode` | Staging node | default |
| `highbyteMqtt` | MQTT-connected node | default |
| `initCentralHub` | Seeds app data volumes from `seedCentral`/`seedRemote` if not already present | `init` |
| `resetCentralHub` | **Force**-reseeds all node app data, overwriting current config | `reset` |
| `postgres` | Optional Postgres database | `optional`, `postgres` |
| `lgtm` | Optional Grafana/OTel observability stack | `optional`, `otel` |

## Quick start

1. First-time setup only — seed the node app-data volumes from `seedCentral`/`seedRemote`:

   ```
   docker compose --profile init up -d initCentralHub
   ```

   This copies:
   - Into the central node: `intelligencehub-configuration.json`, which defines the `sandboxgrp` network group and its link token (`highbyte`), and `intelligencehub-users.json`, which preconfigures the `administrator` and `nibbler` logins.
   - Into each of the remote1, staging, and MQTT nodes: `intelligencehub-remoteconfig.json`, which points the node at the central node's websocket (`ws://highbyteCentralNode:45245/websocket`) using that same token to join `sandboxgrp` for centralized config/data, plus their own copy of `intelligencehub-users.json`.

   Every seeded node ends up with the same `administrator` / `highbyte` or `nibbler` / `highbyte` login, and the shared `highbyte` token is what links the remote/staging/MQTT nodes to the central node.

2. Start the core stack (Caddy + the four Highbyte nodes):

   ```
   docker compose up -d
   ```

3. Open the stack through Caddy at `http://localhost:49995`:

   | Path | Routes to |
   |---|---|
   | `/central/config/` | Central node UI |
   | `/central/mcp*`, `/central/i3x*`, `/central/data*` | Central node API (`:8885`) |
   | `/remote1/config/` | Remote node 1 UI |
   | `/remote1/mcp*`, `/remote1/i3x*`, `/remote1/data*` | Remote node 1 API (`:8885`) |
   | `/staging/config/` | Staging node UI |
   | `/staging/mcp*`, `/staging/i3x*`, `/staging/data*` | Staging node API (`:8885`) |
   | `/hbmqtt/` | MQTT node |
   | `/lgtm/` | Grafana (if started, see below) |

   Log in with `administrator` / `highbyte` (see the seeding details in step 1).

## Routing

Structure of the `:80` site block in [Caddyfile](Caddyfile):

```
:80
├── /central
│   ├── mcp*, i3x*, data*   →  highbyteCentralNode:8885   (prefix stripped)
│   └── /config/*           →  highbyteCentralNode:45245
├── /remote1
│   ├── mcp*, i3x*, data*   →  highbyteRemote1Node:8885   (prefix stripped)
│   └── /config/*           →  highbyteRemote1Node:45245
├── /staging
│   ├── mcp*, i3x*, data*   →  highbyteStagingNode:8885   (prefix stripped)
│   └── /config/*           →  highbyteStagingNode:45245
├── /hbmqtt
│   └── /*                  →  highbyteMqtt:1886  (streaming, no timeout)
└── /lgtm
    └── /*                  →  lgtm:3000
```

The `/central`, `/remote1`, and `/staging` groups all follow the same pattern: an optional `handle @matcher` block for API-style subpaths (`mcp*`, `i3x*`, `data*`) hitting the `:8885` port with the prefix stripped, plus a `redir` from the bare `/config` path to `/config/` and a `handle_path` for everything under `/config/*` to the `:45245` UI port. `hbmqtt` and `lgtm` skip the `:8885` API block and route straight to their single backend.

## Optional services

Start Postgres and/or the LGTM observability stack alongside the core stack:

```
# everything optional at once
docker compose --profile optional up -d

# just Postgres
docker compose --profile postgres up -d postgres

# just LGTM (Grafana/OTel)
docker compose --profile otel up -d lgtm
```

Grafana is reachable at `http://localhost:49995/lgtm/` once `lgtm` is running.

## Resetting node data

`resetCentralHub` force-copies the seed files over each node's app data, **discarding any configuration changes made in the running nodes**:

```
docker compose --profile reset up -d resetCentralHub
```

Only run this if you intend to wipe and reseed all nodes.

## Stopping / cleaning up

```
# stop containers, keep volumes (app data, configs)
docker compose down

# stop and remove volumes too — wipes all node/DB/Caddy state
docker compose down -v
```

## Networks

- `pgnet` — Caddy, Highbyte nodes, Postgres
- `otelnet` — Caddy, Highbyte nodes, LGTM
- `mqttnet` — Caddy, Highbyte nodes, MQTT node
- `hbnet` — Caddy, Highbyte nodes
