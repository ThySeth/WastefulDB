const {fileReal} = require("./functions/existsAsync.js");
const {kill, trailingSlash} = require("./functions/errorHandler.js");
const {BNS} = require("./functions/basic.js")

const fs = require("fs");

var openCache = []

class AsyncWastefulDB {
   /**
   * @param {String} path The default directory each function should target. (default: `./syncData/`)
   * @param {Boolean} feedback Should a message be sent to the console when a function executes? (default: `true`)
   * @param {Boolean} force If a process encounters a data conflict, should the process ignore this and continue? (default: `false`)
   * @param {Boolean} kill Should the ongoing process be killed once an error occurs? (default: `false`)
   */
    constructor(options = {path: "./syncData/", feedback: true, force: false, kill: false}) {
        this.path = options.path || "./syncData/";
        this.feedback = options.feedback || true;
        this.force = options.force || false
        this.kill = options.kill || false;
    }

    /**
     * @param {Object} data A *single* object containing keys and values.
     * @param {String} directory.dir A specific directory path you want to insert to. (default: `options.path`)
     * @returns {Array}
     */
    async insert(data, directory = {dir: this.path}) {
      if(!(data instanceof Object)) return console.error("[.insert] : The data given must be contained within an Object.");
      if(!data.id) return console.error("[.insert] : A document identifier must be provided before it can be created!");
      try {
        directory.dir = trailingSlash(directory.dir);
        let real = await fileReal(`${directory.dir}${data.id}.json`);
          if(real) { // If the file already exists
            // Run the update command later
          } else { // If the file doesn't exist already
            let obj = JSON.stringify([data]);
             await fs.promises.writeFile(`${directory.dir}${data.id}.json`, obj);
             this.feedback ? console.log(`[.insert] : Successfully created ${data.id}.json!`) : "";
              return JSON.parse(obj);
          }
      } catch(err) {
        kill(this.kill, err.message, ".insert()");
      }
    }

    /**
     * @param {String} identifier The identifier, or document name, to search for.
     * @param {String} directory.dir The directory path to search for the document.
     * @returns {Object | Array}
     */

    async find(identifier, directory = {dir: this.path}) {
      try {
       let data = await fs.promises.readFile(`${trailingSlash(directory.dir)}${identifier}.json`);
       data = JSON.parse(data);
        return data.length > 1 ? data : data[0];
      } catch(err) {
        kill(this.kill, err.message, ".find()");
      }
    }

    async update(identifier, data = {key, child, change, math: false}, directory = {dir: this.path}) {
      try {
        if(!(data instanceof Object) || !data.key || !data.change) throw new Error("[.update] : The 'data' argument must be an Object containing at least both 'key' and 'change' keys with values.");
         if(!identifier) throw new Error("[.update] : You have to provide the identifier of the target document.");
          var doc = await fs.promises.open(`${trailingSlash(directory)}${identifier}.json`, "r+"); // flag "w+" for read and write
            let content = await doc.readFile("utf8"); content = content[0];

          if(!content[data.key]) throw new Error(`[.update] : The key provided, "${data.key}", couldn't be found in the target document.`);
            if(data.child) {
              if(!(content[data.key])[data.child]) throw new Error(`[.update] : The child key "${data.child}" couldn't be found in the parent key "${data.key}".`);
                if(data.change == "undefined") { // undefined has to be a string, otherwise the process takes it literally
                  delete (content[data.key])[data.child];
                } else {
                  if((data.math && isNaN((content[data.key])[data.child])) || (data.math && isNaN(data.change))) return console.error("[.update] : Unable to perform a math operation. Either the 'change' provided or the given key/child returned NaN.");
                   (content[data.key])[data.child] = (data.math ? )
                }
            } else { // No child key

            }
      } catch(err) {
        await doc.close();
        kill(this.kill, err.message, ".update()");
      }
    }

}

module.exports = AsyncWastefulDB;
