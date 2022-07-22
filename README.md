# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Setup
```js
const Wasteful = require('wastefuldb');
const db = new Wasteful({feedback: false, path: `${__dirname}/data/`, serial: false, kill: false});
```

### Overall Requirements:
- `NodeJS v16.15.0 or higher`
- `NPM v8.5.5 or higher`

### Table of Content
- [Setup](#setup)
- [Requirements](#overall-requirements)
- [To-Do List (GitHub)](https://github.com/ThySeth/WastefulDB/blob/main/TODO.md)
- [In Depth](#in-depth)
  - [Specify Directories](#specify-directories)
  - [Insert Documents](#insert "db.insert()")
  - [Insert Bulk Documents](#insertbulk "db.insertBulk()")
  - [Find Documents](#find "db.find()")
  - ["Get" Documents](#get "db.get()")
  - [Update a Document](#update "db.update()")
    - [Update a Nested Object](#update-with-child-value)
  - [Update Multiple Objects](#mupdateid-array-of-objects "db.mupdate()")
  - [Update via Key Content (Deprecated/Removed)](https://github.com/ThySeth/WastefulDB/commit/be7b497ecaa72b66e98a6155ff97e0bafea87625)
  - [Collect Documents](#collectid-key-value "db.collect()")
  - [Replicate Documents](#replicateid-to-from-force "db.replicate()")
  - [Overwrite Documents](#setid-data-dir "db.set()")
  - [Undo Updates](#undo "db.undo")

___

### In Depth
```js
new Wasteful({feedback: true, path: `${__dirname}/info/`, serial: false, kill: false});
```
* feedback - Sends a confirmation via console when a function is executed successfully. (__default__: `false`)
* path - Provide a custom path where you wish JSON files to be written/read. (__default__: `./wastefuldb/data/`)
* serial - Automatically assigns filenames/identifiers based on the size of the set path. (__default__: `false`)
* kill - When set to true, the process will be kill when an error occurs in a try/catch statement. (__defualt__: `false`)

___

## Specify Directories
#### Every function is capable of interacting with specific directories outside the "path" constructor option when specified within the {dir} option.
```js
db.find({id: "1234"}, {dir: `${__dirname}/patrons/`});

db.insert({id: "5545", name: "Sherry", pass: "BB822", active: false}, {dir: `${__dirname}/accounts/`});
```
* dir - A directory's specific address to search, insert, and update in.

___

## .insert()
#### Insert a file with as many variables as you wish. __Always__ include an "id" variable if serial is set to *false* as that is what is use to read the JSON document in most cases.
```js
db.insert({id: "1234", name: "seth", pass: "xyz"});
```
* id - The name of the file and what will be used in the .find() function

___

## .insertBulk()
#### Insert a file with multiple Objects within an Array.
```js
db.insertBulk( [{id: "5545"}, {first: "Sully", last: "V."}, {password: "password"}] );
```

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
db.get({id: "4321", dir: `${__dirname}/data/`}, async(res) => { console.log(await res) });
```
* id - The internal identifier of a file.
* dir - A specific directory to search in. (optional)

___

## .update()
#### Searches the given or specified directory for the given ID and updates the given "key" with your "change". Set math to true for __simple__ math. Set the change to "undefined" to delete the specified key. A key which doesn't exist will be added automatically. Not recommended when serialization is enabled.
```js
db.update({id: "1234", key: "id", change: "4321", math: false});
```
* id - The name/id of the file to update
* key - What key of the file you want to update
* change - What change you want to make to it
* math? - Does the change require (simple) math?

___

## .update() (with child value)
#### Similar to the standard function, declaring a "child" key will update an object within another object aka nested objects. Everything else is the same.
```js
db.update({id: "5", key: "name", child: "last", change: "A."});
```

___

## .mupdate(id, [Array of Objects])
#### Update multiple objects within a single document. A good alternative to `.update()` for several changes in a single document.
```js
db.update("5", [ {key: "balance", change: -34, math: true}, {key: "name", child: "middle", change: "A."} ])
```
* id - The identifier of the file to update
* "Array of Objects" - An array containing several, properly formatted objects to update the specified document.
___

## .collect({id?, key?, value?})
#### Reads, parses, then pushes information from each JSON file into one collection. Provide an id or key & value to filter results.
```js
let data = db.collect();
data.forEach(info => {
  if(info.active == true) {
    console.log(info);
  } else {
    return;
  }
})
```

___

## .replicate(id, {to?, from?, force?})
#### Create a copy of a specified document from a given directory and place it within the given destination directory. Only one file can exist in a directory at a time.
```js
db.replicate("1234", {to: __dirname, from: `${__dirname}/data/`);
db.replicate("1234", {force: true});
```
* id - The identifier of the file which is going to be replicated.
* to - What directory to place the replicated file. (__default__: `constructor.path`)
* from - Which directory to find the file which is being replicated. (__default__: `constructor.path`)
* force - Forces the function to replicate the file within the same directory. The file will have a suffix of "\_rep". (__default__: `false`)

___

## .set(id, {data}, {dir});
#### Overwrite a document completely, replacing the document data with the new data provided. The previous data is temporarily stored in a cache.
```js
db.set("1234", {name: "Seth R. Richardson", balance: 1000, insured: true}, {dir: __dirname});
```
* id - The identifier of the document to be overwritten.
* data - The new data to be written in the document.
* dir - A directory which contains the document to be updated.

___

## .undo();
#### Undo the most recent update to a document. The cache holding the most recent change will be cleared if your program session ends.
```js
db.undo();
```
