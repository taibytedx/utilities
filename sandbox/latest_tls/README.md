# 450 release

Local Docker Compose stack for testing a Highbyte Intelligence Hub central node, a remote node, a staging node, and an MQTT node, fronted by a Caddy reverse proxy. Optional Postgres and Grafana/OTel (LGTM) observability services are included behind profiles.

## Getting just this directory

To pull down only `450/` instead of the whole repo, use a cone-mode sparse checkout:

```bash
git clone --no-checkout --filter=blob:none https://github.com/taibytedx/utilities.git
cd utilities
git sparse-checkout init --cone
git sparse-checkout set sandbox/450
git checkout main
```

If you already have a sparse checkout of the repo and just want to add this directory to it:

```bash
git sparse-checkout add utilities/sandbox/450
```

## Prerequisites

- Docker and Docker Compose
- Access to the latest Highbyte Intelligence Hub **Alpha** image
- A `.env` file in this directory setting `IMAGE_VERSION` to that image (referenced by [compose.yml](compose.yml)):

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
| `nodeRedIfixA` | Node-RED simulating iFIX Enhanced Failover node A (primary) | `failover` |
| `nodeRedIfixB` | Node-RED simulating iFIX Enhanced Failover node B (secondary) | `failover` |

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

## Simulating iFIX Enhanced Failover (OPC-UA)

`nodeRedIfixA` and `nodeRedIfixB` stand in for a redundant pair of iFIX Enhanced Failover nodes, so you can test how a Highbyte OPC-UA connection behaves across a failover without needing real iFIX servers. Bring them up with:

```
docker compose --profile failover up -d
```

Each container is a Node-RED instance whose `package.json` (in `nodeRedIfixA/` / `nodeRedIfixB/`) declares `node-red-contrib-opcua` and `node-red-dashboard` as dependencies, and whose `flows.json` already contains a working OPC UA server flow (built and verified against a real OPC UA client read, not hand-guessed) — no editor setup needed. On first boot Node-RED still has to `npm install` those two packages into the bind-mounted `/data` before the flow can run; check `docker compose logs -f nodeRedIfixA` and wait for `Started flows` (a cold start, including the npm install, can take a minute or so; a plain restart without a fresh install is faster but still takes tens of seconds while Node-RED rescans the palette).

Editor/API port `1880` is already mapped to the host (`1881` for A, `1882` for B); the OPC-UA port (`53530` in both containers) is left internal-only by default — reachable from other containers on `hbnet` (e.g. `opc.tcp://nodeRedIfixA:53530/` — trailing slash required, see note below — from a Highbyte node) — with a commented `ports` line in `compose.yml` if you want to reach it directly from the host too (e.g. with UAExpert).

> **Endpoint URL must include the trailing slash** (`opc.tcp://nodeRedIfixA:53530/`, not `...53530`). The server node advertises its resource path as `/`, so a strict client doing endpoint discovery (which includes Highbyte, and node-opcua-based clients generally) will reject a connection to the URL without the trailing slash with "End point must exist," even though the two look identical otherwise. Also note each container's `hostname:` in `compose.yml` is set to match its Docker Compose service name exactly (`nodeRedIfixA` / `nodeRedIfixB`) — the OPC UA server advertises its endpoint using the container's OS hostname, so if that ever drifts from the service name other containers use to reach it, connections will fail the same way for a different reason (wrong host in the advertised endpoint list, not just a missing slash).

Each node exposes three OPC UA variables under `ns=1`:
- `SAC` (Int32) — a station-alive counter, incremented once per second regardless of active/standby state (proves the node itself is alive)
- `Active` (Boolean) — whether this node currently considers itself primary
- `ProcessValue` (Double) — a simulated live value (a sine wave) that **only updates while `Active` is true** — on the standby node it just holds its last value, mirroring how a real standby iFIX node's data goes stale

Node A starts `Active = true` (primary) and Node B starts `Active = false` (standby). There are two ways to flip which one is active:

**From the flow editor** (`http://localhost:1881` for A, `1882` for B) — each flow has a single inject node near the bottom of the canvas, **"Button: Toggle Active"**. Click the square button on its left edge to flip that node's `Active` flag (both in Node-RED's flow context and on the live OPC UA variable); the node's status text underneath shows the current state (`ACTIVE` in green / `standby` in grey) so you can see the result without checking the OPC UA value separately.

**Via HTTP**, if you'd rather script it:

```
# read current state
curl http://localhost:1881/active
curl http://localhost:1882/active
# {"node":"A","active":true,"sac":94}

# flip a node's active flag
curl -X POST http://localhost:1881/active -H "Content-Type: application/json" -d "{\"active\":false}"
curl -X POST http://localhost:1882/active -H "Content-Type: application/json" -d "{\"active\":true}"
```

To test a scenario: connect Highbyte to both `opc.tcp://nodeRedIfixA:53530/` and `opc.tcp://nodeRedIfixB:53530/` (trailing slash required — see note below), subscribe to `SAC`/`Active`/`ProcessValue` on each, and drive logic off whichever side reports `Active = true`. Use the buttons (or HTTP calls) above for a graceful handover (verified: the newly-active node's `ProcessValue` resumes moving, the one you just switched off freezes at its last value while `SAC` on both keeps incrementing), or `docker compose stop nodeRedIfixA` while it's still marked active to simulate a hard failure instead of a graceful one.

Since the two nodes' `Active` flags are independent state with no mutual-exclusion enforced, it's possible to end up with both — or neither — marked active (e.g. after restarting one node, since its flag resets to its hardcoded default while the other keeps whatever you last set it to). That's a legitimate edge case worth testing too (a real iFIX Enhanced Failover split-brain), but if you just want a clean single-primary state, check both with the HTTP `GET` above and use whichever button/`POST` call gets you back to exactly one `Active = true`.

Each node's `Active` default (and the `SAC`/flow-context state) resets on every full flow redeploy or container restart — a node coming back up always resumes its designated role (A primary, B secondary) rather than remembering whatever you'd toggled it to mid-test.

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
