const fs = require("fs");

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
     * @param {Boolean} options.feedback Provides a confirmation message when a function executes successfully. (default: `false`)
     * @param {Boolean} options.log Writes to the file "logger.txt" when a function is executed or an error occurs. Includes a timestamp, name of function, and what occurred. (default: `false`)
     * @param {String} options.path Provide a custom directory to route each JSON file. Ignoring this will default read/write to "`./wastefuldb/data/`"
     * @param {Boolean} options.serial When **true**, you are no longer required to include an id variable to your file data. Instead, the identifier is based on the **directory size** at the time. (default: `false`)
     * @param {Array} options.standard standard[0], when **true**, will default to the given Object in stanard[1] and automatically create a document which doesn't exist when using functions such as `.find()`. Only works when `serial` is **true**. (default: `false`)
     * @param {Boolean} options.kill When an error occurs and the option is set to **true**, automatically kills the process to prevent further errors. (default: `false`)
     */
    constructor(options = {feedback:false, log:false, path: `${__dirname}/data/`, serial: false, standard: [false], kill: false}) {
        this.feedback = options.feedback || false
        this.log = options.log || false
        this.path = options.path || `${__dirname}/data/`
        this.serial = options.serial || false
        this.standard = options.standard || [false]; ((this.standard && this.standard[0] == true) && this.serial == false) ? console.log("Option 'standard' cannot be true while 'serial' is false.") : ""
        this.kill = options.kill || false;
        this.path = (this.path).charAt((this.path).length-1) == "/" ? this.path : this.path + "/";
    }

    

    insert(data = {id}, directory = {dir: this.path}) {
      try {
        if(!(data instanceof Object)) return console.log("The data provided must be an Object.");
        if(data.dir && (Object.keys(data)).length == 1) return console.log("The 'directory' parameter cannot be declared in the 'data' parameter.");
            let obj, dirsize = (fs.readdirSync(directory.dir)).length+1;
              if(this.serial == true) {
                (data.id != undefined) ? (data._id = data.id) && (data.id = dirsize) : data.id = dirsize;
                    obj = JSON.stringify([data], null, 3);
                    fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                        this.feedback == true ? console.log(`Successfully created 1 document. ( ${data._id || data.id}.json )`) : "";
                        this.log == true ? Logger(`[ ${new Date()} - insert() ] File "${data.id}" was successfully created.`) : ""
                            return JSON.parse(obj);
              } else {
                if(!data.id) return console.log("The document cannot be created without an 'id' key and value being declared.");
                    obj = JSON.stringify([data], null, 3);
                    fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                        this.feedback == true ? console.log("Successfully created 1 document.") : "";
                        this.log == true ? Logger(`[ ${new Date()} - insert() ] File "${data.id}" was successfully created.`) : "";
                            return JSON.parse(obj);
              }
      }catch(err){
        this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "insert()"!`) : ""
        if(this.kill) {
            throw new Error(err);
        } else {
            return console.log(err);
        }
      }
    }

    insertBulk(data = [], directory = {dir: this.path}) {
        let cancel = false;
        try {
          if((!data instanceof Array) || data.length == 1) return console.log("The data provided must be an Array, only containing Objects, with a length greater than 1.");
          if(!(data.find(foo => foo.id)?.id) && this.serial == false) return console.log("You must provide an 'id' key and value within any of the given Objects.");
            data.forEach(item => {
              if(cancel == true) return;
                if(!(item instanceof Object)) {
                  cancel = true;
                  return console.log("Unable to create a new document. One or more items in the Array are not an Object.");
                }
            });
              if(cancel == false) {
                let id, obj;
                if(this.serial == true) {
                  let dirsize = (fs.readdirSync(directory.dir)).length+1;
                    !((data.find(foo => foo.id))?.id) ? (data[0].id = dirsize) : (data[0]._id = (data.find(foo => foo.id)).id) && ((data.find(foo => foo.id)).id = dirsize); 
                      obj = JSON.stringify(data, null, 3);
                      fs.writeFileSync(`${directory.dir}${dirsize}.json`, obj);
                        this.feedback == true ? console.log("Successfully created 1 document.") : "";
                        this.log == true ? Logger(`[ ${new Date()} - insertBulk() ] File "${dirsize}" was successfully created.`) : ""
                          return JSON.parse(obj);
                } else {
                  id = (data.find(foo => foo.id)); if(!id) return console.log("The document could not be created because an 'id' key and value hasn't been declared in any Objects."); id = (data.find(foo => foo.id)).id
                    obj = JSON.stringify(data, null, 3);
                    fs.writeFileSync(`${directory.dir}${id}.json`, obj);
                      this.feedback == true ? console.log("Successfully created 1 document.") : "";
                      this.log == true ? Logger(`[ ${new Date()} - insertBulk() ] File "${id.id}" was successfully created.`) : ""
                        return JSON.parse(obj);
                }
              }
        } catch(err) {
          this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "insertBulk()"!`) : ""
          if(this.kill) {
            throw new Error(err);
          } else {
            return console.log(err);
          }
        }
    }


    find(identifier, directory = {dir: this.path}) {
      try {
        if((fs.existsSync(`${directory.dir}${(identifier.id || identifier).toString()}.json`) == false) && this.standard[0] == true) {
          let newFile = this.standard[1]; newFile.id = (identifier.id || identifier).toString(); newFile = JSON.stringify(newFile);
            fs.writeFileSync(`${directory.dir}${(identifier.id || identifier).toString()}.json`, newFile);
              this.feedback == true ? console.log("Successfully found 1 document.") : "";
              this.log == true ? Logger(`[ ${new Date()} - find() ] File "${data.id || data}" was unsuccessfully found. Document defaulted.`) : ""
                return JSON.parse(newFile)
        } else {
          let data = fs.readFileSync(`${directory.dir}${(identifier.id || identifier).toString()}.json`);
            data = JSON.parse(data);
              this.feedback == true ? console.log("Successfully found 1 document.") : "";
              this.log == true ? Logger(`[ ${new Date()} - find() ] File "${data.id || data}" was successfully found.`) : ""
                data = data.length > 1 ? data : data[0];
                  return data;
        }
      } catch(err) {
        this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "find()"!`) : ""
        if(this.kill) {
          throw new Error(err);
        } else {
          return console.log(err);
        }
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

    collect(directory = {dir: this.path}) {
      try {
        let obj = [], files = fs.readdirSync(directory.dir);
        files.forEach(file => {
          file = fs.readFileSync(`${directory.dir}${file}`);
            file = JSON.parse(file);
            file.length > 1 ? obj.push(file) : obj.push(file[0])
        })
          obj = obj.length == 0 ? -1 : obj;
            this.feedback == true ? console.log("Successfully collected all documents in the directory.") : "";
            this.log == true ? Logger(`[ ${new Date()} - collect() ] Successfully collected documents in the directory "${directory.dir}".`) : ""
              return obj;
      } catch(err) {
        this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "collect()"!`) : ""
        if(this.kill) {
          throw new Error(err);
        } else {
          return console.log(err);
        }
      }
    }

    

}

module.exports = WastefulDB
