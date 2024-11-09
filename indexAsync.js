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
     * 
     * @example await db.insert({id: "7", name: "Moe", number: 8});
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
     * 
     * @example await db.insertBulk([{id: "5678"}, {name: "Brian"}, {number: 3}])
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
     * @param {String} directory.dir The directory path to search for the document. (default: `options.path`)
     * @returns {Object | Array}
     * 
     * @example const result = await db.find("6");
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
     * 
     * @example const result = await db.findMore(["6", "4321"]);
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
     * @param {String} options.dir The directory to search for the document in. (default: `options.path`)
     * @param {Number} options.position Which Object in an Array to create a new key/child key when it doesn't exist. **Only for `.insertBulk` entries.** (default: `0`)
     * @returns {Array | Buffer}
     * 
     * @example await db.update("6", {key: "foo", child: "bar", change: "biz"})
     */
    async update(identifier, data = {key, child, change, math: false}, options = {dir: this.path, position: 0}) {
      options.dir = options.dir || this.path;
      options.position = options.position || 0;
      try {
        if(typeof data.change == "boolean") throw new Error("In order to change Boolean values you must convert the 'change' argument to a String.")
        if(!(data instanceof Object) || !data.key || !data.change) throw new Error("The 'data' argument must be an Object containing at least both 'key' and 'change' keys with values.");
         if(!identifier) throw new Error("You have to provide the identifier of the target document.");
          const doc = await fs.promises.open(`${trailingSlash(options.dir)}${identifier}.json`, "r+");
            var content = await doc.readFile("utf8"); content = JSON.parse(content);
          if(content.length == 1) { // The file was made using .insert()
            content = content[0];
            if(!content[data.key] || (!content[data.key] && !(content[data.key])[data.child])) { // This catches any missing key & child keys.
              let obj = content;
                !data.child ? obj[data.key] = BNS(data.change) : (obj[data.key] = {}) && ((obj[data.key])[data.child] = BNS(data.change))
            } else {
            if(data.child) {
              if(!(content[data.key])[data.child]) {
                (content[data.key])[data.child] = BNS(data.change);
              } else if(data.change == "undefined") { // undefined has to be a string, otherwise the process takes it literally
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
            await fs.promises.writeFile(`${options.dir}${identifier}.json`, content);
            this.feedback ? clog(`[.update()] : Successfully updated "${identifier}.json".`) : "";
            await doc.close();
            return (this.parse ? JSON.parse : Buffer.from)(content);
          } else if(content.length > 1){ // The file was made using .insertBulk()
           let fileKey = content.findIndex(obj => {return obj.hasOwnProperty(data.key)}); // Locates the array. Returns -1 if no key is found
           if(fileKey === -1) {
            if(options.position > content.length-1) { options.position = content.length-1 } else if(options.position < 0) {options.position = 0}; // If the position is greater than the length, choose the last object. Vice versa if negative.
            if(!data.child) { // No need to make a child key.
              (content[options.position])[data.key] = BNS(data.change);
            } else {
              (content[options.position])[data.key] = {};
              ((content[options.position])[data.key])[data.child] = BNS(data.change);
            }
           } else {
            // if(!fileKey) return !data.child ? content[data.key] = data.change : (content[data.key] = {}) && (((content[data.key])[data.child] = data.change));
            var fixedContent = content[fileKey]; // The object is now center stage
              if(data.child) { // There is a child key
                if(!(fixedContent[data.key])[data.child]) { // The key is there, but the child isn't
                  (fixedContent[data.key])[data.child] = BNS(data.change);
                } else if(data.change == "undefined") {
                    delete (fixedContent[data.key])[data.child]; 
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
            }
            content = JSON.stringify(content);
            await fs.promises.writeFile(`${options.dir}${identifier}.json`, content);
            this.feedback ? clog(`[.update()] : Successfully updated "${identifier}.json".`) : "";
            await doc.close();
            return (this.parse ? JSON.parse : Buffer.from)(content);
          }
      } catch(err) {
        kill(this.kill, err.message, ".update()");
      }
    }

    /**
     * @param {String} id The identifier of the target document.
     * @param {Array} data An array of Objects containing the same parameters needed in `.update()`
     * @param {String} directory.dir The directory to search for the document identifier. (default: `options.path`)
     * 
     * @returns {Array | Buffer}
     * 
     * @example await db.mupdate("4321", [ {key: "name", change: "Stewart"}, {key: "number", change: 2, math: true} ])
     */
    async mupdate(id, data = [], directory = {dir: this.path}) {
      try {
       if(!id instanceof String) throw new Error(`The "id" argument must be a String. Received ${typeof id} instead.`);
        if(!data || !data instanceof Array) throw new Error(`The "data" argument must be an Array. Received ${typeof data} instead.`);
          if(data.length == 1) return this.update(id, data[0], {dir: directory.dir}); // Catch and redirect single item array arguments
            const doc = await fs.promises.open(`${trailingSlash(directory.dir)}${id}.json`, "r+"); // Open document with filehandle. r+ to throw an error if it doesn't exist.
            var content = JSON.parse(await doc.readFile("utf8")); // Parsed! 
      
      if(content.length == 1) { // [ --ONE OBJECT ONLY-- ]
        content = content[0]
        data.forEach((entry) => { // Going through each object
        // for(let i = 0; i < data.length; i++) {
        //   let entry = data[i];
        // }
          if(entry.key === undefined || entry.change === undefined) throw new Error(`Unable to update "${id}.json". One or more Objects in the "data" argument are missing "key" and "change" values.`);
           if(entry.change == "undefined") return delete (entry.child ? (content[entry.key])[entry.child] : content[entry.key]); // Deletes a key/child if the change is "undefined".
            if(entry.child) { // [ CHILD KEY PRESENT ]
              if(!content[entry.key] || !(content[entry.key])[entry.child]) { // No key/child exists. Creates one!
                content[entry.key] = {};
                 (content[entry.key])[entry.child] = BNS(entry.change) // Math checking isn't needed... It's a new key.
              } else {
                if((entry.math && isNaN((content[entry.key])[entry.child])) || (entry.math && isNaN(entry.change))) throw new Error(`Unable to update a key in "${id}.json". "math" is declared true but the target "key", "child", or "change" returned as NaN.`);
                 (content[entry.key])[entry.child] = (entry.math ? (content[entry.key])[entry.child] + (entry.change) : BNS(entry.change));
              }
            } else { // [ KEY ONLY PRESENT ]
              if(!content[entry.key]) { // No key exists. Creates one.
                content[entry.key] = entry.change;
              } else {
                if((entry.math && isNaN(content[entry.key])) || (entry.math && isNaN(entry.change))) throw new Error(`Unable to update a key in "${id}.json". "math" is declared true but the target "key" or "change" returned as NaN.`);
                 content[entry.key] = (entry.math ? (content[entry.key] + entry.change) : BNS(entry.change));
              }
            }
        })
        content = JSON.stringify([content])
         await fs.promises.writeFile(`${trailingSlash(directory.dir)}${id}.json`, content);
          this.feedback ? clog(`[.mupdate()] : Successfully made ${data.length} changes to "${id}.json".`) : "";
          await doc.close();
           return (this.parse ? JSON.parse : Buffer.from)(content);
      } else if(content.length > 1) { // [ --TWO+ OBJECT ONLY-- ]
        data.forEach(entry => {
          let target = content.findIndex(obj => obj.hasOwnProperty(entry.key)); // "content" is still an ARRAY
           if(target == -1) { // The key doesn't exist!
            // If there isn't a child key needed, just creates the key. Otherwise, creates a child key.
            // The key/child is created in the last Object in the Array.
             return !entry.child ? (content[content.length-1])[entry.key] = entry.change : ((content[content.length-1])[entry.key] = {}) && (((content[content.length-1])[entry.key])[entry.child] = entry.change);
           } else {
             target = content[target]; // "target" is now the Object to change. Changes should be reflected back to "content".
              if(entry.child) { // [ CHILD KEY PRESENT ] - (Everything from here is pretty much identical to single objects above)
                if((entry.math && isNaN((target[entry.key])[entry.child])) || (entry.math && isNaN(entry.change))) throw new Error(`Unable to update a key in "${id}.json". "math" is declared true but the target "key", "child", or "change" returned as NaN.`);
                 (target[entry.key])[entry.child] = (entry.math ? (target[entry.key])[entry.child] + (entry.change) : BNS(entry.change));
              } else { // [ NO CHILD KEY PRESENT ]
                if((entry.math && isNaN(target[entry.key])) || (entry.math && isNaN(entry.change))) throw new Error(`Unable to update a key in "${id}.json". "math" is declared true but the target "key" or "change" returned as NaN.`);
                 target[entry.key] = (entry.math ? (target[entry.key] + entry.change) : BNS(entry.change));
              }
           }
        })
        content = JSON.stringify(content);
         await fs.promises.writeFile(`${trailingSlash(directory.dir)}${id}.json`, content);
          this.feedback ? clog(`[.mupdate()] : Successfully made ${data.length} changes to "${id}.json".`) : "";
          await doc.close();
           return (this.parse ? JSON.parse : Buffer.from)(content);
      }
      } catch(err) {
        kill(this.kill, err.message, ".mupdate()");
      }
    }

    /**
     * @param {String} identifier
     * @param {String} directory.dir
     * @returns {Boolean}
     */
    async check(identifier, directory = {dir: this.path}) {
      if(!identifier || !identifier instanceof String) throw new Error(`The "id" argument must be a String. Received "${typeof identifier}" instead.`);
       try {
        await fs.promises.stat(`${trailingSlash(directory.dir)}${identifier}.json`);
         return true;
       } catch(err) {
        return false;
       }
    }

}

module.exports = AsyncWastefulDB;
