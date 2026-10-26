### launch an ha environment

```
git clone --filter=blob:none --sparse https://github.com/taibytedx/utilities.git
cd utilities
git sparse-checkout set ha                                                                            
git checkout main    

docker compose up -d
```

#### Simulate highbytePrimary losing its postgres connection

`highbytePrimary` connects to postgres through `toxiproxy`, so its DB link can be cut without touching Docker networking and without affecting the secondaries or postgres itself.

```
# cut the connection
curl -X POST http://localhost:48474/proxies/postgres-primary -d '{"enabled": false}'

# restore the connection
curl -X POST http://localhost:48474/proxies/postgres-primary -d '{"enabled": true}'

# check current state
curl http://localhost:48474/proxies/postgres-primary
```

#### Monitor each node with lgtm

localhost:3500

Drilldown > Logs

<img width="1826" height="1072" alt="image" src="https://github.com/user-attachments/assets/b6cedc45-b602-45c8-971c-fee984dbeac6" />
