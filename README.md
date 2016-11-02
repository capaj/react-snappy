# react-snappy

utility for testing react components against html snapshots

## install
```bash
npm i react-snappy -D
```

## Usage
Enzyme's `mount` is used for rendering under the hood, so you need to have `document` and `window` on global scope:
```javascript
const doc = jsdom.jsdom('<html><head></head><body></body></html>')
const win = doc.defaultView
global.document = doc
global.window = win
```
For ava, you would do this in a separate file that you require by specifying in your `package.json`:
```json
"ava": {
  "require": [
    "babel-register",
    "./test/browser-env.js"
  ],
  "babel": "inherit"
}
```


### check
Compares render output to the snapshot, if not the same prints out a coloured diff and throws an error.
```javascript
import snappy from 'react-snappy';

snappy.check(<YourComponent/>);
```

### save
Saves the html snapshot in the folder `./snapshots` relative to running process current working driectory. You can override this using `setFolder`. Use when you want to add a new component check. Then rewrite to `check`.
Alternatively you can set envromental variable `SNAPPY_SAVE_ALL` to force every check into a save globally. Use with caution.
```javascript
snappy.save(<YourComponent/>);
```

### setFolder
just sets the folder, where snappy will save/look for snapshots. Default value is `snapshots` and it is always relative to the process's current working directory. This is convenient in ava, where each test file has it's own process.
```javascript
snappy.setFolder('./mySpecialSnapshotFolder')
```
