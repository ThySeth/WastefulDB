const {fileReal} = require("./functions/existsAsync.js");
const {kill, trailingSlash} = require("./functions/errorHandler.js");

const fs = require("fs");



class AsyncWastefulDB {
   /**
   * @param {String} path The default directory each function should target. (default: `./syncData/`)
   * @param {Boolean} feedback Should a message be sent to the console when a function executes? (default: `true`)
   * @param {Boolean} force If a process encounters a data conflict, should the process ignore this and continue? (default: `false`)
   */
    constructor(options = {path: "./syncData/", feedback: true, force: false}) {
        this.path = options.path || "./syncData/";
        this.feedback = options.feedback || true;
        this.force = options.force || false
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
         if(real && !this.force) return console.error("[.insert] : The document identifier specified already exists."); // If the file exists and isn't ignored
          if(real) { // If the file already exists
            // Run the update command later
          } else { // If the file doesn't exist already
            let obj = JSON.stringify([data]);
             await fs.promises.writeFile(`${directory.dir}${data.id}.json`, obj);
             this.feedback ? console.log(`[.insert] : Successfully created ${data.id}.json!`) : "";
              return JSON.parse(obj);
          }
      } catch(err) {
        kill(false, err.message, ".insert()"); // Placeholder!
      }
    }
}

module.exports = AsyncWastefulDB;
