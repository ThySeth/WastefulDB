# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Setup
```js
// File named "data" must be created prior to running. It will be more spacious in the main file

const Wasteful = require('wastefuldb');
const db = new Wasteful({feedback: true, serial: false}); // Boolean set to true to receive feedback from functions such as .insert(); Default: false
```

### Features
```js
/*
  db.insert();
  
  db.insertMult();
  
  db.find();
  
  db.search();
  
  db.update();
    
  db.delete();
*/

db.insert({id: "Xv5312", name: "Seth R.", dob: "3/20/**"}); // ALWAYS include {id: "String/Number"} as the files are orgainzed by identifiers

db.insertMult({id: "BrMc2", name: "Mick"}, {bal: 100, purchases: 0}, {inv: 0});

db.find({id: "Xv5312"}, (res) => {
  console.log(`${res.name}\n${res.id}\n`)
});

db.search("Xv5312", async(result) => {
  console.log(await result);
})

db.update({id: "Xv5312", element: "age", change: -1, math: true});

db.delete({id: "Xv5312"});
```

### In Depth
```js
new Wasteful({feedback: true, serial: false});
```
* feedback - Should a notification be printed to the command prompt when an action is performed?
* serial - Should file identifiers (aka names) be set based on files in directory? (Allows for the exclusion of {id: yadayada})

___

```js
db.insert({id: "Jk53c", name: "Richard", age: 53});
```
* id - The name of the file and what will be used in the .find() function

___

```js
db.insertMult(x, y, z);
```
* x, y, z - Enter more than one collection in one file (`max 3`) with the same format to .insert() (an "id" is required in one of the three collection)

___

```js
db.find({id: "Jk53c"}, (res) => {  
 if(!res) return;
  console.log(res) 
});
```
* id - The name/identifier of the file to look for which is set when using the .insert() function

___

```js
db.search({id: "Richard"}, async(res) => { console.log(await res) });
```
* id - Searches through every file to find the matching ID rather than via filename

___

```js
db.update({id: "Jk53c", element: "id", change: "Richard", math: false});
```
* id - The name of the file to update or its in-file identifier
* element - What element of the file you want to update
* change - What change you want to make to it
* math - Does the change require (simple) math?
