const fs = require('fs');
let cache = [];

class WastefulDB {
    /**
     * @param {Boolean} options.feedback Provides a confirmation message when a function executes successfully. (default: `false`)
     * @param {String} options.path Provide a custom directory to route each JSON file. Ignoring this will default read/write to "`./wastefuldb/data/`"
     * @param {Boolean} options.serial When **true**, you are no longer required to include an id variable to your file data. Instead, the identifier is based on the **directory size** at the time. (default: `false`)
     * @param {Boolean} options.kill When an error occurs and the option is set to **true**, automatically kills the process to prevent further errors. (default: `false`)
     */
    constructor(options = {feedback, path, serial, kill}) {
        this.feedback = options.feedback || false
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
     * @returns `Array` containing data within document.
     * 
     * @example > db.insert({id: "5523", name: "Margot", pass: "HelloWorld~", active: false}, {dir: `${__dirname}/data/`});
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
                return JSON.parse(obj);
        } else {
         if(!data.id) return console.log("Cannot create document without a valid 'id' key and value.");
         obj = [data]
          obj = JSON.stringify(obj, null, 3);
           fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
           this.feedback == true ? console.log("Successfully created 1 document.") : "";
            return JSON.parse(obj);
         }
        }
        catch(err) {
          if(this.kill == true) {
              throw new Error(err.message);
          } else {
            console.log("Error: " + err.message);
          }
        }
    }

    /**
     * Create a bulk document containing an Array of Objects.
     * @param {String | Object} id The identifier within a file to search for.
     * @param {Array} data An array of Objects containing modifiable data.
     * 
     * @return `Array` containing data within document.
     * 
     * @example > db.insertBulk( [{first: "Sal", last: "V."}, {age: 44}, {balance: 102,543}] );
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
              return JSON.parse(obj);
        }
      } catch(err) {
          if(this.kill == true) {
              throw new Error(err.message);
          } else {
              console.log("Error: " + err.message);
          }
      }
     }

    /**
     * Retrieves and parses the data within the specified file.
     * @param {Object | String} data The identifier of a file.
     * @param {String} [directory.dir] Specific directory to search for files in. 
     * 
     * @return `Object`
     * 
     * @example > db.find({id: "1234"}, {dir: `${__dirname}/data/`});
     */

    find(data, directory = { dir: this.path }) {
      try {
        let info = fs.readFileSync(`${directory.dir}${(data.id || data).toString()}.json`);
          info = JSON.parse(info);
          this.feedback == true ? console.log("Successfully found 1 document.") : "";
          info = info.length > 1 ? info : info[0];
           return info;
      } catch(err) {
        if(this.kill == true) {
          throw new Error(err.message);
        } else {
          console.log("Error: " + err.message);
        }
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
     */
    
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
            }
       }catch(err){
          if(this.kill == true) {
              throw new Error(err.message);
          }else{
           console.error("Error: " + err.message);
          }
       }
  }

  /**
   * @param {Object} id The identifier of the target document.
   * @param {Array} data The array which stores objects to be sent to the target document.
   * 
   * @param {String} directory.dir The target directory of the document.
   * 
   * @example > db.mupdate("1234", [ {key: "name", change: "Nick", math: false}, {key: "pass", change: "Password1234"} ]);
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
            }
     } catch(err) {
        if(this.kill == true) {
            throw new Error(err.message);
        } else {
            console.error("Error: " + err.message);
        }
     }
  }

    /**
     * Reads each file within the directory and returns an array of objects with the information in each JSON file. Providing an id and/or key will filter through and push each file matching the profile.
     * @param {String} [data.id] The identifier stored within the file.
     * @param {String} [data.key] A key within a file's Object to search for.
     * @param {String} [data.value] The value of a key to search for. A "key" is required to use this.
     * 
     * @param {String} [directory.dir] Specific directory to collect file data from.
     * 
     * @return `Array`
     * 
     * @example > db.collect({id: "1234"}, {dir: `${__dirname}/data/`});
     * @example > db.collect({key: "name", value: "mick"});
     */

    collect(data, directory = {dir: this.path}) {
     let obj = []
        try {
        if(data == null || !data) {
           let files = fs.readdirSync(`${directory.dir}`);
            files.forEach(file => {
                let info = fs.readFileSync(`${directory.dir}${file}`); if(!obj) return new Error("File abnormality ocurred whilst attempting to read a file.\nFile name: " + file)
                 info = JSON.parse(info); 
                 info = info.length > 1 ? info : info[0]
                  obj.push(info);
            });
             return obj;
         } else {
            let files = fs.readdirSync(`${directory.dir}`);
            files.forEach(file => {
                let target = fs.readFileSync(`${directory.dir}${file}`);
                if(!target) return console.error("Couldn't find any files pertaining to the given key and value.")
                 target = JSON.parse(target); target = target[0];
                 data.id = (data.id).toString();
                  if(data.id && data.key == undefined) { // "id" without "element"
                      if(data.id == target.id) return obj.push(target);
                  } else if(data.key && data.value == undefined && data.id == undefined) { // "element" without "id"
                       if(target[data.key]) return obj.push(target);
                  } else if(data.key && data.value && data.id == undefined) { // "element" and "value" without "id"
                        if(target[data.key] && target[data.key] == data.value) return obj.push(target);
                  } else if(data.key && data.id && data.value == undefined) { // "element" and "id" without "value"
                        if(target.id == data.id && target[data.key]) return obj.push(target);
                  } else if(data.key && data.id && data.value) { // "element", "id", and "value"
                        if(target.id == data.id && target[data.key] && target[data.key] == data.value) return obj.push(target);
                  } else {
                      return;
                  }
            });
             return obj.length == 0 ? undefined : obj;
         }
        } catch(err) {
         if(this.kill == true) {
            throw new Error(err.message);
         } else {
            console.log("Error: " + err.message);
         }
        }
    }

    /**
     * Search the given directory for a specified identifier regardless of file name.
     * @param {String} data Identifier to scan for in each file.
     * @param {String} [data.dir] Specific directory to search for a file.
     * 
     * @return `Object`
     * 
     * @example > db.get({id: "1234", dir: `${__dirname}/data/`}, (result) => { console.log(result); });
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
                        let find = obj.filter(i => i["id"]);
                         if(find) {
                             if(find[0].id == (data.id || data).toString()) {
                                 this.feedback == true ? console.log("Successfully retrieved 1 document.") : "";
                                  end = true;
                                   return callback(obj);
                             }
                         }
                       } else {
                          obj = obj[0];
                          let dataAtt = Object.entries(data); dataAtt = dataAtt[0];
                           if(!obj) return new Error("File abnormality occurred whilst attempting to read.\nFile name: " + file);
                        if(!data.id) {
                            Object.entries(obj).forEach((item) => {
                                if(item[0] == dataAtt[0] && item[1] == dataAtt[1]) {
                                    this.feedback == true ? console.log("Successfully retrieved 1 document.") : "";
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
        }
    }

    /**
     * Check a given or default directory for a document and returns boolean if it exists or not. Intended to save resources when verifying files.
     * 
     * @param {Object | String} data Provide the identifier of a file to view if it currently exists.
     * @param {String} [directory.dir] Specific directory to check for an existing file.
     * 
     * @return `Boolean`
     * 
     * @example > db.check("1234", {dir: `${__dirname}/data/`});
     */

    check(data, directory = {dir: this.path}) {
      try {
        return fs.existsSync(`${directory.dir}${(data.id || data).toString()}.json`);
      } catch(err) {
        console.log("Error: " + err.message);
      }
    }

    /**
     * Returns the total amount of files in the default or given directory where documents are read/written.
     * @param {String} [directory.dir] Specific directory to retrieve the file count from.
     * 
     * @return `Number`
     * 
     * @example > db.size({dir: `${__dirname}/data/`});
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
        } catch(err) {
          if(this.kill == true) {
            throw new Error(err.message);
          } else {
            console.log("Error: " + err.message);
          }
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
      if(fs.existsSync(`${options.to}/${id}.json`) > 0 && options.force == false) return console.log(`The provided document already exists in the directory "${options.to}". Move or delete the document in order to replicate again.`);
      if(fs.existsSync(`${options.to}/${id}.json`) > 0 && options.force == true) {
      if(fs.existsSync(`${options.to}/${id}_rep.json`) == true) return console.log(`Document "${options.from}/${id}.json" has already been replicated at the target destination.`);
       let _data = fs.readFileSync(`${options.from}/${id}.json`);
        fs.writeFileSync(`${options.to}/${id}_rep.json`, _data);
         this.feedback == true ? console.log(`Successfully forced replication of 1 document. ( ${options.from}/${id}.json > ${options.to}/${id}_rep.json )`) : "";
      } else {
       let data = fs.readFileSync(`${options.from}/${id}.json`);
        fs.writeFileSync(`${options.to}/${id}.json`, data);
         this.feedback == true ? console.log(`Successfully replicated 1 document.`) : "";
      }
     } catch(err) {
       if(this.kill == true) {
         throw new Error(err.message);
       } else {
         console.log("Error: " + err.message);
       }
     }
    }

    /**
     * @param id The identifier of the document assigned on creation.
     * 
     * @param options.data The object of data you want to set the document to be.
     * @param options.dir What directory to pull and update the document from.
     * 
     * @example > db.set("1234", {name: "Seth R. Richardson", active: true}, {dir: `${__dirname}/data/`})
     */
    set(id, data, directory = {dir: this.path}) {
      id = id.toString();
      if(!id || !(data instanceof Object)) return console.error("Unable to set a document due to a missing identifier or your data is not an Object.");
       try {
        if(fs.existsSync(`${directory.dir}${id}.json`) == false) return console.error(`The given document identifier does not exist in this directory.`);
        data.id = data.id || id;
        let file = fs.readFileSync(`${directory.dir}${id}.json`);
        cache = JSON.parse(file); cache.dir = directory.dir;
        data = JSON.stringify(data, null, 3);
         fs.writeFileSync(`${directory.dir}${id}.json`, data);
          this.feedback == true ? console.log(`Successfully overwritten 1 document.`) : "";
       }catch(err){
         if(this.kill == true) {
           throw new Error(err.message);
         } else {
           console.log("Error: " + err.message);
         }
       }
    }

    /**
     * Undo any recent change made by functions such as `.set()` or `.update()`
     * 
     * @example > db.undo();
     */

    undo() {
      if((Object.keys(cache[0])).length == 0) return console.log("There are no recent actions in the cache at this time.");
       if(fs.existsSync(`${cache.dir}${cache[0].id}.json`) == false) return console.error("The file which was originally stored in the cache no longer exists.");
        let dir = cache.dir; delete cache[1].dir;
        console.log(cache);
        let data = JSON.stringify([cache[0]], null, 3);
         fs.writeFileSync(`${dir}${cache[0].id}.json`, data);
          this.feedback == true ? console.log(`Successfully undone 1 change to document ${dir}${cache[0].id}.json`) : "";
    }
    
}


module.exports = WastefulDB;
