# json-config
control json configuration file

## Installation
npm install @sub0709/json-config

## API

### load
```javascript
const Configure = require('@sub0709/json-config');
let conf = Configure.load('test-setting.json');
```

test-setting.json sample
```json
{
  "dbInfo": {
    "db": {
      "host": "localhost",
      "port": 3781,
      "dbName": "testapp"
    },
    "option": {
      "order": "asc",
      "count": 1
    }
  }
}
```

#### load option
<pre>
forceSet : true/false (default false)
ignoreDataType : true/false (default false)
immediateFileSave : true/false (default false)
</pre>

This is same `let conf = Configure.load('test-setting.json');`

```javascript
let conf = Configure.load('test-setting.json', {
  forceSet : false,  
  ignoreDataType : false,
  immediateFileSave : false
});
```

### get
```javascript
console.log(conf.get('dbInfo.db.host'));  // localhost
console.log(conf.dbInfo.db.host);  // localhost
```

### set
```javascript
conf.set('dbInfo.db.host', 'local.app.com');
console.log(conf.dbInfo.db.host);  // local.app.com

conf.set('dbInfo.db.abc', false);  // Error: abc is not exist
```

if forceSet is true
```javascript
conf.set('dbInfo.db.abc', false);  // ok, dbInfo.db.abc maked
console.log(conf.dbInfo.db.abc);  // false
```

Data type of json value have to same.
```javascript
conf.set('dbInfo.db.dbName', 999);  // Error: data type is different
```

if ignoreDataType is true
```javascript
conf.set('dbInfo.db.dbName', 999);  // ok, dbInfo.db.dbName value changed to number
console.log(conf.dbInfo.db.dbName);  // 999
```

### save
all json value save to file.
```javascript
conf.save();
```

If immediateFileSave is true, save() don't need. When called set(), immediate save to file.

### store
store() is overwrite json value.
```javascript
conf.store({aaa : 1});
console.log(conf.aaa);  // 1
console.log(conf.dbInfo);  // error, dbInfo is not exist
```