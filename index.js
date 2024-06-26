const fs = require('fs');
const { objectMath } = require('./functions/updateMath.js');
const {kill} = require("./functions/errorHandler.js");

let cache = [];

function Logger(data, directory = __dirname) {
  try {
    if(fs.existsSync(`${directory}/logger.txt`)) { // Logger exists
      let fileData = fs.readFileSync(`${directory}/logger.txt`);
      data = `${data}\n \n${fileData}`
      fs.writeFileSync(`${directory}/logger.txt`, data);
    } else { // Logger doesn't exist
      fs.writeFileSync(`${directory}/logger.txt`, data);
    }
  }catch(err) {
    console.error(`An error occurred while logging a process.\n${err}`);
  }
}

function BNS(text) {
  // Boolean & Null Stringification
  switch(text) {
    case "true":
      text = true;
    break;
    case "false":
      text = false;
    break;
    case "null":
      text = null;
    break;
  }
  return text;
}

class WastefulDB {
    /**
     * @constructor
     * @param {Boolean} options.feedback Provides a confirmation message when a function executes successfully. (default: `false`)
     * @param {Boolean} options.log Writes to the file "logger.txt" when a function is executed or an error occurs. Includes a timestamp, name of function, and what occurred. (default: `false`)
     * @param {String} options.path Provide a custom directory to route each JSON file. Ignoring this will default read/write to "`./wastefuldb/data/`"
     * @param {Boolean} options.serial When **true**, you are no longer required to include an id variable to your file data. Instead, the identifier is based on the **directory size** at the time. (default: `false`)
     * @param {Boolean} options.kill When an error occurs and the option is set to **true**, automatically kills the process to prevent further errors. (default: `false`)
     */
    constructor(options = {feedback: false, log: false, path: `${__dirname}/data/`, serial: false, kill: false}) {
        this.feedback = options.feedback || false
        this.log = options.log || false
        this.path = options.path || `${__dirname}/data/`;
        this.serial = options.serial || false
        this.kill = options.kill || false
        this.path = (this.path).charAt((this.path).length-1) == "/" ? this.path : this.path + "/";
    }

    /**
     * Create a JSON file with the given object of data to be modified later.
     * @param {String} data.id A required identifier to name and track the file.
     * @param {String} [directory.dir] A specific directory to route the creation of files.
     * 
     * @example > db.insert({id: "5523", name: "Margot", pass: "HelloWorld!", active: false}, {dir: `${__dirname}/data/`});
     * 
     * @returns {Array} array containing data within document.
     */

