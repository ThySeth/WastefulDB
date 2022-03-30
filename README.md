# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Setup
```js
const Wasteful = require('wastefuldb');
const db = new Wasteful({feedback: true, path: `${__dirname}/data/`, serial: true});
```

### Overall Requirements:
- `NodeJS v14.17.6 or higher`
- `NPM v6.14.15 or higher`

### Table of Content
- [Setup](#setup)
- [Requirements](#overall-requirements)
- [In Depth](#in-depth)
  - [Specify Directories](#specify-directories)
  - [Insert Documents](#insert)
  - [Find Documents](#find)
  - ["Get" Documents](#get)
  - [Update via IDs](#update-by-identifier)
  - [Update via Key Content](#update-by-key-content)
  - [Update via Child Key](#update-child-key)
  - [Collect Documents](#collectid-key-value)

___

### In Depth
```js
new Wasteful({feedback: true, path: `${__dirname}/info/`, serial: false});
```
* feedback - Sends a confirmation via console when a function is executed successfully. (__default__: false)
* path - Provide a custom path where you wish JSON files to be written/read. (__default__: .../wastefuldb/data/)
* serial - Automatically assigns filenames/identifiers based on the size of the set path. (__default__: false)

___

## Specify Directories
#### Each function is capable of interacting with specific directories outside the "path" constructor option when specified within the {dir} option.
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

## .update() (by identifier)
#### Update a specific key within the specified file. If the key within the file doesn't exist, the function will automatically add the key as well as what was going to be changed. Not recommended when serialization is enabled.
```js
db.update({id: "1234", key: "id", change: "4321", math: false});
```
* id - The name/id of the file to update
* key - What key of the file you want to update
* change - What change you want to make to it
* math? - Does the change require (simple) math?

___

## .update() (by key content)
#### Searches through every file within the directory, attempting to match the key 'name' and it's 'content'. When found, updates the specified key within the file. Recommended when serialization is enabled.
```js
db.update({key: "age", change: 1, math: true}, {name: "animal", content: "fox"});
```
* name - The name of an key within a file to check.
* content - The contents to be matched with the contents of the given key.

___

## .updateMass(id, options)
#### Provide an array of identifiers to search and update all files with the given information. updateMass() supports the "child" option.
```js
db.updateMass(["2", "3", "4"], {key: "age", change: -1, math: true});
```
* [identifiers] - An array of identifiers to find and update the given information.
* key - (aka element) The name of a key within an Object to modify.
* change - The change to make to the key.

___


## .update() (child key)
#### Update the value of a key's "child" or sub-value of the given key. "Child" is referred to as a nested collection key/value within your file.
```js
db.update({key: "name", child: "first", change: "Mike", math: false}, {name: "animal", content: "fox"});
```
* key - The parent key within a file which houses the child key (i.e nested collection).
* child - The child of the provided 'key' to be changed.

___

## .updateMass(id, options)
#### Provide an array of identifiers to search and update all files with the given information. updateMass() supports the "child" option.
```js
db.updateMass(["2", "3", "4"], {key: "age", change: -1, math: true});
```
* [identifiers] - An array of identifiers to find and update the given information.
* key - (aka element) The name of a key within an Object to modify.
* change - The change to make to the key.

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
