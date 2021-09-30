const fs = require('fs');

let config = fs.readFileSync("./config.json"); config = JSON.parse(config);

module.exports = class WastefulDB {
    /**
     * @param {Boolean} options.feedback Provides confirmation via the console each time most of the functions successfully execute. (default: false)
     * @param {String} options.path Provide a custom directory/path to read/write each JSON file. Ignoring this will automatically read/write to ".../wastefuldb/data/"
     * @param {Boolean} options.serial When true, you are no longer required to include an id variable to your file data. Instead, the identifier is based on the directory size at the time.
     */
    constructor(options = {feedback, path, serial}) {
        this.feedback = options.feedback || config.feed;
        this.path = options.path || `${__dirname}/data/`;
        this.serial = options.serial || config.serial;

    }

    /**
     * Create a JSON file containing organized and modifiable information to be retrieved later.
     * @param {Object} data Content to be stringified and stored in JSON.
     * @param {String} data.id File name & identifier (REQUIRED)
     */

     insert(data) {
        if(!(data instanceof Object)) return console.log("Information given must be an Object."); 
        try {
          let obj, altid=false, dirsize = fs.readdirSync(this.path); dirsize = dirsize.length;
        if(this.serial == true) {
            (data.id > 0) ? data._id = dirsize : data.id = dirsize;   data.id ? altid=true : altid;
            console.log(data);
             obj = [ data ]; obj = JSON.stringify(obj);
              fs.writeFileSync(`${this.path}${data._id || data.id}.json`, obj);
               this.feedback == true ? console.log(`Successfully created 1 document. ( ${data._id || data.id}.json )`) : "";
        } else {
         if(!data.id) return console.log("Cannot create document without valid 'id' variable.");
         obj = [data]
          obj = JSON.stringify(obj);
           fs.writeFileSync(`${this.path}${data.id}.json`, obj);
           this.feedback == true ? console.log("Successfully created 1 document.") : "";
         }
        }
        catch(err) {
            console.log("Error: " + err.message);
        }
    }

    /**
     * Retrieves and parses the data within the specified file.
     * @param {Object | String} [data] The identifier of a file.
     * @returns {Array}
     */

    find(data) {
      try {
        let info = fs.readFileSync(`${this.path}${data.id || data}.json`);
          info = JSON.parse(info);
          this.feedback == true ? console.log("Successfully found 1 document.") : "";
           return info[0];
      } catch(err) {
          console.log("Error: " + err.message);
      }
    }

    /**
     * Find and update a specified element within a file. Set "math" to be true for SIMPLE math.
     * @type {Object}
     * @param {Object} data Object containing arguments to successully update files. (id, element, change, math?)
     * @param {String} data.id Identifier of the target file to update.
     * @param {String} data.element The element of the object to modify.
     * @param {String} data.change Changes to be made to the target element.
     * @param {Boolean} [data.math=false] Whether the change requires simple math or not. (Default: false)
     * 
     * @param {Object} [element] Object containing arguments used to locate files based on file contents rather than an ID.
     * @param {String} [element.name] The name of the field to search for and compare to the provided 'content'.
     * @param {String} [element.content] The contents of the previously given field in order to find a specific file.
     */

    update(data = {id, element, change, math:false}, element = {name:undefined, content:undefined}) { 
     /*
        'element' variable serves as an alternate method of locating files.
        when using such, you are not required to include an id field in 'data'.
        this is meant for cases in which serialization is set to 'true' -
        in order to find and update files containing unique elements.
         
        element.name == name of a field to find
        element.content == the contents of the field to match

        ex:
         {
             name: "pass",
             content: "abc"
         }

     */
        let obj, files;
         try {
            if(!data.element || !data.change) return console.error("You must provide information needed to update files."); // if function is empty
             if(element instanceof Object) { // run collect-type function for updates
              if((element.name && !element.content) || (!element.name && element.content)) return console.error("Unable to locate file with missing field. ('name' or 'content')");
                files = fs.readdirSync(`${this.path}`);
                 files.forEach((file) => {
                     let target = fs.readFileSync(`${this.path}${file}`);
                      target = JSON.parse(target); target = target[0];
                       if(target[element.name] && target[element.name] == element.content) {
                         if(data.math == true) {
                             if(isNaN(Number(target[data.element])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given element or change returning NaN.");
                             target[data.element] = Number(target[data.element] + (Number(data.change)));
                               obj = [ target ]; obj = JSON.stringify(obj);
                                fs.writeFileSync(`${this.path}${file}`, obj);
                         } else {
                            target[data.element] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                             obj = [ target ]; obj = JSON.stringify(obj);
                              fs.writeFileSync(`${this.path}${file}`, obj);
                         }
                         this.feedback == true ? console.log(`Successfully updated 1 document. ( ${file} )`) : "";
                       }
                 })
             } else { // run standard update function
              if(!data.id || !data.element || !data.change) return console.error("One or more fields is incomplete. ('id', 'element', and/or 'change').");
                let file = fs.readFileSync(`${this.path}${data.id}.json`); file = JSON.parse(file); file = file[0];
                 if(file[data.element] == null || undefined) { // Insert new field if the provided element does not exist
                  file[data.element] = data.change;
                   obj = [ file ]; obj = JSON.stringify(obj);
                    fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                 } else { // If element exists:
                  if(data.math == true) { // If math is set to true: 
                   if(isNaN(Number(file[data.element])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given element or change returning NaN.");
                    file[data.element] = Number(file[data.element] + (Number(data.change)));
                     obj = [ file ]; obj = JSON.stringify(obj);
                      fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                 } else { // If math is set to false:
                   file[data.element] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                    obj = [ file ]; obj = JSON.stringify(obj);
                     fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                  }
                }
              this.feedback == true ? console.log("Successfully updated 1 document.") : "";
             }
         }catch(err){
             console.error("Error: " + err.message);
         }
    }

    /**
     * Reads each file within the directory, parses, pushes and returns an object of the information in each JSON file. Providing an id and/or element will filter through and push each file matching the profile.
     * @param {Object} [data=undefined]
     * @param {String} [data.id]
     * @param {String} [data.element]
     * @returns {Object}
     */

    collect(data) {
     let obj = []
        try {
        if(!data) {
           let files = fs.readdirSync(`${this.path}`);
            files.forEach(file => {
                let info = fs.readFileSync(`${this.path}${file}`); if(!obj) return new Error("File abnormality ocurred whilst attempting to read a file.\nFile name: " + file)
                 info = JSON.parse(info); info = info[0];
                  obj.push(info);
            });
             return obj;
         } else {
            let files = fs.readdirSync(`${this.path}`);
            files.forEach(file => {
                let target = fs.readFileSync(`${this.path}${file}`);
                if(!target) return console.error("Couldn't find any files pertaining to the given fields.")
                 target = JSON.parse(target); target = target[0];
                  if(data.id && data.element == undefined) { // collect({id: });
                      if(target.id == data.id) return obj.push(target);
                  } else if(data.element && data.id == undefined) { // collect()
                       if(target[data.element]) return obj.push(target);
                  } else if(data.element && data.id) {
                        if(target.id == data.id && target[data.element]) return obj.push(target);
                  } else {
                      return;
                  }
            });
         }
        } catch(err) {
            console.log("Error: " + err.message);
        }
    }

    /**
     * Search the given directory for a specified identifier regardless of file name.
     * @param {String} data Identifier to scan for in each file.
     * @returns {Array}
     */

    get(data, callback) {
        try {
           let files = fs.readdirSync(`${this.path}`)
                 files.forEach(file => {
                     let info = fs.readFileSync(`${this.path}${file}`)
                          let obj = JSON.parse(info); obj = obj[0];
                           if(!obj) return new Error("File abnormality occurred whilst attempting to read.\nFile name: " + file);
                            if(obj.id == data.id || data) {
                                this.feedback == true ? console.log("Successfully retrieved 1 document.") : "";
                             return callback(obj);
                        }
                 })
        }catch(err){
            console.log("Error: " + err.message);
        }
    }

    /**
     * Function is intended to save on "resources" by returning boolean values rather than committing to the process of retrieving, parsing, and returning file data.
     * 
     * @param {Object | String} data Provide the identifier of a file to view if it currently exists.
     * @returns {boolean}
     */

    check(data) {
      try {
        return fs.existsSync(`${this.path}${data.id || data}.json`);
      } catch(err) {
        console.log("Error: " + err.message);
      }
    }

    /**
     * Returns the total amount of files in the default or given directory where data is read/written.
     * @returns {Number}
     */

    size() {
        try {
            let files = fs.readdirSync(`${this.path}`);
             return files.length;
        }catch(err) {
            console.log("Error: " + err.message);
        }
    }

    /**
     * Deletes the specified JSON file.
     * @param {Object | String} data Identifier of the file.
     */

    delete(data) {
        try {
            fs.rm(`${this.path}${data.id || data}.json`);
             this.feedback == true ? console.log("Successfully deleted 1 document.") : "";
        } catch(err) {
            console.log("Error: " + err.message);
        }
    }

}

module.exports.wastefuldb;
