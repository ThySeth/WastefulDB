const fs = require('fs');
require("./functions/updateMath.js");

let cache = [];

function Logger(data) {
  try {
    let text, file = fs.existsSync(`${__dirname}/logger.txt/`);
     if(file){
      file = fs.readFileSync(`${__dirname}/logger.txt/`);
      text = `${data}\n${file}`
      fs.writeFileSync(`${__dirname}/logger.txt/`, text);
     } else {
      fs.writeFileSync(`${__dirname}/logger.txt/`, data)
     }
  }catch(err){
    console.log(`An error occurred while logging a process.\n${err}`);
  }
}

class WastefulDB {
    /**
     * @constructor
     * @param {Boolean} options.feedback Provides a confirmation message when a function executes successfully. (default: `false`)
     * @param {Boolean} options.log Writes to the file "logger.txt" when a function is executed or an error occurs. Includes a timestamp, name of function, and what occurred. (default: `false`)
     * @param {String} options.path Provide a custom directory to route each JSON file. Ignoring this will default read/write to "`./wastefuldb/data/`"
     * @param {Boolean} options.serial When **true**, you are no longer required to include an id variable to your file data. Instead, the identifier is based on the **directory size** at the time. (default: `false`)
     * @param {Array} options.standard standard[0], when **true**, will default to the given Object in stanard[1] and automatically create a document which doesn't exist when using functions such as `.find()`. Only works when `serial` is **true**. (default: `false`)
     * @param {Boolean} options.kill When an error occurs and the option is set to **true**, automatically kills the process to prevent further errors. (default: `false`)
     */
    constructor(options = {feedback, log, path, serial, standard, kill}) {
        this.feedback = options.feedback || false
        this.log = options.log || false
        this.path = options.path || `${__dirname}/data/`;
        this.serial = options.serial || false
        this.standard = options.standard || [false]; (this.standard == true && this.serial == false) ? console.log("Option 'standard' cannot be true while 'serial' is false.") : ""
        this.kill = options.kill || false
        this.path = (this.path).charAt((this.path).length-1) == "/" ? this.path : this.path + "/";
    }

    /**
     * Create a JSON file with the given object of data to be modified later.
     * @param {String} data.id A required identifier to name and track the file.
     * @param {String} [directory.dir] A specific directory to route the creation of files.
     * 
     * @example > db.insert({id: "5523", name: "Margot", pass: "HelloWorld~", active: false}, {dir: `${__dirname}/data/`});
     * 
     * @returns {Array} array containing data within document.
     */

