## Setup

`cd /CentralConfig` and then `docker compose up -d` to create the Central Config container
Login to the runtime and enable Central Config in the Settings
Create a Central Config hub network
Copy the network token
Paste the token into the RemoteNodes/intelligencehub-remoteconfig.json file.

`cd /RemoteConfig` and then `docker compose up -d` to create the 2 remote node containers.