     insert(data = {id: undefined}, directory = {dir: this.path}) {
      if(!(data instanceof Object)) return console.error("[.insert] : The data given must be contained within an Object."); // Check if 'data' is an object data type
       if(!data.id && !this.serial) return console.error("[.insert] : A document identifier must be provided before it can be created!"); // Ensures there is an identifier to assign if serialization is false
      try {
        this.serial ? data.id = ((fs.readdirSync(directory.dir)).length).toString() : ""; // Assign an identifier to the document if serialization is true. Ignores/replaces an existing identifier
         let obj = JSON.stringify([data], null, 3); // Format data for writing
          fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
           this.feedback ? console.log("[.insert] : Successfully created 1 document.") : "";
           (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - insert() ] File "${data.id}" was successfully created.`, (this.log).dir) : ""
            return JSON.parse(obj); // Parse the json-ified data, keeping the new format
      } catch(err) {
        kill(this.kill, err.message, ".insert()")
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "insert()"!\n${err.message}`, (this.log).dir) : ""
      }
     }
    
    /**
     * Create a bulk document containing an Array of Objects.
     * @param {String | Object} id The identifier within a file to search for.
     * @param {Array} data An array of Objects containing modifiable data.
     * 
     * @example > db.insertBulk( [{first: "Sal", last: "V."}, {age: 44}, {balance: 102,543}] );
     * 
     * @returns {Array} array containing data within document.
     */

     insertBulk(data = [], directory = {dir: this.path}) {
      if(!(data instanceof Array)) return console.error("[.insertBulk] : The data provided must be Objects contained within an Array."); // If the argument for data isn't an array data type, return error
       if(data.length <= 1) return console.error("[.insertBulk] : The data array must contain more two more more Objects.");
        if(!data.find((value) => (Object.keys(value)).includes("id")) && !this.serial) return console.error("[.insertBulk] : You must provide an \"id\" within an Object."); // Check if an identifier is declared when serialization is false
         if(!data.every((value) => value instanceof Object)) return console.error("[.insertBulk] : Unable to process data. One or more items in the data array is not an Object."); // Check if any items in the data array are not an object data type
      try {
        // (this.serial) ? data.find((value) => (Object.keys(value)).includes("id")).id = ((fs.readdirSync(directory.dir)).length).toString() : "" // Find and set 
        if(this.serial) {
          /*
            Deconstructing the statement below
            1) "data.find((value) => (Object.keys(value)).includes("id")) ?"                                                        --> If the array has an existing "id" variable, use it instead of creating a new one
            2) "data.find((value) => (Object.keys(value)).includes("id")).id = ((fs.readdirSync(directory.dir)).length).toString()" --> Replaces the existing id with the serialized version
            3) ": data[0].id = ((fs.readdirSync(directory.dir)).length).toString();"                                                --> If the array does not have an existing "id" variable, create a new one in the first object of the array
          */
          data.find((value) => (Object.keys(value)).includes("id")) ? data.find((value) => (Object.keys(value)).includes("id")).id = ((fs.readdirSync(directory.dir)).length).toString() : data[0].id = ((fs.readdirSync(directory.dir)).length).toString();
        }
        let id = data.find((value) => (Object.keys(value)).includes("id")).id, obj = JSON.stringify(data, null, 3);
         fs.writeFileSync(`${directory.dir}${id}.json`, obj);
          this.feedback ? console.log("[.insertBulk] : Successfully created 1 document.") : "";
          (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - insertBulk() ] File "${id.id}" was successfully created.`, this.log.dir) : ""
           return JSON.parse(obj);
      } catch(err) {
        kill(this.kill, err.message, ".insertBulk()")
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "insertBulk()"!\n${err.message}`, this.log.dir) : ""
      }
     }

     /**
      * @param {String | Number | Object} data The identifier of the document to find.
      * @param {String} [directory.dir] The directory to search for the document.
      * 
      * @example > db.find({id: 4}, {dir: "./data/"});
      * @example > db.find("1234");
      * 
      * @returns {Object | Array} parsed data within the specified document. 
      */

     find(data, directory = {dir: this.path}) {
      if(!data && !(data instanceof String) && !(data instanceof Object) && !(data instanceof Number)) return console.error("[.find] : You must provide an identifier either as a string, number, or object with key 'id'."); // No ID or ID isn't an object or string, return an error
       try {
        if(!(fs.existsSync(`${directory.dir}${(data.id || data).toString()}.json`))) return console.error("[.find] : Unable to find the document specified. Either the identifier or path provided does not exist.");
         let file = fs.readFileSync(`${directory.dir}${(data.id || data).toString()}.json`);
         file = JSON.parse(file); file = file.length > 1 ? file : file[0]; // Parse document. If the array size is greater than one (insertbulk), remain an array, otherwise turn into a standalone object (.insert)
          this.feedback ? console.log(`[.find] : Successfully found document "${data.id || data}".`) : "";
          (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - find() ] File "${data.id || data}" was successfully found.`, this.log.dir) : ""
           return file;
       } catch(err) {
        kill(this.kill, err.message, ".find()");
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "find()"!\n${err.message}`, this.log.dir) : ""
       }
     }

    /**
     * Retrieves and parses multiple documents and returns them in an array. If a document isn't found, `-1` will take its place.
     * @param {Array} data An array of identifiers to search for.
     * @param {String} [directory.dir] The directory to search for the specified documents in.
     * 
     * @example > db.findMore(["1234", "2", "5678"], {dir: `${__dirname}/data/`});
     * 
     * @returns {Array} array of objects parsed from each document found.
     */
    
    findMore(data, directory = {dir: this.path}) {
      if(!data || !(data instanceof Array) || data.length == 0) return console.error("[.findMore] : You must provide multiple identifiers within an array.");
       if(data.length == 1) return this.find(data[0], {dir: directory.dir}); // Didn't expect this to work at first!
      try {
        let arr = [], obj;
         data.forEach((id) => {
         id = id.toString();
          if(!(fs.existsSync(`${directory.dir}${id}.json`))) return arr.push(-1); // Push -1 if the document is missing
           obj = JSON.parse(fs.readFileSync(`${directory.dir}${id}.json`)); // Parse the document
            arr.push(obj); // Push the object or array
         });
         this.feedback ? console.log(`[.find] : Successfully returned the data for ${data.length} documents.`) : "";
         (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - findMore() ] Execution was successful. Attempted to find files ${data} and returned what was found.`, this.log.dir) : ""
           return arr;
      } catch(err) {
        kill(this.kill, err.message, ".findMore()")
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "findMore()"!\n${err.message}`, this.log.dir) : ""
      }
    }
    
    /**
     * Find and update a specific file within the given or default directory.
     * @param {String} data.id Identifier of the target file to update.
     * @param {String} [data.key] The key **OR** parent of a child-key in an Object.
     * @param {String} [data.child] The child of the specified key.
     * @param {String} data.change Changes to be made to the target key.
     * @param {Boolean} [data.math=false] Whether the change requires **SIMPLE** math or not. (Default: false)
     *
     * @param {String} [directory.dir] Specific directory to search for and update files. 
     *
     * @example > db.update({id: "1234", key: "name", child: "first", change: "Seth", math: false}, {dir: `${__dirname}/data/`});
     * 
     * @returns {Object} document object after updating the data.
     */

    update(data = {id, key, child, change, math: false}, directory = {dir: this.path}) {
      try {
        if(!data.id || !data.key || !data.change) return console.error("[.update] : You must provide the required fields 'id', 'key', and 'change' to update a document.");
        data.id = (data.id).toString();
        data.change = BNS(data.change); // Ensures that boolean and null are converted from string to their own data type
        let file = fs.readFileSync(`${directory.dir}${data.id}.json`); file = JSON.parse(file);
        if(file.length == 1) {  // The document contains a single object. It was created using .insert()
          file = file[0];
          if(!file.hasOwnProperty(data.key)) return console.error("[.update] : Unable to update the document. The given key does not exist!");
          if(data.child && !(file[data.key])[data.child]) return console.error("[.update] : Unable to update the document. The given child key does not exist!");
          if(data.child) {                    // The process involves updating a child key
           if(data.change == "undefined") {   // Specifying "undefined" in a change will delete the object
              delete (file[data.key])[data.child];
           } else {
            if(data.math) {                
              if((objectMath(file, data)) == -1) return console.error("[.update] : The document cannot be updated. The target change, key, or child in the document was returned as NaN.");
              (file[data.key])[data.child] = (file[data.key])[data.child] + (data.change);
            } else {
              (file[data.key])[data.child] = data.change;
            }
           }
          } else {                            // This process involves updating a key
           if(data.change == "undefined") {   // Object deletion
              delete file[data.key];
           } else {
            if(data.math) {
              if((objectMath(file, data)) == -1) return console.error("[.update] : The document cannot be updated. The target change, key, or child in the document was returned as NaN.");
              file[data.key] = file[data.key] + (data.change);
            } else {
              file[data.key] = data.change;
            }
           }
          }
        } else if(file.length > 1) {  // The document is an array of objects. It was created using .insertBulk()
          if(file.findIndex(object => object[data.key]) == -1) return console.error("[.update] : Unable to update the document. The given key does not exist!");  // The specific object in the array doesn't have the key. 
          let finding = file.findIndex(object => (object[data.key])); // Since the key exists, the location must be found 
          if(data.child && !(Object.values(file[finding])[0])[data.child]) return console.error("[.update] : Unable to update the document. The given child key does not exist!"); // Locates the child key. Returns the error when it's not found

        try { // Nesting a try/catch statement. Used to catch the throw statements which cancel forEach loops
          file.forEach(object => {
            if(data.child) { // A child key is specified
             if(!(object[data.key]) || !(object[data.key])[data.child]) return; // The key or child arne't in this object
              if(data.change == "undefined") { // Object deletion
                 delete (object[data.key])[data.child];
              } else {
               if(data.math) {
                 if((objectMath(object, data)) == -1) throw console.error("[.update] : The document cannot be updated. The target change, key, or child in the document was returned as NaN.");
                 (object[data.key])[data.child] = (object[data.key])[data.child] + (data.change); 
               } else {
                 (object[data.key])[data.child] = data.change; 
               }
              }
             } else { // A child key isn't specified
              if(!object[data.key]) return;
               if(data.change == "undefined") {
                 delete object[data.key]; 
               }
               if(data.math) {
                 if((objectMath(object, data)) == -1) throw console.error("[.update] : The document cannot be updated. The target change, key, or child in the document was returned as NaN.");
                 object[data.key] = object[data.key] + (data.change); 
               } else {
                 object[data.key] = data.change; 
               }
             }
          })
         } catch(error) {
          return;
         }
        } 
        file = JSON.stringify(file, null, 3);
        fs.writeFileSync(`${directory.dir}${data.id}.json`, file);

        this.feedback ? console.log("[.update] Successfully updated 1 document.") : "";
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - update() ] File "${data.id}" was successfully updated.`, this.log.dir) : "";
        return JSON.parse(file);
      } catch(err) {
        kill(this.kill, err.message, ".update()")
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing .update!\n${err.message}`, this.log.dir) : ""
      }
    }

  /**
   * @param {Object} id The identifier of the target document.
   * @param {Array} data The array which stores objects to be sent to the target document.
   * 
   * @param {String} directory.dir The target directory of the document.
   * 
   * @example > db.mupdate("1234", [ {key: "name", change: "Nick", math: false}, {key: "pass", change: "Password1234"} ]);
   * 
   * @returns {Object} document object after the data is updated.
   */

  mupdate(id, data = [], directory={dir: this.path}) {
    let obj, foo, bar;
     try {
       // CATCH MISSING ARGUMENTS
        if(!(id instanceof String) && (id instanceof Object && !id.id)) return console.error("[.mupdate] : Unable to locate document due to missing identifier argument."); if(!(data instanceof Array) || data.length <= 1) return console.error("The data provided must be contained within an Array and have more than 1 Object.");
        id = id.id ? id.id : id; // Handle alternative object form for identifiers
        if(fs.existsSync(`${directory.dir}${id}.json`) == false) return console.error("[.mupdate] : Couldn't find any documents with the given identifier.");
        // OPEN DOCUMENT
          obj = fs.readFileSync(`${directory.dir}${id}.json`); obj = JSON.parse(obj);
           // IF OBJ IS GREATER THAN 1 OBJECT <---
            if(obj.length > 1) {
              obj.forEach(item => {
                // RUN THROUGH EACH DATA OBJECT IN EACH OBJECT ITEM <---
                 data.forEach(thing => {
                   if(!(thing instanceof Object)) return;
                    if(!item[thing.key]) return;
                     // FOUND DATA KEY IN OBJECT ITEM <---
                      // IF DATA HAS CHILD
                       if(thing.child) {
                        // IF DATA INVOLVES MATH <---
                         if(thing.math) {
                          if(isNaN((item[thing.key])[thing.child]) || isNaN(thing.change)) return console.error("[.mupdate] : Unable to update the document. The given key or change returned NaN.");
                           (item[thing.key])[thing.child] = (Number((item[thing.key])[thing.child])) + (Number(thing.change));
                            (item[thing.key])[thing.child] = (item[thing.key])[thing.child] % 1 != 0 ? parseFloat(((item[thing.key])[thing.child]).toFixed(2)) : (item[thing.key])[thing.child];
                             // CONTINUE ONWARD
                         } else {
                            // IF NO MATH BUT HAS CHILD <---
                            (item[thing.key])[thing.child] = thing.change == "true" ? true : thing.change == "false" ? false : thing.change;
                             thing.change == "undefined" ? delete (item[thing.key])[thing.child] : "";
                             // CONTINUE ONWARD
                         }
                       } else {
                        // IF DATA HAS NO CHILD <---
                         // IF DATA INVOLVES MATH <---
                         if(thing.math) {
                           if(isNaN(item[thing.key]) || isNaN(thing.change)) return console.error("[.mupdate] : Unable to update the document. The given key or change returned NaN.");
                            item[thing.key] = (Number(item[thing.key])) + (Number(thing.change));
                             item[thing.key] = item[thing.key] % 1 != 0 ? (parseFloat((item[thing.key]).toFixed(2))) : item[thing.key];
                              // CONTINUE ONWARD
                         } else {
                            // IF DATA HAS NO MATH <---
                             item[thing.key] = (thing.change == "true" ? true : thing.change == "false" ? false : data.change);
                              data.change == "undefined" ? delete (item[thing.key]) : "";
                              // CONTINUE ONWARD
                         }
                       }
                 })
              })
               bar = JSON.stringify(obj, null, 3);
                fs.writeFileSync(`${directory.dir}${id}.json`, bar);
                 this.feedback ? console.log("[.mupdate] : Successfully updated 1 bulk document.") : "";
                 (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - mupdate() ] File "${data.id}" was successfully updated.`, this.log.dir) : ""
                 return JSON.parse(bar);
            } else {
                // BASIC SINGLE OBJECT DOCUMENT <---
                 obj = obj[0];
                  data.forEach(item => {
                    if(!obj[item.key]) return;
                     // FOUND KEY IN OBJECT <---
                      // IF DATA HAS CHILD <---
                       if(item.child) {
                         // IF DATA INVOLVES MATH <---
                          if(item.math) {
                            if(isNaN((obj[item.key])[item.child]) || isNaN(item.change)) return console.error("[.mupdate] : Unable to update the document. The given key or change returned NaN.");
                              (obj[item.key])[item.child] = (Number((obj[item.key])[item.child])) + (Number(item.change));
                               (obj[item.key])[item.child] = (obj[item.key])[item.child] % 1 != 0 ? parseFloat(((obj[item.key])[item.child]).toFixed(2)) : (obj[item.key])[item.child];
                                // CONTINUE ONWARD
                          } else {
                            // IF DATA HAS NO MATH <---
                             (obj[item.key])[item.child] = item.change == "true" ? true : item.change == "false" ? false : item.change;
                              item.change == "undefined" ? delete (obj[item.key])[item.child] : "";
                               // CONTINUE ONWARD
                          }
                       } else {
                         // IF DATA HAS NO CHILD <---
                          // IF DATA INVOLVES MATH <---
                           if(item.math) {
                             if(isNaN(obj[item.key]) || isNaN(item.change)) return console.error("[.mupdate] : Unable to update the document. The given key or change returned NaN.");
                              obj[item.key] = (Number(obj[item.key])) + (Number(item.change));
                               obj[item.key] = obj[item.key] % 1 != 0 ? parseFloat((obj[item.key]).toFixed(2)) : obj[item.key];
                                // CONTINUE ONWARD
                           } else {
                            // IF DATA HAS NO MATH <---
                             obj[item.key] = item.change == "true" ? true : item.change == "false" ? false : item.change;
                              item.change == "undefined" ? delete obj[item.key] : "";
                               // CONTINUE ONWARD
                           }
                       }
                  })
                obj = [ obj ];
                 bar = JSON.stringify(obj, null, 3);
                  fs.writeFileSync(`${directory.dir}${id}.json`, bar);
                   this.feedback ? console.log("[.mupdate] : Successfully updated 1 document.") : "";
                   (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - mupdate() ] File "${data.id}" was successfully updated.`, this.log.dir) : ""
                   return JSON.parse(bar);
            }
     } catch(err) {
        kill(this.kill, err.message, ".mupdate()")
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "mupdate()"!\n${err.message}`, this.log.dir) : ""
     }
  }

  /**
   * @param {String} data.id The identifier of the document to modify.
   * @param {String} data.key The name of the key to append.
   * @param {String | Object} data.value The value to assign to the given key.
   * @param {Number} [data.position] Which object in an array is the data appended to? Only used with documents created with `.insertBulk`.
   * 
   * @example > db.append({id: "2", key: "food", value: "leaves"});
   * @example > db.append({id: "5", key: "person", value: "true", position: 0});
   * 
   * @returns {Object | Array} object/array containing new data.
   */

  append(data = {id, key, value, position: 0}, directory = {dir: this.path}) {
    if(!(data instanceof Object)) return console.error("[.append] : The data provided must be contained within an Object.");
     if(!data.id) return console.error("[.append] : You must provide an identifier to the document you want to modify.");
       if(data.position < 0) return console.error("[.append] : The \"position\" argument cannot be less than 0.");
    try {
      if(!(fs.existsSync(`${directory.dir}${data.id}.json`))) return console.error("[.append] : Couldn't find any documents with the given identifier.");
       let file = fs.readFileSync(`${directory.dir}${data.id}.json`);
        file = JSON.parse(file);
         if(file.length == 1) { // Document created using .insert()
          file = file[0];
          file[data.key] = BNS(data.value);
          file = [file];
         } else {
          if(data.position > file.length-1) return console.error("[.append] : Unable to append data to the document. The \"position\" provided is greater than the array's length.");
           (file[data.position])[data.key] = BNS(data.value)
         }
         let obj = JSON.stringify(file, null, 3);
          fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
          this.feedback ? console.log("[.append] : Successfully appended data to 1 document.") : "";
          (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - append() ] File "${data.id}" was appended to successfully.`, this.log.dir) : ""
            return JSON.parse(obj);
    } catch(err) {
       kill(this.kill, err.message, ".append()")
       (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "append()"!\n${err.message}`, this.log.dir) : ""
    }
  }

    /**
     * Collects every document within the given directory. 
     * The data within each document is parsed, compiled, and returned within an Array. 
     * Returns `-1` if the Array is empty.
     * 
     * @param {String} [directory.dir] The directory to collect all the documents from.
     * 
     * 
     * @example > db.collect();
     * @example > db.collect({dir: `${__dirname}/data/`});
     * 
     * @returns {Array} array of all documents in the given directory.
     */

    collect(directory = {dir: this.path}) {
     try {
      let obj = []
      let files = fs.readdirSync(`${directory.dir}`);
      files.forEach(file => {
       file = fs.readFileSync(`${directory.dir}${file}`);
        file = JSON.parse(file); 
        file.length > 1 ? obj.push(file) : obj.push(file[0]);
      });
       this.feedback ? console.log("[.collect] : Successfully collected all documents in the directory.") : "";
       (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - collect() ] Successfully collected documents in the directory "${directory.dir}".`, this.log.dir) : ""
        obj = obj.length == 0 ? -1 : obj;
         return obj;
     } catch(err) {
       kill(this.kill, err.message, ".collect()")
       (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "collect()"!\n${err.message}`, this.log.dir) : ""
     }
    }

    /**
     * @param {String | Number | Object} data The identifier inside of a document to search for.
     * @param {Object | Function} [directory.dir] The directory to search through.
     * @param {Function} callback The callback to return the search results to.
     * 
     * @example > db.get("5", {dir: "./data/"}, (result) => { console.log(result); });
     * @example > db.get({id: "1234"}, (result) => { console.log(result); });
     * 
     * @returns {Object | Array} the data within the document located. Returns `-1` if the document isn't found.
     */

    get(data, directory = {dir: this.path}, callback) {
     try {
      if(!data && !(data instanceof String) && !(data instanceof Number) && !(data instanceof Object)) return console.error("[.get] : You must provide a document identifier in the form of a string, number, or object with the key 'id'.");
      let result, path = this.path;
      if(typeof directory === "function") {
        result = funcNoDir((data.id || data).toString())
        return directory(result)
      } else if(typeof directory === "object" && typeof callback === "function") {
        result = funcNoDir((data.id || data).toString(), {dir: directory.dir});
        return callback(result);
      }
      function funcNoDir(data, directory = {dir: path}) {
        let _directory = (fs.readdirSync(`${directory.dir}`)), file, found = false;
        for(let i = 0; i < (_directory).length-1; i++) {
          if(found) break;
          file = fs.readFileSync(`${directory.dir}${_directory[i]}`);
           file = JSON.parse(file);
            if(file.length > 1) { // If the file is an array of objects
              for(let h = 0; h < file.length; h++) {
                if(file[h].hasOwnProperty("id") && file[h].id == data) {
                  found = true;
                }
              }
            } else {
              file = file[0];
               if(file.id && file.id == data) {
                  found = true;
               }
            }
        }
        if(found) {
          this.feedback ? console.log(`[.get] : Successfully retrieved the document containing the identifier "${data.id || data}".`) : "";
          (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - get() ] Successfully found the document which contains the identifier "${data.id || data}"`, this.log.dir) : ""
          return file;
        } else {
          this.feedback ? console.log(`[.get] : Unable to locate any documents containing the identifier "${data.id || data}".`) : "";
          (((this.log) instanceof Object && this.log.enable == true) || this.log == true) == true ? Logger(`[ ${new Date()} - get() ] Unable to locate any documents containing the identifier "${data.id || data}". It doesn't exist.`, this.log.dir) : ""
          return -1;
        }
      }
     } catch(err) {
      kill(this.kill, err.message, ".get()")
      (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "get()"!\n${err.message}`, this.log.dir) : ""
     }
    }

    /**
     * Check a given or default directory for a document and returns boolean if it exists or not. Intended to save resources when verifying files.
     * 
     * @param {Object | String} data Provide the identifier of a file to view if it currently exists.
     * @param {String} [directory.dir] Specific directory to check for an existing file.
     * 
     * @example > db.check("1234", {dir: `${__dirname}/data/`});
     * 
     * @returns {Boolean} boolean regarding a document's existence.
     */

    check(data, directory = {dir: this.path}) {
      try {
        return fs.existsSync(`${directory.dir}${(data.id || data).toString()}.json`);
      } catch(err) {
        kill(this.kill, err.message, ".check()");
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "check()"!\n${err.message}`, this.log.dir) : ""
      }
    }

    /**
     * Returns the total amount of files in the default or given directory where documents are read/written.
     * @param {String} [directory.dir] Specific directory to retrieve the file count from. Defaults to `./wastefuldb/data/`.
     * 
     * @example > db.size({dir: `${__dirname}/data/`});
     * 
     * @returns {Number} amount of files in the given directory.
     */

    size(directory = {dir: this.path}) {
        try {
            let files = fs.readdirSync(`${directory.dir}`);
             return files.length;
        }catch(err) {
         kill(this.kill, err.message, ".size()");
         (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "size()"!\n${err.message}`, this.log.dir) : ""
        }
    }

    /**
     * Deletes the specified document.
     * @param {Object | String} data Identifier of the file.
     * @param {String} [directory.dir] Specific directory to delete a file from.
     * 
     * @example > db.delete("1234", {dir: `${__dirname}/data/`});
     */

    delete(data, directory = {dir: this.path}) {
        try {
            fs.rmSync(`${directory.dir}${(data.id || data).toString()}.json`);
             this.feedback ? console.log("[.delete] : Successfully deleted 1 document.") : "";
             (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - delete() ] File "${data.id}" was successfully deleted.`, this.log.dir) : ""
        } catch(err) {
          kill(this.kill, err.message, ".delete()");
          (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "delete()"!\n${err.message}`, this.log.dir) : ""
        }
    }


    /**
     * Replicate a specified document and its contents. Does not allow for more than one replication of a document per directory.
     * @param id The file name aka identifier of a document.
     * 
     * @param options.to Where to create the new document.
     * @param options.from Where to search for and replicate the document from.
     * 
     * @example > db.replicate("1234", {to: __dirname, from: `${__dirname}/data/`})
     */
    replicate(id, options = {to: this.path, from: this.path, force: false}) {
      options.to = options.to || this.path;
      options.from = options.from || this.path;
      options.force = options.force || false;
     try {
      if(!id) return console.log("[.replicate] : An identifier of a file to replicate must be provided.");
      id = id.id || id;
      if(fs.existsSync(`${options.to}/${id}.json`) > 0 && !(options.force)) return console.error(`[.replicate] : The provided document already exists in the directory "${options.to}". Move or delete the document in order to replicate again.`);
      if(fs.existsSync(`${options.to}/${id}.json`) > 0 && options.force) {
      if(fs.existsSync(`${options.to}/${id}_rep.json`) == true) return console.error(`[.replicate] : Document "${options.from}/${id}.json" has already been replicated at the target destination.`);
       let _data = fs.readFileSync(`${options.from}/${id}.json`);
        fs.writeFileSync(`${options.to}/${id}_rep.json`, _data);
         this.feedback ? console.log(`[.replicate] : Successfully forced replication of 1 document. ( ${options.from}/${id}.json > ${options.to}/${id}_rep.json )`) : "";
         (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - replicate() ] File "${id}" was force replicated.`, this.log.dir) : ""
      } else {
       let data = fs.readFileSync(`${options.from}/${id}.json`);
        fs.writeFileSync(`${options.to}/${id}.json`, data);
         this.feedback ? console.log(`[.replicate] : Successfully replicated 1 document.`) : "";
         (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - replicate() ] File "${id}" was successfully replicated.`, this.log.dir) : ""
      }
     } catch(err) {
       kill(this.kill, err.message, ".replicate()");
       (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "replicate()"!\n${err.message}`, this.log.dir) : ""
     }
    }

    /**
     * @param id The identifier of the document assigned on creation.
     * 
     * @param options.data The object of data you want to set the document to be.
     * @param options.dir What directory to pull and update the document from.
     * 
     * @example > db.set("1234", {name: "Seth R. Richardson", active: true}, {dir: `${__dirname}/data/`})
     * 
     * @returns {Object} document object after being set.
     */
    set(id, data, directory = {dir: this.path}) {
      id = id.toString();
      if(!id || !(data instanceof Object)) return console.error("[.set] : Unable to set a document due to a missing identifier or your data is not an Object.");
      id = id.id || id;
       try {
        if(fs.existsSync(`${directory.dir}${id}.json`) == false) return console.error(`[.set] : The given document identifier does not exist in this directory.`);
        data.id = data.id || id;
        let file = fs.readFileSync(`${directory.dir}${id}.json`);
        cache = JSON.parse(file); cache.dir = directory.dir;
        data = JSON.stringify(data, null, 3);
         fs.writeFileSync(`${directory.dir}${id}.json`, data);
          this.feedback ? console.log(`[.set] : Successfully overwritten 1 document.`) : "";
          (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - set() ] File "${id}" was successfully overwritten.`, this.log.dir) : ""
          return JSON.parse(data);
       }catch(err){
         kill(this.kill, err.message, ".set()");
         (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "set()"!\n${err.message}`, this.log.dir) : ""
       }
    }

    /**
     * Undo any recent change made by functions such as `.set()` or `.update()`
     * 
     * @example > db.undo();
     */

    undo() {
      try {
      if((Object.keys(cache[0])).length == 0) return console.error("[.undo] : There are no recent actions in the cache at this time.");
       if(fs.existsSync(`${cache.dir}${cache[0].id}.json`) == false) return console.error("[.undo] : The file which was originally stored in the cache no longer exists.");
        let dir = cache.dir; delete cache[1].dir;
        let data = JSON.stringify([cache[0]], null, 3);
         fs.writeFileSync(`${dir}${cache[0].id}.json`, data);
          this.feedback ? console.log(`[.undo] : Successfully undone 1 change to document ${dir}${cache[0].id}.json`) : "";
      }catch(err) {
        kill(this.kill, err.message, ".undo()");
        (((this.log) instanceof Object && this.log.enable == true) || this.log == true) ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "undo()"!\n${err.message}`, this.log.dir) : ""
      }
    }
    
}

module.exports = WastefulDB;
