# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Quick Setup
```js
const Wasteful = require('wastefuldb');
const db = new Wasteful();
```

### Recommendations:
- `NodeJS v20.15.1 or higher`
- `NPM v10.7.0 or higher`

<h2><b>Synchronous WastefulDB</b></h2>
<details open>
  <summary><u>Click to Open/Close SyncWastefulDB</u></summary>

# Table of Content
- [Constructor](#constructor)
- [Specifying Directories](#specifying-directories)
- [Functions](#functions)
  - [Insert Documents](#insert "db.insert()")
  - [Insert Bulk Documents](#insertbulkarray-of-objects "db.insertBulk()")
  - [Find Documents](#findid "db.find()")
  - [Find More Documents](#findmoredata)
  - ["Get" Documents](#getid-dir-callback "db.get()")
  - [Append Data](#appendid-key-value-position)
  - [Update a Document](#updateid-key-change-math "db.update()")
    - [Update a Nested Object](#update-with-child-value)
  - [Update Multiple Objects](#mupdateid-array-of-objects "db.mupdate()")
  - [Collect Documents](#collectid-key-value "db.collect()")
  - [Replicate Documents](#replicateid-to-from-force "db.replicate()")
  - [Overwrite Documents](#setid-data-dir "db.set()")
  - [Undo Updates](#undo "db.undo")
- [Update Notes](#update-notes)




# <ins>Constructor</ins>
```js
new Wasteful({feedback: false, log: false, path: `${__dirname}/info/`, serial: false, kill: false});
```
* **feedback** - Sends a confirmation via console when a function is executed successfully. (__default__: `false`)
* **log** - Catalogs every time a function is executed or an error occurs, including the timestamp at which the event occurred. (__default__: `false`)
  - A directory where the log file is stored can be specified by supplying an object with the keys `enable`, a Boolean, and `dir`, a string containing your directory path. (__example__: `{enable: true, dir: "./data/"}`)
* **path** - Provide a custom path where you wish JSON files to be written/read. (__default__: `./wastefuldb/data/`)
* **serial** - Automatically assigns filenames/identifiers based on the size of the set path/directory. (__default__: `false`)
* **kill** - When set to true, the process will be kill when an error occurs in a try/catch statement. (__defualt__: `false`)


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


## .insertBulk([Array of Objects])
<b>Insert a file with multiple Objects within an Array.</b>
```js
db.insertBulk( [{id: "5545"}, {first: "Sully", last: "V."}, {password: "password"}] );
```


## .find(id)
<b>Provides the information of the specified file with the matching identifier.</b>
```js
let info = db.find({id: "1234"});
console.log(info);
```
* id - The identifier of the file to find and display the information of.


## .findMore([data])
<b>Retrieves and parses multiple documents and returns them in an array. If a document isn't found, `-1` will take its place.</b>
```js
db.findMore(["1234", "2", "5678"], {dir: `${__dirname}/data/`});
```
* data - An array of document identifiers to search for.


## .get(id, dir?, (callback))
<b>Unlike `db.find`, this function will open each JSON document in the given directory in order to locate the identifier within the document rather than locating the document name.</b>
```js
db.get("1234", {dir: "./data/"}, (result) => { console.log(result); });

db.get({id: 5}, (result) => { console.log(result); });
```
* id - The internal identifier of a file.
* dir? - A specific directory to search in.
* (callback) - The callback argument which will return the data contained within the given document, or returns `-1` if the document isn't found.


## .append({id, key, value, position?})
<b>Append a new key and value to a document's data. If the document's data is an array of objects, provide a 'position' argument to pick which object to append to.</b>
```js
db.append({id: "2", key: "food", value: "leaves"});
db.append({id: "5", key: "person", value: "true", position: 0});
```
* id - The identifier of the file to append to.
* key - The name of the new key to append to an object.
* value - The content of the given key.
* position - Which object in an array of objects should the new key be appended to? (Defaults to the first object.)


## .update({id, key, change, math?})
<b>Searches the given or specified directory for the given ID and updates the given "key" with your "change". Set math to true for __simple__ math. Set the change to "undefined" to delete the specified key. A key which doesn't exist will be added automatically. Not recommended when serialization is enabled.</b>
```js
db.update({id: "1234", key: "id", change: "4321", math: false});
```
* id - The name/id of the file to update
* key - What key of the file you want to update
* change - What change you want to make to it
* math? - Does the change require (simple) math?


## .update() (with child value)
<b>Declaring a "child" key will update an object within another object aka nested objects. Everything else is the same.</b>
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


# <ins>Update Notes</ins>
- Fixed some of the the items in the table of contents not jumping to the right points
- Updated the recommended NodeJS and NPM versions to the latest LTS. (I forgot to do this in the past)
</details>

<h2><b>Asynchronous WastefulDB</b></h2>
<details open>
  <summary><u>Click to Open/Close AsyncWastefulDB</u></summary>

# Table of Content
- [Constructor](#)



# <u>Constructor</u>
```js
new AsyncWastefulDB({path: "./syncData/", feedback: true, parse: true, kill: false});
```
- <b>path</b> - Specifies the target directory to read and write to. (default: `./syncData/`)
- <b>feedback</b> - Sends a confirmation message to `stdout` each time a function is executed successfully. (default: `true`)
- <b>parse</b> - Dictates whether or not results returned from functions are parsed or kept as buffers. (default: `true`)
- <b>kill</b> - Prevents or allows any errors to terminate the ongoing process when an error occurs. (default: `false`)
  - Functions that involve opening and declaring filehandles will attempt to close before the process ends if *kill* is set to `true`

</details>

<div style="text-align: right"> v1.6.3 </div>
