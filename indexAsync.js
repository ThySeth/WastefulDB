const {fileReal} = require("./functions/existsAsync.js");
const {kill, trailingSlash} = require("./functions/errorHandler.js");

class AsyncWastefulDB {
    constructor(options = {path: "./syncData/", feedback: true}) {
        this.path = options.path || "./syncData/";
        this.feedback = options.feedback || true;
    }

    async insert(data, directory = {dir: this.path}) {
      if(!(data instanceof Object)) return console.error("[.insert] : The data given must be contained within an Object.");
      if(!data.id) return console.error("[.insert] : A document identifier must be provided before it can be created!");

      try {
        directory.dir = trailingSlash(directory.dir);

          if(!await fileReal(`${directory.dir}${data.id}.json`)) {
            // Run the update command later
          } else {
            
          }
      } catch(err) {
        
      }
    }
}

module.exports.AsyncWastefulDB;
