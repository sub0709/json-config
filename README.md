# json-config
control json configuration file

## Installation
npm install @sub0709/json-config

## API

### load
```javascript
const Configure = require('@sub0709/json-config');
Configure.load('test-setting.json');
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
forceSet : true/false (default false)
ignoreDataType : true/false (default false)
immediateFileSave : true/false (default false)

This is same `Configure.load('test-setting.json');`

```javascript
Configure.load('test-setting.json', {
  forceSet : false,  
  ignoreDataType : false,
  immediateFileSave : false
});
```



### get
```javascript
console.log(Configure.get('dbInfo.db.host'));  // localhost
console.log(Configure.dbInfo.db.host);  // localhost
```

## set
```javascript
Configure.set('dbInfo.db.host', 'local.app.com');
console.log(Configure.dbInfo.db.host);  // local.app.com

Configure.set('dbInfo.db.abc', false);  // Error: abc is not exist
```

if forceSet is true
```javascript
Configure.set('dbInfo.db.abc', false);  // ok, dbInfo.db.abc maked
console.log(Configure.dbInfo.db.abc);  // false
```

Data type of json value have to same.
```javascript
Configure.set('dbInfo.db.dbName', 999);  // Error: data type is different
```

if ignoreDataType is true
```javascript
Configure.set('dbInfo.db.dbName', 999);  // ok, dbInfo.db.dbName value changed to number
console.log(Configure.dbInfo.db.dbName);  // 999
```

## save
all json value save to file.
```javascript
Configure.save();
```

If immediateFileSave is true, save() don't need. When called set(), immediate save to file.

## store
store() is overwrite json value.
```javascript
Configure.store({aaa : 1});
console.log(Configure.aaa);  // 1
console.log(Configure.dbInfo);  // error, dbInfo is not exist
```