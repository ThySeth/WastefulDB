# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Setup
```js
// File named "data" must be created prior to running. It will be more spacious in the main file

const Wasteful = require('./index.js');
const db = new Wasteful();
```

### Features
```js
/*
  db.insert();
  
  db.find();
  
  db.delete();
*/

db.insert({id: "Xv5312", name: "Seth R.", dob: "3/20/**"}); // ALWAYS include {id: "String/Number"} as the files are orgainzed by identifiers

db.find({id: "Xv5312"}, (res) => {
  console.log(`${res.name}\n${res.id}\n`)
});

db.delete({id: "Xv5312});
```
