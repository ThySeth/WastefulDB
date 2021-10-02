# WastefulDB
A little custom made, document-oriented database project made with JavaScript and JSON for convenience.


### Setup
```js
const Wasteful = require('wastefuldb');
const db = new Wasteful({feedback: true, path: `${__dirname}/data/`, serial: true});
```

### Functions
```js
/*
  db.insert();
    
  db.find();
  
  db.get();

  db.delete();
  
  db.update();

  db.collect();

  db.size();

  db.check();
    
*/

db.insert({id: "1234", name: "seth", pass: "xyz"}); // An "id" variable is required in every insertion.

db.find({id: "1234"}); // Functions with or without an object for the identifier.

db.get("1234", (result) => {
    console.log(result);
})

db.update({id: "1234", element: "pass", change: "abc"});

db.collect();

db.size();

db.check("1234");
db.check({id: "1234"});

db.delete({id: "1234"});
db.delete("1234");
```

## WastefulDB Interface
A newly developed form of interacting with your data stored via WastefulDB; A command-line interface which could be used for quick changes or personal usage without the hastle of typing a whole new set of code.

The interface file can be found within the "`wastefuldb`" folder likely located in your `node_modules` folder and is named "**WastefulDB Interface**"! (A shortcut to "wastefulbat" for design reasons.)

When launching the interface, you simple press a number listed in the options menu, press enter, and provide the information needed to execute an action!

___

### In Depth
```js
new Wasteful({feedback: true, path: `${__dirname}/info/`});
```
* feedback - Sends a confirmation via console when a function is executed successfully. (__default__: false)
* path - Provide a custom path where you wish JSON files to be written/read. (__default__: .../wastefuldb/data/)
* serial - Automatically assigns filenames/identifiers based on the size of the set path. (__default__: false)

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

## .collect({id?, element?})
#### Reads, parses, then pushes information from each JSON file into one collection. Provide an id and/or element to further filter through each file.
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
