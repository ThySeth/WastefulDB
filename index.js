const fs = require('fs');

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
     * @example > db.insert({id: "5523", name: "Margot", pass: "HelloWorld~", active: false}, {dir: `${__dirname}/data/`});
     */

     insert(data={id}, directory = {dir: this.path}) {
        if(!(data instanceof Object)) return console.log("Information given must be an Object."); 
        try {
          let obj, altid=false, dirsize = fs.readdirSync(directory.dir); dirsize = dirsize.length;
        if(this.serial == true) {
            (data.id > 0) ? data._id = dirsize : data.id = dirsize;   data.id ? altid=true : altid;
             obj = [ data ]; obj = JSON.stringify(obj);
              fs.writeFileSync(`${directory.dir}${data._id || data.id}.json`, obj);
               this.feedback == true ? console.log(`Successfully created 1 document. ( ${data._id || data.id}.json )`) : "";
        } else {
         if(!data.id) return console.log("Cannot create document without a valid 'id' key and value.");
         obj = [data]
          obj = JSON.stringify(obj);
           fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
           this.feedback == true ? console.log("Successfully created 1 document.") : "";
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
          let obj = JSON.stringify(data);
            fs.writeFileSync(`${directory.dir}${id}.json`, obj);
             this.feedback == true ? console.log("Successfully created 1 document.") : "";
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
     * @example > db.find({id: "1234"}, {dir: `${__dirname}/data/`});
     */

    find(data, directory = { dir: this.path }) {
      try {
        let info = fs.readFileSync(`${directory.dir}${data.id || data}.json`);
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
     * @param {String} [element.name] The name of the field to search for and compare to the provided 'content'.
     * @param {String} [element.content] The contents of the previously given field in order to find a specific file.
     * 
     * @param {String} [directory.dir] Specific directory to search for and update files. 
     *
     * @example > db.update({id: "1234", key: "name", child: "first", change: "Seth", math: false}, {dir: `${__dirname}/data/`});
     * @example > db.update({key: "age", change: 2, math: true}, {name: "animal", content: "ape"});
     */
    
    update(data = {id, key, child, change, math:false}, element = {name:undefined, content:undefined, dir: undefined}, directory = {dir: this.path}) { 
        let obj, files;
         try {
           directory.dir = (element instanceof Object && element.dir != undefined) ? element.dir : this.path;
            if(data.key == undefined || data.change == undefined) return console.error("You must provide information needed to update files."); // if function is empty
             if(element instanceof Object && element.name != undefined && element.content != undefined) { 
              // run collect-type function for updates
              if((element.name && !element.content) || (!element.name && element.content)) return console.error("Unable to locate file with missing field. ('name' or 'content')");
              files = fs.readdirSync(`${directory.dir}`);
                 files.forEach((file) => {
                     let target = fs.readFileSync(`${directory.dir}${file}`);
                      target = JSON.parse(target); 
                    if(target.length > 1) {
                        let fil = target.filter(i => {
                            i[element.name] && i[element.name] == element.content
                        });
                         if(fil) { // If identified as an ARRAY
                            target.forEach(i => {
                                if(i[data.key]) {
                                    if(data.math == true) {
                                        if(data.child) {
                                            if(isNaN(Number((i[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                                             (i[data.key])[data.child] = Number((i[data.key])[data.child]) + (Number(data.change));
                                              target = JSON.stringify(target);
                                               fs.writeFileSync(`${directory.dir}${file}`, target);
                                        } else {
                                            if(isNaN(Number((i[data.key])) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                                             i[data.key] = Number(i[data.key]) + (Number(data.change));
                                              target = JSON.stringify(target);
                                               fs.writeFileSync(`${directory.dir}${file}`, target);
                                        }
                                    } else {
                                        if(data.child) {
                                            (i[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                                            data.change == "undefined" ? delete (i[data.key])[data.child] : "";
                                             target = JSON.stringify(target);
                                              fs.writeFileSync(`${directory.dir}${file}`, target);
                                        } else {
                                            i[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                                            data.change == "undefined" ? delete i[data.key] : "";
                                             target = JSON.stringify(target);
                                              fs.writeFileSync(`${directory.dir}${file}`, target);
                                        }
                                    }
                                }
                            })
                            this.feedback == true ? console.log(`Successfully updated 1 bulk document. ( ${file} )`) : "";
                         }
                    } else {
                      target = target[0];
                       if(target[element.name] && target[element.name] == element.content) {
                         if(data.math == true) {
                            if(data.child) {
                                if(isNaN(Number((target[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                                 (target[data.key])[data.child] = Number((target[data.key])[data.child]) + (Number(data.change));
                                  obj = [ target ]; obj = JSON.stringify(obj);
                                   fs.writeFileSync(`${directory.dir}${file}`, obj);
                            } else {
                             if(isNaN(Number(target[data.key])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given key or change returning NaN.");
                             target[data.key] = Number(target[data.key]) + (Number(data.change));
                               obj = [ target ]; obj = JSON.stringify(obj);
                                fs.writeFileSync(`${directory.dir}${file}`, obj);
                            }
                         } else {
                          if(data.child) {
                              (target[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                              data.change == "undefined" ? delete (target[data.key])[data.child] : "";
                               obj = [target]; obj = JSON.stringify(obj);
                                fs.writeFileSync(`${directory.dir}${file}`, obj);
                          } else {
                            target[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                            data.change == "undefined" ? delete target[data.key] : "";
                             obj = [ target ]; obj = JSON.stringify(obj);
                              fs.writeFileSync(`${directory.dir}${file}`, obj);
                          }
                         }
                         this.feedback == true ? console.log(`Successfully updated 1 document. ( ${file} )`) : "";
                       }
                    }
                 })
             } else { // run standard update function
              if(data.id == undefined || data.key == undefined || data.change == undefined) return console.error("One or more fields is incomplete. ('id', 'key', and/or 'change').");
              data.id = (data.id).toString();
                let file = fs.readFileSync(`${directory.dir}${data.id}.json`); file = JSON.parse(file); 
                if(file.length > 1) { // run insertBulk update
                    let filt = file.findIndex(ob => ob[data.key] != undefined);
                     filt = filt >= 0 ? [file[filt]] : undefined;
                     if(!filt) { // Missing key if-else
                        (filt[0])[data.key] = data.change;
                           obj = [file]; obj = JSON.stringify(obj);
                            fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                     } else {
                        if(data.math == true) {
                         if(data.child) {
                            if(isNaN(Number(((filt[0])[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                             ((filt[0])[data.key])[data.child] = Number(((filt[0])[data.key])[data.child]) + (Number(data.change));
                              file = JSON.stringify(file);
                               fs.writeFileSync(`${directory.dir}${data.id}.json`, file); 
                         } else {
                            if(isNaN(Number((filt[0])[data.key])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given key or change returning NaN.");
                            (filt[0])[data.key] = Number((filt[0])[data.key]) + (Number(data.change));
                              file = JSON.stringify(file);
                               fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                         }
                        } else {
                            if(data.child) {
                                ((filt[0])[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                               data.change == "undefined" ? delete ((filt[0])[data.key])[data.child] : "";  
                                file = JSON.stringify(file);
                                  fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                            } else {
                                (filt[0])[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                                data.change == "undefined" ? delete (filt[0])[data.key] : "";
                                 file = JSON.stringify(file);
                                  fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                            }
                        }
                     }
                     this.feedback == true ? console.log("Successfully updated 1 bulk document.") : null;
                } else {
                file = file[0];
                 if(file[data.key] == null || undefined) { // Insert new field if the provided element does not exist
                  file[data.key] = data.change;
                   obj = [ file ]; obj = JSON.stringify(obj);
                    fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                 } else { // If element exists:
                  if(data.math == true) { // If math is set to true: 
                   if(data.child) {
                    if(isNaN(Number((file[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                    (file[data.key])[data.child] = Number((file[data.key])[data.child]) + (Number(data.change));
                     obj = [ file ]; obj = JSON.stringify(obj);
                      fs.writeFileSync(`${directory.dir}${file}`, obj);
                   } else {
                   if(isNaN(Number(file[data.key])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given key or change returning NaN.");
                    file[data.key] = Number(file[data.key]) + (Number(data.change));
                     obj = [ file ]; obj = JSON.stringify(obj);
                      fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                   }
                 } else { // If math is set to false:
                    if(data.child) {
                        (file[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                        data.change == "undefined" ? delete (file[data.key])[data.child] : "";
                          obj = [file]; obj = JSON.stringify(obj);
                              fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                    } else {
                   file[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                   data.change == "undefined" ? delete file[data.key] : "";
                    obj = [ file ]; obj = JSON.stringify(obj);
                     fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                     }
                  }
                }
              this.feedback == true ? console.log("Successfully updated 1 document.") : "";
              }
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
     * Reads each file within the directory and returns an array of objects with the information in each JSON file. Providing an id and/or key will filter through and push each file matching the profile.
     * @param {String} [data.id] The identifier stored within the file.
     * @param {String} [data.key] A key within a file's Object to search for.
     * @param {String} [data.value] The value of a key to search for. A "key" is required to use this.
     * 
     * @param {String} [directory.dir] Specific directory to collect file data from.
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
                             if(find[0].id == (data.id || data)) {
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
     * @example > db.check("1234", {dir: `${__dirname}/data/`});
     */

    check(data, directory = {dir: this.path}) {
      try {
        return fs.existsSync(`${directory.dir}${data.id || data}.json`);
      } catch(err) {
        console.log("Error: " + err.message);
      }
    }

    /**
     * Returns the total amount of files in the default or given directory where documents are read/written.
     * @param {String} [directory.dir] Specific directory to retrieve the file count from.
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
            fs.rmSync(`${directory.dir}${data.id || data}.json`);
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
    * Update several files at the same time with the same information provided.
    * @param {Array} identifier An array of identifiers to modify.
    * 
    * @param {String} options.key The name of an Object's key to modify.
    * @param {String} options.child A following key within the specified Object.
    * @param {String} options.change The change to make to an Object.
    * @param {Boolean} options.math Does the change require SIMPLE math?
    * 
    * @example > db.updateMass(["2", "3", "4"], {key: "age", change: -1, math: true});
    */

    updateMass(identifier = [], options = {key, child, change, math}, directory = {dir: this.path}) {
      if(!(identifier instanceof Array)) return console.log("You must provide an identifier or identifiers within an Array.");
       if(options.key == undefined || (options.key).length == 0) return console.log("An Object's key is required at 'options.key'."); if(options.change == undefined || (options.change).length == 0) return console.log("Unable to update due to missing input at 'options.change.");
        try {
            let foo, bar, c=0;
              identifier.forEach(id => {
               c++;
                foo = fs.readFileSync(`${directory.dir}${id}.json`);
                 foo = JSON.parse(foo); foo = foo[0]
                 if(options.math == false) {
                  if(options.child == undefined) {
                  foo[options.key] = (options.change == "true" ? true : options.change == "false" ? false : options.change);
                  options.change == "undefined" ? delete foo[options.key] : "";
                   bar = JSON.stringify([foo]);
                    fs.writeFileSync(`${directory.dir}${id}.json`, bar);
                  } else {
                      (foo[options.key])[options.child] = (options.change == "true" ? true : options.change == "false" ? false : options.change);
                      options.change == "undefined" ? delete (foo[options.key])[options.child] : "";
                       bar = JSON.stringify([foo]);
                        fs.writeFileSync(`${directory.dir}${id}.json`, bar);
                  }
                 } else {
                  if(options.child == undefined) {
                    if(isNaN(options.change) || isNaN(foo[options.key])) return console.log("'options.change' or 'options.key' returned NaN. Try disabling 'options.math'.");
                     foo[options.key] = Number(foo[options.key]) + Number(options.change);
                      bar = JSON.stringify([foo]);
                       fs.writeFileSync(`${directory.dir}${id}.json`, bar);
                  } else {
                      if(isNaN( Number((foo[options.key])(options.child))) || isNaN( Number((foo[options.key])(options.child))) ) return console.log("'options.change' or 'options.child' returned NaN. Try disabling 'options.math'.");
                       (foo[options.key])(options.child) = Number( (foo[options.key])(options.child) ) + Number( (foo[options.key])(options.child) );
                        bar = JSON.stringify([foo]);
                         fs.writeFileSync(`${directory.dir}${id}.json`, bar);
                  }
                 }
              })
              if(c == identifier.length) {
                this.feedback == true ? console.log(`Successfully updated ${c} documents.`) : "";
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

    
}


module.exports = WastefulDB;
