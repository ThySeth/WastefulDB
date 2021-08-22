const fs = require('fs');

module.exports = class WastefulDB {
    /**
     * @param {Boolean} options.feedback Provides confirmation via the console each time most of the functions successfully execute. (default: false)
     * @param {String} path Provide a custom directory/path to read/write each JSON file. Ignoring this will automatically read/write to ".../wastefuldb/data/"
     */
    constructor(options = {}, path = `${__dirname}/data/`) {
        this.feedback = options.feedback || false;
        this.path = path;
    }

    /**
     * Create a JSON file containing organized and modifiable information to be retrieved later.
     * @param {Object} data Content to be stringified and stored in JSON.
     * @param {String} data.id File name & identifier (REQUIRED)
     */

    insert(data) {
        if(!(data instanceof Object)) return new Error("Information given must be an Object."); if(!data.id) return new Error("Object requires identifier to name file.");
        try {
         let obj = [ data ];
          obj = JSON.stringify(obj);
           fs.writeFileSync(`${this.path}${data.id}.json`, obj);
           this.feedback == true ? console.log("Successfully created 1 document.") : "";
        }
        catch(err) {
            console.log(err);
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
          console.log(err);
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
     */

     update(data) {
        if(!(data instanceof Object)) throw new Error("Object is required to update file."); if(!data.id || !data.element || !data.change) throw new Error("Unable to complete update due to misssing field(s) in Object."); (!data.math ? data.math = false : data.math);
      let obj;  
      try{
         let file = fs.readFileSync(`${this.path}${data.id}.json`); file = JSON.parse(file); file = file[0];
          if(file[data.element] == null || undefined) { // Insert new field if the provided element does not exist
            file[data.element] = data.change;
             obj = [ file ]; obj = JSON.stringify(obj);
              fs.writeFileSync(`${this.path}${data.id}.json`, obj);
          } else if(file[data.element]) { // If element exists:
              if(data.math == true) { // If math is set to true: 
                if(isNaN(parseInt(file[data.element])) || isNaN(parseInt(data.change))) return new Error("Unable to update file due to given element or change returning NaN.");
                 file[data.element] = parseInt(file[data.element] + (data.change));
                  obj = [ file ]; obj = JSON.stringify(obj);
                   fs.writeFileSync(`${this.path}${data.id}.json`, obj);
              } else { // If math is set to false:
                  file[data.element] = data.change;
                   obj = [ file ]; obj = JSON.stringify(obj);
                    fs.writeFileSync(`${this.path}${data.id}.json`, obj);
              }
          }
          this.feedback == true ? console.log("Successfully updated 1 document.") : "";
        }catch(err){
            console.log(err);
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
                           if(!obj) return new Error("File abnormality occurred whilst attempting to read.\nFile name: " + file + ".json");
                            if(obj.id == data.id || data) {
                                this.feedback == true ? console.log("Successfully retrieved 1 document.") : "";
                             return callback(obj);
                        }
                 })
        }catch(err){
            console.log(err);
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
          console.log(err);
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
            console.log(err);
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
            console.log(err);
        }
    }

}

module.exports.wastefuldb;
