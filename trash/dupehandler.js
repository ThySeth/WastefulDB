/*
  ! THIS IS EXPERIMENTAL. TESTING IS REQUIRED AND MAY NOT FUNCTION AS INTENDED. !
   
    Update is meant to prevent duplicate files from being written over. New field will-
    be required in order to find the proper files to update. The field will be an "element".
    Element name or contents will work.
*/

insert(data) {
        if(!(data instanceof Object)) return new Error("Information given must be an Object."); if(!data.id) return new Error("Object requires identifier to name file.");
         try {
            let obj;
             let dupecheck = {bool: false, count: 0};
              if(fs.existsSync(`${this.path}${data.id}.json`) == true) {
                console.log(1);
                  fs.readdir(`${this.path}`, (files) => {
                    console.log(2)
                    files.forEach(file => {
                      if(dupecheck.bool == false && dupecheck.count > 0) return;
                       let jsoned = fs.readFileSync(file); jsoned = JSON.parse(jsoned); jsoned = jsoned[0];
                        if(jsoned.id != data.id) return;
                         let duped = file.slice(0, (data.id).length).replace("-", "").replace(".json", "");
                          if(duped == 0) return dupecheck = false;
                           dupecheck.bool = true; dupecheck.count += 1;
                            duped = parseInt(duplicates);
                             data.id = data.id + "-" + duped+1;
                        obj = [ data ]; obj = JSON.stringify(obj);
                         fs.writeFileSync(`${this.path}${data.id}`, obj);
                          this.feedback == true ? console.log(`Successfully created 1 document. (${data.id}.json)`) : "";
                    })
                  })
              } else {
                obj = [ data ];
                obj = JSON.stringify(obj);
                 fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                 this.feedback == true ? console.log("Successfully created 1 document.") : "";
              }

         }catch(err){
             console.log(err.message);
         }
    }

    update(data, extend) {
        if(!(data instanceof Object)) throw new Error("Object is required to update file."); if(!data.id || !data.element || !data.change) return console.log("Unable to complete update due to misssing field(s) in Object."); (!data.math ? data.math = false : data.math);
         let obj;
          try {
             let dupefile;
             if(fs.existsSync(`${this.path}${data.id}-1.json`)) {
              if(extend.element > 0 && extend.content > 0) {
                fs.readdir(this.path, (files) => {
                    files.forEach(file => {
                        dupefile = JSON.parse(file); dupefile = dupefile[0];
                         if(dupefile[extend.element] && dupefile[extend.element] == extend.content) {
                            if(data.math == true) {
                                if(isNaN(parseInt(dupefile[data.element])) || isNaN(parseInt(data.change))) return console.log("Unable to update file. Given element or change returned NaN.");
                                 dupefile[data.element] = parseInt(dupefile[data.element]) + (parseInt(data.change));
                                  obj = [ dupefile ]; obj = JSON.stringify(obj);
                                  fs.writeFileSync(`${this.path}${file}`, obj);
                                  this.feedback == true ? console.log(`Successfully updated 1 document. (${file})`) : "";
                            } else {
                                dupefile[data.element] = data.change;
                                 obj = [ dupefile ]; obj = JSON.stringify(obj);
                                  fs.writeFileSync(`${this.path}${file}`, obj);
                                  this.feedback == true ? console.log(`Successfully updated 1 document. (${file})`) : "";
                            }
                         } else {
                             return;
                         }
                    })
                })
              } else if((extend.element > 0 && extend.content == null)) {
                  fs.readdir(this.path, (files) => {
                      files.forEach(file => {
                          dupefile = JSON.parse(file); dupefile = dupefile[0];
                           if(dupefile[extend.element]) {
                             if(data.math == true) {
                                if(isNaN(parseInt(dupefile[data.element])) || isNaN(parseInt(data.change))) return console.log("Unable to update file. Given element or change returned NaN.");
                                  dupefile[data.element] = parseInt(dupefile[data.element]) + (parseInt(data.change));
                                   obj = [ dupefile ]; obj = JSON.stringify(obj);
                                    fs.writeFileSync(`${this.path}${file}`, obj);
                                    this.feedback == true ? console.log(`Successfully updated 1 document. (${file})`) : "";
                             } else {
                                 dupefile[data.element] = data.change;
                                  obj = [ dupefile ]; obj = JSON.stringify(obj);
                                   fs.writeFileSync(`${this.path}${file}`, obj);
                                    this.feedback == true ? console.log(`Successfully updated 1 document. (${file})`) : "";
                             }
                             
                           } else {
                               return;
                           }
                      })
                  })
              } 
            } else {
                let file = fs.readFileSync(`${this.path}${data.id}.json`); file = JSON.parse(file); file = file[0];
                if(file[data.element] == null || undefined) { // Insert new field if the provided element does not exist
                  file[data.element] = data.change;
                   obj = [ file ]; obj = JSON.stringify(obj);
                    fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                } else { // If element exists:
                    if(data.math == true) { // If math is set to true: 
                      if(isNaN(parseInt(file[data.element])) || isNaN(parseInt(data.change))) return new Error("Unable to update file due to given element or change returning NaN.");
                       file[data.element] = parseInt(file[data.element] + (data.change));
                        obj = [ file ]; obj = JSON.stringify(obj);
                         fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                    } else { // If math is set to false:
                        file[data.element] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                         obj = [ file ]; obj = JSON.stringify(obj);
                          fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                    }
                }
                this.feedback == true ? console.log("Successfully updated 1 document.") : "";
            }

          } catch(err) {
              console.message(err);
          }
    }
