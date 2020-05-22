# opswatcher
helper for watching ops log in mongoDB for changes in a collection

# usage 

## Typescript

``` js
import Watcher from 'opswatcher';
const uri = 'mongodb+srv://username:password@host/database';
const watcher = new Watcher(uri);
watcher.connect().then(() => {
    // get an event emitter for test collection
    const test = watcher.addWatcher('test');
    test.on('data', (doc) => {
        console.log('test watcher', doc);
    });
    watcher.watch();
});
```

## nodeJS
```js
const Watcher = require('opswatcher').default;
const uri = 'mongodb+srv://username:password@host/database';
const watcher = new Watcher(uri);
watcher.connect().then(() => {
    // get an event emitter for test collection
    const test = watcher.addWatcher('test');
    test.on('data', (doc) => {
        console.log('test watcher', doc);
    });
    watcher.watch();
});
```

If you wish to start watching from an earler date you can pass a date into the constructer

```js 
const watcher = new Watcher(uri, new Date('2020-04-08 11:33:48'));
```
