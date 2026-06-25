### launch an ha environment

```
git clone --filter=blob:none --sparse https://github.com/taibytedx/utilities.git
cd utilities
git sparse-checkout set ha                                                                            
git checkout main    

docker compose up -d
```

#### Monitor each node with lgtm

localhost:3500

Drilldown > Logs

<img width="1826" height="1072" alt="image" src="https://github.com/user-attachments/assets/b6cedc45-b602-45c8-971c-fee984dbeac6" />
