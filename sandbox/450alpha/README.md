# 450alpha

Local Docker Compose stack for testing a Highbyte Intelligence Hub central node, two remote nodes, and an MQTT node, fronted by a Caddy reverse proxy. Optional Postgres and Grafana/OTel (LGTM) observability services are included behind profiles.

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
| `highbyteRemoteNode1` | Remote node 1 | default |
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

   See [Caddyfile.diagram.md](Caddyfile.diagram.md) for the full routing breakdown.

   Log in with the `administrator` user preconfigured in `seedCentral/intelligencehub-users.json` / `seedRemote/intelligencehub-users.json` — default password `highbyte`.

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
