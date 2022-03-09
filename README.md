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
  - [Update via Element Content](#update-by-element-content)
  - [Update via Child Element](#update-child-element)
  - [Collect Documents](#collectid-element-value)

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

## .update() (by identifier)
#### Update a specific element within the specified file. If the element within the file doesn't exist, the function will automatically add the element as well as what was going to be changed. Not recommended when serialization is enabled.
```js
db.update({id: "1234", element: "id", change: "4321", math: false});
```
* id - The name/id of the file to update
* element - What element of the file you want to update
* change - What change you want to make to it
* math? - Does the change require (simple) math?

___

## .update() (by element content)
#### Searches through every file within the directory, attempting to match the element 'name' and it's 'content'. When found, updates the specified element within the file. Recommended when serialization is enabled.
```js
db.update({element: "age", change: 1, math: true}, {name: "animal", content: "fox"});
```
* name - The name of an element within a file to check.
* content - The contents to be matched with the contents of the given element.

___


## .update() (child element)
#### Update the value of an element's "child" or sub-value of the given element. "Child" is referred to as a nested collection element/value within your file.
```js
db.update({element: "name", child: "first", change: "Mike", math: false}, {name: "animal", content: "fox"});
```
* element - The parent element within a file which houses the child element (i.e nested collection).
* child - The child of the provided 'element' to be changed.

___


## .collect({id?, element?, value?})
#### Reads, parses, then pushes information from each JSON file into one collection. Provide an id or element & value to filter results.
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
