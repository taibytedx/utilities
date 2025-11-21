### the bundle.js is the output of the following commands

npm install esbuild
npm install sparkplug-payload
npx esbuild main.js --bundle --platform=node --outfile=bundle.js

<img width="819" height="167" alt="image" src="https://github.com/user-attachments/assets/17cfd883-2ebc-4d2c-b7a0-4acf5d154c91" />

### paste the bundle.js contents to Functions
<img width="1305" height="672" alt="image" src="https://github.com/user-attachments/assets/5782b468-e08b-435b-9290-0cb770e63059" />


### example Pipeline Transform
```js
const bytes = event.value;
const sparkplug = require_sparkplug_payload().get("spBv1.0");
const uintarray = bytes.map((obj, index) => obj >>> 0);
const decoded = sparkplug.decodePayload(uintarray);
stage.setValue(decoded);
```

### Replay example
<img width="1691" height="928" alt="image" src="https://github.com/user-attachments/assets/a883cbab-8802-4bc0-801b-379406fab4f8" />
