const {kill, trailingSlash} = require("./functions/errorHandler.js");
const {BNS, clog} = require("./functions/basic.js")

const fs = require("fs");

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
      if(!(data instanceof Object)) throw new Error("The data given must be contained within an Object.");
      if(!data.id) throw new Error("A document identifier must be provided before it can be created!");
      try {
        directory.dir = trailingSlash(directory.dir);
            let obj = JSON.stringify([data]);
             await fs.promises.writeFile(`${directory.dir}${data.id}.json`, obj, {flag: "wx"}); // flag "wx" so an error is thrown if the file exists
             this.feedback ? console.log(`[.insert] : Successfully created ${data.id}.json!`) : "";
              return JSON.parse(obj);
          
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

    /**
     * @param {String} identifier The identifier of the target document.
     * 
     * @param   {String} data.key The target key to be changed in the document.
     * @param     {String} data.child The child key of the target key to change.
     * @param   {String | Number} data.change What should the target key/child be changed to?
     * @param   {Number} data.math Does the 'change' require *simple* math? (default: `false`)
     * 
     * @param {String} directory.dir The directory to search for the document in.
     * @returns {Array}
     */
    async update(identifier, data = {key, child, change, math: false}, directory = {dir: this.path}) {
      try {
        if(!(data instanceof Object) || !data.key || !data.change) throw new Error("The 'data' argument must be an Object containing at least both 'key' and 'change' keys with values.");
         if(!identifier) throw new Error("You have to provide the identifier of the target document.");
          var doc = await fs.promises.open(`${trailingSlash(directory.dir)}${identifier}.json`, "r+"); // flag "w+" for read and write
            let content = await doc.readFile("utf8"); content = (JSON.parse(content))[0];
          // if(!content[data.key]) throw new Error(`The key provided, "${data.key}", couldn't be found in the target document.`);
            if(data.child) {
              if(!(content[data.key])[data.child]) throw new Error(`The child key "${data.child}" couldn't be found in the parent key "${data.key}".`);
                if(data.change == "undefined") { // undefined has to be a string, otherwise the process takes it literally
                  delete (content[data.key])[data.child];
                } else {
                  if((data.math && isNaN((content[data.key])[data.child])) || (data.math && isNaN(data.change))) throw new Error("[.update] : Unable to perform a math operation. Either the 'change' provided or the given key/child returned NaN.");
                   (content[data.key])[data.child] = (data.math ? (content[data.key])[data.child] + (data.change) : BNS(data.change)); // math? content + change : change
                }
            } else { // No child key
              if(data.change == "undefined") {
                delete content[data.key];
              } else {
                if((data.math && isNaN(content[data.key])) || (data.math && isNaN(data.change))) throw new Error("Unable to perform a math operation. Either the 'change' provided or the given key returned NaN.");
                 content[data.key] = (data.math ? (Number(content[data.key]) + Number(data.change)) : BNS(data.change));
              }
            }
            content = JSON.stringify([content]);
            await fs.promises.writeFile("./syncData/4321.json", content);
            this.feedback ? clog(`[.update] : Successfully updated document "${identifier}.json".`) : "";
            return JSON.parse(content);
      } catch(err) {
        kill(this.kill, err.message, ".update()");
      } finally {
        await doc?.close();
      }
    }

}

module.exports = AsyncWastefulDB;
