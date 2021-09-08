/**
  @param {Object | String} data
  
  @param {Object} [element]
  @param {String} [element.name]
  @param {String} [element.content]
*/

delete(data, element={name: undefined, content: undefined) {
        try {
         let files, obj;
          if(!(data instanceof Object) && element.name && element.content) {
            files = fs.readdirSync(this.path); 
              files.forEach(file => {
                let target = fs.readFileSync(`${this.path}${file}`); target = JSON.parse(target); target = target[0];
                 if(target[element.name] && target[element.name] == element.content) {
                   fs.rm(`${this.path}${file}`); 
                    this.feedback == true ? console.log("Successfully deleted 1 document.") : "";
                 }
              })
          } else if((element.name > 0 && !element.content) || (!element.name && !element.content)){
           return console.error("Missing field when searching via elements. ('element.name' or 'element.content' is missing."); 
          } else {
            fs.rm(`${this.path}${data.id || data}.json`);
             this.feedback == true ? console.log("Successfully deleted 1 document.") : "";
          }
        } catch(err) {
            console.log("Error: " + err.message);
        }
    }
