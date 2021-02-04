# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Setup
```js
// File named "data" must be created prior to running. It will be more spacious in the main file

const Wasteful = require('wastefuldb');
const db = new Wasteful(true); // Boolean set to true to receive feedback from functions such as .insert(); Default: false
```

### Features
```js
/*
  db.insert();
  
  db.find();
  
  db.search();
  
  db.update();
  
  db.searchUpdate();
  
  db.delete();
*/

db.insert({id: "Xv5312", name: "Seth R.", dob: "3/20/**"}); // ALWAYS include {id: "String/Number"} as the files are orgainzed by identifiers

db.find({id: "Xv5312"}, (res) => {
  console.log(`${res.name}\n${res.id}\n`)
});

db.search("Xv5312", async(result) => {
  console.log(await result);
})

db.update({id: "Xv5312", element: "age", change: -1, math: true});

db.searchUpdate({id: "Xv5312", element: "name", change: "Miles"});

db.delete({id: "Xv5312});
```

### In Depth
```js
db.insert({id: "Jk53c", name: "Richard", age: 53});
```
* id - The name of the file and what will be used in the .find() function

___

```js
db.find({id: "Jk53c"}, (res) => {  console.log(res) });
```
* id - The name/identifier of the file to look for which is set when using the .insert() function

___

```js
db.search({id: "Richard"}, async(res) => { console.log(await res) });
```
* id - Searches through every file to find the matching ID rather than via filename

___

```js
db.update({id: "Jk53c", element: "id", change: "Richard"});
```
* id - The name of the file to update
* element - What element of the file you want to update
* change - What change you want to make to it

___

```js
db.searchUpdate({id: "Richard", element: "id", change: "Jk53c"});
```
* id - Searches for the file similarly to db.search();
* element - What element of the file you want to update
* change - What change you want to make to it
