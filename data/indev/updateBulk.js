/**
     * @param {String} id The identifier of the file to be updated.
     * @param {Array} data An **Array** which should contain Objects following the same pattern as `.update()`.
     *
     * @example > db.updateBulk("4", [ {key: "age", change: 2, math: true}, {key: "name", change: "Michael"} ]);
     */

    updateBulk(id, data = [], directory = {dir: this.path}) {
      if(!id || !data instanceof Array || data.length <= 1) return console.log("You are missing an identifier or you have only specified one object in an array while 2 or more are needed.");
     try { 
     let file = fs.readFileSync(`${directory.dir}${id}.json`);
      file = JSON.parse(file);
      // FILE IDENTIFY AS ARRAY ---->
      if(file.length > 1) {
       let filtering = file.findIndex(obj => obj[data.key] != undefined);
        filtering = filtering >= 0 ? [file[filtering]] : undefined;
        if(!filtering) { // Missing key if-else
           (filtering[0])[data.key] = data.change;
              obj = [file]; obj = JSON.stringify(obj);
               fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
        } else { // Do more work
          
        }
      } else {// <---- FILE IDENTIFY AS ARRAY



      }
     } catch(err) {
       if(this.kill == true) {
         throw new Error(err.message);
       } else {
        return console.log("Err: " + err.message);
       }
     }
    }
