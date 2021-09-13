
    /**
     * 
     * @param {Object | String} [data] The identifier (aka name) of a file within the data file.
     * @param {Object} [element]
     * @argument {String} [element.name] The name of an element to search for and match the given "content".
     * @argument {String | Number} [element.content] The content to match with the given "element".  
     */

    delete(data, element = {name:undefined, content:undefined}) {
        try {
         if(!data && element.name != undefined && element.content != undefined) {
            fs.readdir(`${this.path}`, (error, files => {
              if(error) return console.log(`Error: ${error}`);
                files.forEach(file => {
                    let target = fs.readFileSync(file);
                     target = JSON.parse(target); target = target[0];
                      if(target[element.name] && target[element.name] == element.content) {
                          fs.rm(`${this.path}${file}`);
                           this.feedback == true ? console.log("Successfully deleted 1 document.") : ""
                      }
                })
            }))
         } else if(data || data.id) {
             fs.rm(`${this.path}${data || data.id}`);
              this.feedback == true ? console.log("Successfully deleted 1 document.") : ""
         } else {
             console.log("Missing variable(s). Provide an ID or an element 'name' and 'content'.");
         }
        }catch(err) {
            console.log(`Error: ${err}`);
        }
    }
