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
```javascript
import snappy from 'react-snappy';

snappy.check(<YourComponent/>);
```

### save
```javascript
snappy.save(<YourComponent/>);
```
