# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Quick Setup
```js
const Wasteful = require('wastefuldb');
const db = new Wasteful();
```

### Recommendations:
- `NodeJS v18.14.2 or higher`
- `NPM v9.5.0 or higher`

# Table of Content
- [Constructor](#constructor)
- [Specifying Directories](#specifying-directories)
- [Functions](#functions)
  - [Insert Documents](#insert "db.insert()")
  - [Insert Bulk Documents](#insertbulk "db.insertBulk()")
  - [Find Documents](#find "db.find()")
  - ["Get" Documents](#get "db.get()")
  - [Append Data](#append)
  - [Update a Document](#update "db.update()")
    - [Update a Nested Object](#update-with-child-value)
  - [Update Multiple Objects](#mupdateid-array-of-objects "db.mupdate()")
  - [Update via Key Content (Deprecated/Removed)](https://github.com/ThySeth/WastefulDB/commit/be7b497ecaa72b66e98a6155ff97e0bafea87625)
  - [Collect Documents](#collectid-key-value "db.collect()")
  - [Replicate Documents](#replicateid-to-from-force "db.replicate()")
  - [Overwrite Documents](#setid-data-dir "db.set()")
  - [Undo Updates](#undo "db.undo")




# <ins>Constructor</ins>
```js
new Wasteful({feedback: false, log: false, path: `${__dirname}/info/`, standard: [false], serial: false, kill: false});
```
* feedback - Sends a confirmation via console when a function is executed successfully. (__default__: `false`)
* log - Catalogs every time a function is executed or an error occurs, including the timestamp at which the event occurred. (__default__: `false`)
* path - Provide a custom path where you wish JSON files to be written/read. (__default__: `./wastefuldb/data/`)
* standard - When __standard[0]__ is true, when a document doesn't exist when using `.find()`, a new document will be created with a default value given in __standard[1]__. _WILL NOT_ work when serial is false. (__default__: `false`)
* serial - Automatically assigns filenames/identifiers based on the size of the set path/directory. (__default__: `false`)
* kill - When set to true, the process will be kill when an error occurs in a try/catch statement. (__defualt__: `false`)


# <ins>Specifying Directories</ins>
<b>Every function is capable of interacting with specific directories outside the "path" constructor option when specified within the {dir} option.</b>
```js
db.find({id: "1234"}, {dir: `${__dirname}/patrons/`});

db.insert({id: "5545", name: "Sherry", pass: "BB822", active: false}, {dir: `${__dirname}/accounts/`});
```
* dir - A directory's specific address to search, insert, and update in.


# <ins>Functions</ins>

## .insert()
<b>Insert a file with as many variables as you wish. __Always__ include an "id" variable if serial is set to *false* as that is what is use to read the JSON document in most cases.</b>
```js
db.insert({id: "1234", name: "seth", pass: "xyz"});
```
* id - The name of the file and what will be used in the .find() function


## .insertBulk()
<b>Insert a file with multiple Objects within an Array.</b>
```js
db.insertBulk( [{id: "5545"}, {first: "Sully", last: "V."}, {password: "password"}] );
```


## .find()
<b>Provides the information of the specified file with the matching identifier.</b>
```js
let info = db.find({id: "1234"});
console.log(info);
```
* id - The identifier of the file to find and display the information of.


## .get()
<b>Unlike `db.find`, this function will open each JSON document in the given directory in order to locate the identifier within the document rather than locating the document name.</b>
```js
db.get({id: "4321", dir: `${__dirname}/data/`}, async(res) => { console.log(await res) });
```
* id - The internal identifier of a file.
* dir - A specific directory to search in. (optional)


## .append()
<b>Append a new key and value or append a new child-key and value to an existing key within a document.</b>
```js
db.append({id: "7", key: "bill", child: "career", value: "Mechanical Engineer", position: 1});
db.append({id: "5678", key: "real", value: "true"}, {dir: `${__dirname}/data/`});
```
* id - The identifier of the file to update
* key - The name of the key that will be appended OR the preexisting key to append a child-key to.
* child - The name of the child-key to append to the aforementioned key.
* value - The content of the given key or child-key.
* position - Which object within an array to append to. This is only needed if the document was created using `.insertBulk()`. Defaults to the first object in the array.


## .update()
<b>Searches the given or specified directory for the given ID and updates the given "key" with your "change". Set math to true for __simple__ math. Set the change to "undefined" to delete the specified key. A key which doesn't exist will be added automatically. Not recommended when serialization is enabled.</b>
```js
db.update({id: "1234", key: "id", change: "4321", math: false});
```
* id - The name/id of the file to update
* key - What key of the file you want to update
* change - What change you want to make to it
* math? - Does the change require (simple) math?

___

## .update() (with child value)
<b>Similar to the standard function, declaring a "child" key will update an object within another object aka nested objects. Everything else is the same.</b>
```js
db.update({id: "5", key: "name", child: "last", change: "A."});
```


## .mupdate(id, [Array of Objects])
<b>Update multiple objects within a single document. A good alternative to `.update()` for several changes in a single document.</b>
```js
db.mupdate("5", [ {key: "balance", change: -34, math: true}, {key: "name", child: "middle", change: "A."} ])
```
* id - The identifier of the file to update
* "Array of Objects" - An array containing several, properly formatted objects to update the specified document.


## .collect({id?, key?, value?})
<b>Reads, parses, then pushes information from each JSON file into one collection. Provide an id or key & value to filter results.</b>
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


## .replicate(id, {to?, from?, force?})
<b>Create a copy of a specified document from a given directory and place it within the given destination directory. Only one file can exist in a directory at a time.</b>
```js
db.replicate("1234", {to: __dirname, from: `${__dirname}/data/`);
db.replicate("1234", {force: true});
```
* id - The identifier of the file which is going to be replicated.
* to - What directory to place the replicated file. (__default__: `constructor.path`)
* from - Which directory to find the file which is being replicated. (__default__: `constructor.path`)
* force - Forces the function to replicate the file within the same directory. The file will have a suffix of "\_rep". (__default__: `false`)


## .set(id, {data}, {dir});
<b>Overwrite a document completely, replacing the document data with the new data provided. The previous data is temporarily stored in a cache.</b>
```js
db.set("1234", {name: "Seth R. Richardson", balance: 1000, insured: true}, {dir: __dirname});
```
* id - The identifier of the document to be overwritten.
* data - The new data to be written in the document.
* dir - A directory which contains the document to be updated.


## .undo();
<b>Undo the most recent update to a document. The cache holding the most recent change will be cleared if your program session ends.</b>
```js
db.undo();
```


<div style="text-align: right"> v1.5.8 </div>