     insert(data={id}, directory = {dir: this.path}) {
      if(!(data instanceof Object)) return console.log("Information given must be an Object."); 
      try {
        let obj, altid=false, dirsize = fs.readdirSync(directory.dir); dirsize = dirsize.length;
      if(this.serial == true) {
          (data.id > 0) ? data._id = dirsize : data.id = dirsize; data.id ? altid=true : altid;
           obj = [ data ]; obj = JSON.stringify(obj, null, 3);
            fs.writeFileSync(`${directory.dir}${data._id || data.id}.json`, obj);
             this.feedback == true ? console.log(`Successfully created 1 document. ( ${data._id || data.id}.json )`) : "";
             this.log == true ? Logger(`[ ${new Date()} - insert() ] File "${data.id}" was successfully created.`) : ""
              return JSON.parse(obj);
      } else {
       if(!data.id) return console.log("Cannot create document without a valid 'id' key and value.");
       obj = [data]
        obj = JSON.stringify(obj, null, 3);
         fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
         this.feedback == true ? console.log("Successfully created 1 document.") : "";
         this.log == true ? Logger(`[ ${new Date()} - insert() ] File "${data.id}" was successfully created.`) : ""
          return JSON.parse(obj);
       }
      }
      catch(err) {
        if(this.kill == true) {
            throw new Error(err.message);
        } else {
          console.log("Error: " + err.message);
        }
        this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "insert()"!`) : ""
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
        let cancel = false;
        try {
         if((!(data instanceof Array)) || data.length == 1) return console.log("More than one Object must be stored within an Array.");
          if(!data[0]) return console.log("Objects must be stored within the data Array.");
           if(!(data.find(foo => foo.id).id) && this.serial == false) return console.log("You must provide an \"id\" within an Object.");       
        data.forEach(item => {
          if(cancel == true) return;
            if(!(item instanceof Object)) {
                cancel = true;
                 return console.log("Unable to create document. One or more items in Array are not an Object.");
            } else {
                return;
            }
        })
        if(cancel == false) {
        let id = data.find(foo => foo.id); id = id.id;
          let obj = JSON.stringify(data, null, 3);
            fs.writeFileSync(`${directory.dir}${id}.json`, obj);
             this.feedback == true ? console.log("Successfully created 1 document.") : "";
             this.log == true ? Logger(`[ ${new Date()} - insertBulk() ] File "${id.id}" was successfully created.`) : ""
              return JSON.parse(obj);
        }
      } catch(err) {
          if(this.kill == true) {
              throw new Error(err.message);
          } else {
              console.log("Error: " + err.message);
          }
          this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "insertBulk()"!`) : ""
      }
     }

    /**
     * Retrieves and parses the data within the specified file.
     * @param {Object | String} data The identifier of a file.
     * @param {String} [directory.dir] Specific directory to search for files in. 
     * 
     * @example > db.find({id: "1234"}, {dir: `${__dirname}/data/`});
     * 
     * @returns {Object} document object of the specified file.
     */

    find(data, directory = { dir: this.path }) {
      try {
        if((fs.existsSync(`${directory.dir}${(data.id || data).toString()}.json`) == false) && this.standard[0] == true) {
          let newFile = this.standard[1]; newFile.id = (data.id || data); newFile = JSON.stringify([newFile])
          fs.writeFileSync(`${directory.dir}${(data.id || data).toString()}.json`, newFile)
          this.feedback == true ? console.log("Successfully found 1 document.") : "";
          this.log == true ? Logger(`[ ${new Date()} - find() ] File "${data.id || data}" was unsuccessfully found. Document defaulted.`) : ""
          return JSON.parse(newFile)
        } else {
        let info = fs.readFileSync(`${directory.dir}${(data.id || data).toString()}.json`);
          info = JSON.parse(info);
          this.feedback == true ? console.log("Successfully found 1 document.") : "";
          this.log == true ? Logger(`[ ${new Date()} - find() ] File "${data.id || data}" was successfully found.`) : ""
          info = info.length > 1 ? info : info[0];
           return info;
        }
      } catch(err) {
        if(this.kill == true) {
          throw new Error(err.message);
        } else {
          console.log("Error: " + err.message);
        }
        this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "find()"!`) : ""
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

    up(data = {id, key, child, change, math: false}, directory = {dir: this.path}) {
      try {
        if(!data.id || !data.key || !data.change) return console.error("[.update] : You must provide the required fields to update a document.");
        data.id = (data.id).toString();
        let file = fs.readFileSync(`${directory.dir}${data.id}.json`); file = JSON.parse(file);

        if(file instanceof Object) {                            // The object isn't an array. It was created using .insert()
          if(!file.hasOwnProperty(data.key)) return console.error("[.update] : Unable to update the document. The given key does not exist!");
          if(file.hasOwnProperty(data.key)) {                   // The key exists
            if((file[data.key]).hasOwnProperty(data.child)) {   // The key's child exists
              if(math) {                                        // Math has been set to TRUE
                if((objectMath(file, data)) == -1) return console.error("[.update] : The document cannot be updated. The target change, key, or child in the document was returned as NaN.");
                (file[data.key])[data.child] = (file[data.key])[data.child] + (data.change);
              } else {                                          // Math is set to FALSE
                (file[data.key])[data.child] = data.change;
              }
            } else {                                            // The key's child DOESN'T exist
              if(math) {                                        // Math has been set to TRUE
                if((objectMath(file, data)) == -1) return console.error("[.update] : The document cannot be updated. The target change or key in the document was returned as NaN.");
                file[data.key] = file[data.key] + (data.change);
              } else {                                          // Math is set to FALSE
                file[data.key] = data.change;
              }
            }
          }
        }
      } catch(err) {

      }
    }
    
     update(data = {id, key, child, change, math:false}, directory = {dir: this.path}) { 
      let obj, files;
       try {
          if(data.key == undefined || data.change == undefined) return console.error("You must provide information needed to update files."); // if function is empty
            if(data.id == undefined || data.key == undefined || data.change == undefined) return console.error("One or more fields is incomplete. ('id', 'key', and/or 'change').");
            data.id = (data.id).toString();
              let file = fs.readFileSync(`${directory.dir}${data.id}.json`); file = JSON.parse(file); 
              if(file.length > 1) { // If document was created by insertBulk()
                  let filt = file.findIndex(ob => ob[data.key] != undefined);
                   filt = filt >= 0 ? [file[filt]] : undefined;
                   if(!filt) { // Missing key if-else
                     filt = file;
                      (filt[file.length-1])[data.key] = data.change;
                         obj = file; obj = JSON.stringify(obj, null, 3);
                          fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                   } else {
                      if(data.math == true) { // math = true?
                       if(data.child) { // data has a key-child?
                          if(isNaN(Number(((filt[0])[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                           ((filt[0])[data.key])[data.child] = Number(((filt[0])[data.key])[data.child]) + (Number(data.change));
                           ((filt[0])[data.key])[data.child] = ((filt[0])[data.key])[data.child] % 1 != 0 ? parseFloat((((filt[0])[data.key])[data.child]).toFixed(2)) : ((filt[0])[data.key])[data.child];
                            file = JSON.stringify(file, null, 3);
                             fs.writeFileSync(`${directory.dir}${data.id}.json`, file); 
                       } else {
                          if(isNaN(Number((filt[0])[data.key])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given key or change returning NaN.");
                          (filt[0])[data.key] = Number((filt[0])[data.key]) + (Number(data.change));
                          (filt[0])[data.key] = (filt[0])[data.key] % 1 != 0 ? parseFloat(((filt[0])[data.key]).toFixed(2)) : (filt[0])[data.key];
                            file = JSON.stringify(file, null, 3);
                             fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                       }
                      } else { // math = false?
                          if(data.child) { // data has a key-child?
                              ((filt[0])[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                             data.change == "undefined" ? delete ((filt[0])[data.key])[data.child] : "";  
                              file = JSON.stringify(file, null, 3);
                                fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                          } else {
                              (filt[0])[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                              data.change == "undefined" ? delete (filt[0])[data.key] : "";
                               file = JSON.stringify(file, null, 3);
                                fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                          }
                      }
                   }
                   this.feedback == true ? console.log("Successfully updated 1 bulk document.") : null;
                   this.log == true ? Logger(`[ ${new Date()} - update() ] File "${data.id}" was successfully updated.`) : ""
                   return JSON.parse(file)
              } else { // If document was created with insert()
              file = file[0];
               if(file[data.key] == null || undefined) { // Insert new field if the provided key does not exist
                file[data.key] = data.change;
                 obj = [ file ]; obj = JSON.stringify(obj, null, 3);
                  fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
               } else { // If key exists:
                if(data.math == true) { // If math is set to true: 
                 if(data.child) {
                  if(isNaN(Number((file[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                  (file[data.key])[data.child] = Number((file[data.key])[data.child]) + (Number(data.change));
                  (file[data.key])[data.child] = (file[data.key])[data.child] % 1 != 0 ? parseFloat(((file[data.key])[data.child]).toFixed(2)) : (file[data.key])[data.child];
                   obj = [ file ]; obj = JSON.stringify(obj, null, 3);
                    fs.writeFileSync(`${directory.dir}${file}`, obj);
                 } else {
                 if(isNaN(Number(file[data.key])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given key or change returning NaN.");
                  file[data.key] = Number(file[data.key]) + (Number(data.change));
                  file[data.key] = file[data.key] % 1 != 0 ? parseFloat((file[data.key]).toFixed(2)) : file[data.key];
                   obj = [ file ]; obj = JSON.stringify(obj, null, 3);
                    fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                 }
               } else { // If math is set to false:
                  if(data.child) {
                      (file[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                      data.change == "undefined" ? delete (file[data.key])[data.child] : "";
                        obj = [file]; obj = JSON.stringify(obj, null, 3);
                            fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                  } else {
                 file[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                 data.change == "undefined" ? delete file[data.key] : "";
                  obj = [ file ]; obj = JSON.stringify(obj, null, 3);
                   fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                   }
                }
              }
            this.feedback == true ? console.log("Successfully updated 1 document.") : "";
            this.log == true ? Logger(`[ ${new Date()} - update() ] File "${data.id}" was successfully updated.`) : ""
            return JSON.parse(obj);
            }
       }catch(err){
          if(this.kill == true) {
              throw new Error(err.message);
          }else{
           console.error("Error: " + err.message);
          }
          this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "update()"!`) : ""
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
        if(!(id instanceof String) && (id instanceof Object && !id.id)) return console.error("Unable to locate document due to missing identifier argument."); if(!(data instanceof Array) || data.length <= 1) return console.error("The data provided must be contained within an Array and have more than 1 Object.");
        id = id.id ? id.id : id; // Handle alternative object form for identifiers
        if(fs.existsSync(`${directory.dir}${id}.json`) == false) return console.log("Couldn't find any documents with the given identifier.");
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
                          if(isNaN((item[thing.key])[thing.child]) || isNaN(thing.change)) return console.log("Given key or change returned NaN.");
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
                           if(isNaN(item[thing.key]) || isNaN(thing.change)) return console.error("Given key or change returned NaN.");
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
                 this.feedback == true ? console.log("Successfully mupdated 1 bulk document.") : "";
                 this.log == true ? Logger(`[ ${new Date()} - mupdate() ] File "${data.id}" was successfully updated.`) : ""
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
                            if(isNaN((obj[item.key])[item.child]) || isNaN(item.change)) return console.error("Given key or change returned NaN.");
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
                             if(isNaN(obj[item.key]) || isNaN(item.change)) return console.error("Given key or change returned NaN.");
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
                   this.feedback == true ? console.log("Successfully mupdated 1 document.") : "";
                   this.log == true ? Logger(`[ ${new Date()} - mupdate() ] File "${data.id}" was successfully updated.`) : ""
                   return JSON.parse(bar);
            }
     } catch(err) {
        if(this.kill == true) {
            throw new Error(err.message);
        } else {
            console.error("Error: " + err.message);
        }
        this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "mupdate()"!`) : ""
     }
  }

  /**
   * 
   * @param {String} data.id The identifier of the document to modify.
   * @param {String} data.key The key within the document to append the following 'value' to.
   * @param {Object} data.value The 'value' or object to append to the given document.
   * @param {Number} data.position Which object should the given value be appended to? Defaults to the last object in a document. (Optional)
   * @param {String} directory.dir The directory in which the document exists.
   * 
   * @example > db.append({id: "7", key: "bill", child: "career", value: "Mechanical Engineer", position: 1});
   * 
   * @returns {Object} the document after the given data is appended.
   */

  append(data = {id, key: undefined, value, position}, directory = {dir: this.path}) {
    if(!(data instanceof Object)) return console.log("Your 'data' argument must be an Object.");
    if(!data.id) return console.log("You need to provide an identifier in order to locate the document to change.");
    if(!data.key || !data.value) return console.log("You need to provide a 'key' and 'value' in order to append to the given document.");
      if(fs.existsSync(`${directory.dir}${data.id}.json`) == false) return console.log(`Unable to locate the document "${id}.json". It does not exist.`);
      let file = fs.readFileSync(`${directory.dir}${data.id}.json`);
      let appended = false;
      file = JSON.parse(file);
      if(file instanceof Object) {// .insert() file
        file = file[0]
        console.log(1);
        if(!file[data.key]) {
          console.log(3);
          file[data.key] = data.value;
          appended = true;
        } else if(file[data.key] && file[data.key] instanceof Array) { // The key being appended exists & is an array
          (file[data.key]).push(data.value);
          appended = true;
          console.log(2);
        }
        console.log(file);
        file = [file];
        file = JSON.stringify(file, null, 3);
        fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
          this.feedback == true ? console.log(appended ? "Successfully appended data to 1 document." : "Couldn't append data to 1 document.") : "";
          this.log == true ? Logger(appended ? `[ ${new Date()} - append() ] Successfully appended data to "${data.id}".` : `[ ${new Date()} - append() ] Coudln't append data to "${data.id}".`) : ""
          return JSON.parse(file);
      } else if(file instanceof Array) {
        console.log(1);
        if((file[data.position || (file.length)-1])[data.key] && (file[data.position || (file.length)-1])[data.key] instanceof Array) {
          ((file[data.position || (file.length)-1])[data.key]).push(data.value);
          appended = true;
        } else {
          (file[data.position || (file.length)-1])[data.key] = data.value;
          appended = true;
        }
        file = JSON.stringify(file, null, 3);
        fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
          this.feedback == true ? console.log(appended ? "Successfully appended data to 1 document." : "Couldn't append data to 1 document.") : "";
          this.log == true ? Logger(appended ? `[ ${new Date()} - append() ] Successfully appended data to "${data.id}".` : `[ ${new Date()} - append() ] Coudln't append data to "${data.id}".`) : ""
          return JSON.parse(file);
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
       this.feedback == true ? console.log("Successfully collected all documents in the directory.") : "";
       this.log == true ? Logger(`[ ${new Date()} - collect() ] Successfully collected documents in the directory "${directory.dir}".`) : ""
        obj = obj.length == 0 ? -1 : obj;
         return obj;
     } catch(err) {
       if(this.kill == true) {
        throw new Error(err);
       } else {
        console.log(`Error: ${err.message}`);
       }
       this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "collect()"!`) : ""
     }
    }

    /**
     * Search the given directory for a specified identifier regardless of file name.
     * @async
     * @param {String} data Identifier to scan for in each file.
     * @param {String} [data.dir] Specific directory to search for a file.
     * 
     * @example > db.get({id: "1234", dir: `${__dirname}/data/`}, (result) => { console.log(result); });
     * 
     * @returns {Object} document object in a callback function.
     */

     get(data = {id, dir}, callback) {
      data.dir == undefined ? data.dir = this.path : data.dir;
        try {
        let end = false;
        if(!(data instanceof Object)) return new Error("Unable to perform 'get' function due to 'data' variable not containing Object with query.");
                let files = fs.readdirSync(`${data.dir}`)
                 files.forEach(file => {
                    if(end == true) return;
                     let info = fs.readFileSync(`${data.dir}${file}`)
                          let obj = JSON.parse(info); 
                       if(obj.length > 1) {
                        console.log(1) 
                        let find = obj.filter(i => i["id"]);
                         if(find) {
                             if(find[0].id == (data.id || data).toString()) {
                                 this.feedback == true ? console.log("Successfully retrieved 1 document.") : "";
                                 this.log == true ? Logger(`[ ${new Date()} - get() ] File "${data.id}" was successfully retrieved.`) : ""
                                  end = true;
                                   return callback(obj);
                             }
                         }
                       } else {
                        console.log(2);
                          obj = obj[0];
                          let dataAtt = Object.entries(data); dataAtt = dataAtt[0];
                           if(!obj) return new Error("File abnormality occurred whilst attempting to read.\nFile name: " + file);
                        if(!data.id) {
                            Object.entries(obj).forEach((item) => {
                                if(item[0] == dataAtt[0] && item[1] == dataAtt[1]) {
                                    this.feedback == true ? console.log("Successfully retrieved 1 document.") : "";
                                    this.log == true ? Logger(`[ ${new Date()} - get() ] File "${data.id}" was successfully retrieved.`) : ""
                                    end = true;
                                     return callback(obj);
                                } else {
                                    return;
                                }
                            })
                        } else{
                         data.id = (data.id).toString();
                            if(obj.id == data.id) {
                                this.feedback == true ? console.log("Successfully retrieved 1 document.") : "";
                                this.log == true ? Logger(`[ ${new Date()} - get() ] File "${data.id}" was successfully retrieved.`) : ""
                                end = true;
                                 return callback(obj);
                            } else {
                                return;
                            }
                        }
                    }
                 })
                 if(end == false) {
                     this.feedback == true ? console.log("Unable to retrieve any documents pertaining to the given query.") : "";
                 }
        }catch(err){
            if(this.kill == true) {
                throw new Error(err.message);
            } else {
            console.log("Error: " + err.message);
            }
            this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "get()"!`) : ""
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
        console.log("Error: " + err.message);
      }
      this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "check()"!`) : ""
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
         if(this.kill == true) {
            throw new Error(err.message);
         } else {
            console.log("Error: " + err.message);
         }
         this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "size()"!`) : ""
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
             this.feedback == true ? console.log("Successfully deleted 1 document.") : "";
             this.log == true ? Logger(`[ ${new Date()} - delete() ] File "${data.id}" was successfully deleted.`) : ""
        } catch(err) {
          if(this.kill == true) {
            throw new Error(err.message);
          } else {
            console.log("Error: " + err.message);
          }
          this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "delete()"!`) : ""
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
      if(!id) return console.log("An identifier of a file to replicate must be provided.");
      id = id.id || id;
      if(fs.existsSync(`${options.to}/${id}.json`) > 0 && options.force == false) return console.log(`The provided document already exists in the directory "${options.to}". Move or delete the document in order to replicate again.`);
      if(fs.existsSync(`${options.to}/${id}.json`) > 0 && options.force == true) {
      if(fs.existsSync(`${options.to}/${id}_rep.json`) == true) return console.log(`Document "${options.from}/${id}.json" has already been replicated at the target destination.`);
       let _data = fs.readFileSync(`${options.from}/${id}.json`);
        fs.writeFileSync(`${options.to}/${id}_rep.json`, _data);
         this.feedback == true ? console.log(`Successfully forced replication of 1 document. ( ${options.from}/${id}.json > ${options.to}/${id}_rep.json )`) : "";
         this.log == true ? Logger(`[ ${new Date()} - replicate() ] File "${id}" was force replicated.`) : ""
      } else {
       let data = fs.readFileSync(`${options.from}/${id}.json`);
        fs.writeFileSync(`${options.to}/${id}.json`, data);
         this.feedback == true ? console.log(`Successfully replicated 1 document.`) : "";
         this.log == true ? Logger(`[ ${new Date()} - replicate() ] File "${id}" was successfully replicated.`) : ""
      }
     } catch(err) {
       if(this.kill == true) {
         throw new Error(err.message);
       } else {
         console.log("Error: " + err.message);
       }
       this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "replicate()"!`) : ""
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
      if(!id || !(data instanceof Object)) return console.error("Unable to set a document due to a missing identifier or your data is not an Object.");
      id = id.id || id;
       try {
        if(fs.existsSync(`${directory.dir}${id}.json`) == false) return console.error(`The given document identifier does not exist in this directory.`);
        data.id = data.id || id;
        let file = fs.readFileSync(`${directory.dir}${id}.json`);
        cache = JSON.parse(file); cache.dir = directory.dir;
        data = JSON.stringify(data, null, 3);
         fs.writeFileSync(`${directory.dir}${id}.json`, data);
          this.feedback == true ? console.log(`Successfully overwritten 1 document.`) : "";
          this.log == true ? Logger(`[ ${new Date()} - set() ] File "${id}" was successfully overwritten.`) : ""
          return JSON.parse(data);
       }catch(err){
         if(this.kill == true) {
           throw new Error(err.message);
         } else {
           console.log("Error: " + err.message);
         }
         this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "set()"!`) : ""
       }
    }

    /**
     * Undo any recent change made by functions such as `.set()` or `.update()`
     * 
     * @example > db.undo();
     */

    undo() {
      try {
      if((Object.keys(cache[0])).length == 0) return console.log("There are no recent actions in the cache at this time.");
       if(fs.existsSync(`${cache.dir}${cache[0].id}.json`) == false) return console.error("The file which was originally stored in the cache no longer exists.");
        let dir = cache.dir; delete cache[1].dir;
        let data = JSON.stringify([cache[0]], null, 3);
         fs.writeFileSync(`${dir}${cache[0].id}.json`, data);
          this.feedback == true ? console.log(`Successfully undone 1 change to document ${dir}${cache[0].id}.json`) : "";
      }catch(err) {
        if(this.kill == true) {
          throw new Error(err.message);
        } else {
          console.log("Error: " + err.message);
        }
        this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "undo()"!`) : ""
      }
    }
    
}

module.exports = WastefulDB;
