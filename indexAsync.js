const {kill, trailingSlash} = require("./functions/errorHandler.js");
const {BNS, clog} = require("./functions/basic.js")

const fs = require("fs");

class AsyncWastefulDB {
   /**
   * @param {String} path The default directory each function should target. (default: `./syncData/`)
   * @param {Boolean} feedback Should a message be sent to the console when a function executes? (default: `true`)
   * @param {Boolean} parse Should the process parse each result? Setting as `false` will return raw JSON buffers instead.
   * @param {Boolean} kill Should the ongoing process be killed once an error occurs? (default: `false`)
   */
    constructor(options = {path: `${__dirname}/syncData/`, feedback: true, parse: true, kill: false}) {
        this.path = options.path || `${__dirname}/syncData/`;
        this.feedback = options.feedback
        this.parse = options.parse
        this.kill = options.kill
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
              return (this.parse ? JSON.parse : Buffer.from)(obj);
      } catch(err) {
        kill(this.kill, err.message, ".insert()");
      }
    }

    /**
     * @param {Array} data An array containing *multiple* objects containing keys and values.
     * @param {String} directory.dir The specific directory to create the document in. (default: `options.path`)
     * @returns {Array}
     */
    async insertBulk(data = [], directory = {dir: this.path}) {
      try {
      if(!(data instanceof Array) || data.length < 2) throw new Error("The data given must be an array containing 2 or more objects.");
       let identifier = data.findIndex(item => item.hasOwnProperty("id"));
        if(identifier === -1) throw new Error("A document identifier must be provided within one of the objects before it can be created!");
        // Prep the core values
         identifier = ((data[identifier]).id).toString();
         directory.dir = trailingSlash(directory.dir);
      let obj = JSON.stringify(data);
        await fs.promises.writeFile(`${directory.dir}${identifier}.json`, obj, {flag: "wx"});
        this.feedback ? console.log(`[.insertBulk()] : Successfully created ${identifier}.json!`) : "";
          return (this.parse ? JSON.parse : Buffer.from)(obj);
      } catch(err) {
        kill(this.kill, err.message, ".insertBulk()");
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
       data = (this.parse ? JSON.parse : Buffer.from)(data);
       this.feedback ? console.log(`[.find()] : Successfully found ${identifier}.json!`) : ""
        return data.length > 1 ? data : data[0];
      } catch(err) {
        kill(this.kill, err.message, ".find()");
      }
    }

    /**
     * @param {Array} identifiers An array of identifiers to search for. Returns `-1` if a document doesn't exist or isn't accessible.
     * @param {String} directory.dir The target directory that contains all the given documents. (default: `options.path`)
     * @returns {Array}
     */

    async findMore(identifiers, directory = {dir: this.path}) {
      try {
        if(identifiers.length == 1) return await this.find(identifiers[0], {dir: directory.dir}); // forward single-item arrays to the normal find.
        let docs = [], data;
          for(const id of identifiers) { // I didn't know this was a thing...
            data = (this.parse ? JSON.parse : Buffer.from)(await fs.promises.readFile(`${trailingSlash(directory.dir)}${id}.json`).catch(err => {return -1}));
            docs.push(data);
          }
        this.feedback ? console.log(`[.findMore()] : Successfully executed a search for ${identifiers.length} documents!`) : "";
        return docs;
      } catch(err) {
        kill(this.kill, err.message, ".findMore()");
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
          var doc = await fs.promises.open(`${trailingSlash(directory.dir)}${identifier}.json`, "r+");
            let content = await doc.readFile("utf8"); content = JSON.parse(content);
          if(content.length == 1) { // The file was made using .insert()
            content = content[0];
            if(!content[data.key] || (!content[data.key] && !(content[data.key])[data.child])) { // This catches any missing key & child keys.
              let obj = content;
                !data.child ? obj[data.key] = BNS(data.change) : (obj[data.key] = {}) && ((obj[data.key])[data.child] = BNS(data.change))
            } else {
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
                 content[data.key] = (data.math ? (content[data.key] + data.change) : BNS(data.change));
              }
            }
          }
            content = JSON.stringify([content]);
            await fs.promises.writeFile(`${directory.dir}${identifier}.json`, content);
            this.feedback ? clog(`[.update()] : Successfully updated document "${identifier}.json".`) : "";
            return (this.parse ? JSON.parse : Buffer.from)(content);
          } else if(content.length > 1){ // The file was made using .insertBulk()
           let fileKey = content.findIndex(obj => obj.hasOwnProperty(data.key)); // Locates the array
            // if(fileKey == -1) throw new Error(`The key "${data.key}" couldn't be found.`);
            let fixedContent = content[fileKey]; // The object is now center stage
            if(!content[data.key] || !(content[data.key])[data.child]) {
              (content[data.key])[data.child] = data.change;
            } else {
              if(data.child) { // There is a child key
                if(!(fixedContent[data.key])[data.child]) throw new Error(`The child key "${data.child}" couldn't be found in the parent key "${data.key}".`);
                  if(data.change == "undefined") {
                    delete (fixedContent[fileKey])[data.child]; 
                  } else {
                    if((data.math && isNaN((fixedContent[data.key])[data.child])) || (data.math && isNaN(data.change))) throw new Error("[.update] : Unable to perform a math operation. Either the 'change' provided or the given key/child returned NaN.");
                    (fixedContent[data.key])[data.child] = (data.math ? (fixedContent[data.key])[data.child] + (data.change) : BNS(data.change)); // math? content + change : change
                  }
              } else {
                if(data.change == "undefined") {
                  delete fixedContent[data.key];
                } else {
                  if((data.math && isNaN(fixedContent[data.key])) || (data.math && isNaN(data.change))) throw new Error("Unable to perform a math operation. Either the 'change' provided or the given key returned NaN.");
                  fixedContent[data.key] = (data.math ? (fixedContent[data.key] + data.change) : BNS(data.change));
                }
              }
              content = JSON.stringify(content);
              await fs.promises.writeFile(`${directory.dir}${identifier}.json`, content);
              this.feedback ? clog(`[.update()] : Successfully updated document "${identifier}.json".`) : "";
              return (this.parse ? JSON.parse : Buffer.from)(content);
          }
        }
      } catch(err) {
        kill(this.kill, err.message, ".update()");
      } finally {
        await doc?.close();
      }
    }

}

module.exports = AsyncWastefulDB;
