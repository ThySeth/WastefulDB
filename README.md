# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Setup
```js
// Using NodeJS v15.14.0
// Use "npm i wastefuldb@1.1.4" to use the barely functioning multi-field JSON functions

const Wasteful = require('wastefuldb');
const db = new Wasteful({feedback: true}, path?);
```

### Functions
```js
/*
  db.insert();
    
  db.find();
  
  db.get();

  db.delete();
  
  db.update();

  db.size();

  db.check();
    
*/

db.insert({id: "1234", name: "seth", pass: "xyz"}); // An "id" variable is required in every insertion.

db.find({id: "1234"}); // Functions with or without an object for the identifier.

db.get("1234", (result) => {
    console.log(result);
})

db.update({id: "1234", element: "pass", change: "abc"});

db.size();

db.check("1234");
db.check({id: "1234"});

db.delete({id: "1234"});
db.delete("1234");
```

### In Depth
```js
new Wasteful({feedback: true}, path?);
```
* feedback - Sends a confirmation via console when a function is executed successfully. (default: false)
* path - Provide a custom path where you wish JSON files to be written/read. (default: .../wastefuldb/data/)

___

## .insert()
#### Insert a file with as many variables as you wish. __Always__ include an "id" variable as that is what is use to read the JSON document in most cases.
```js
db.insert({id: "1234", name: "seth", pass: "xyz"});
```
* id - The name of the file and what will be used in the .find() function

___

## .find()
#### Provides the information of the specified file with the matching identifier.
```js
let info = db.find({id: "1234"});
console.log(info);
```
* id - The identifier of the file to find and display the information of.

___

## .get()
#### Unlike `db.find`, `db.get` will read each JSON file within the directory and read each identifier within to locate the specified file.
```js
db.get({id: "4321"}, async(res) => { console.log(await res) });
```
* id - The internal identifier of a file.

___

## .update()
#### Update a specific element within the specified file. If the element within the file doesn't exist, the function will automatically add the element as well as what was going to be changed.
```js
db.update({id: "1234", element: "id", change: "4321", math: false});
```
* id - The name/id of the file to update
* element - What element of the file you want to update
* change - What change you want to make to it
* math - Does the change require (simple) math?

___
