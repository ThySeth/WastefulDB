/*
  ! THIS IS EXPERIMENTAL. TESTING IS REQUIRED AND MAY NOT FUNCTION AS INTENDED. !
   
    Update is meant to prevent duplicate files from being written over. New field will-
    be required in order to find the proper files to update. The field will be an "element".
    Element name or contents will work.
*/

insert(data) {
        if(!(data instanceof Object)) return new Error("Information given must be an Object."); if(!data.id) return new Error("Object requires identifier to name file.");
        try {
         let obj = [ data ];
          let dupecheck = {bool: false, count: 0};
          if(fs.exists(`${this.path}${data.id}.json`) == true) {
           fs.readdir(`${this.path}`).forEach(file => {
           if(dupecheck.bool == false && dupecheck.count > 0) return;
            let jsoned = fs.readFileSync(file); jsoned = JSON.parse(jsoned);
            if(jsoned.id != data.id) return;
             let duplicates = file.slice(0, (data.id).length).replace("-", "");
              if(duplicates == 0) return dupecheck = false;
               dupecheck.bool = true; dupecheck.count += 1;
               
              duplicates = parseInt(duplicates);
               data.id = data.id + "-" + duplicates+1;
                this.feedback == true ? console.log("Located duplicate file. New ID: " + data.id) : ""
              
              obj = JSON.stringify(obj);
               fs.writeFileSync(`${this.path}${data.id}.json`, obj);
                this.feedback == true ? console.log("Successfully created 1 document.") : "";
           })
          } else {
            obj = JSON.stringify(obj);
             fs.writeFileSync(`${this.path}${data.id}.json`, obj);
              this.feedback == true ? console.log("Successfully created 1 document.") : "";
          }
        }
        catch(err) {
            console.log(err.message);
        }
    }

update(data, extend) {
   if(!(data instanceof Object)) throw new Error("Object is required to update file."); if(!data.id || !data.element || !data.change) throw new Error("Unable to complete update due to misssing field(s) in Object."); (!data.math ? data.math = false : data.math);
      let obj;  
      try{
        if(fs.exists(`${this.path}${data.id}-1`) == true && extend.element == null) {
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
        } else {
         if(fs.exists(`${this.path}${data.id}-1`) == true && extend.element > 0) {
           let dirFiles = fs.readdirSync(`${this.path}`);
            dirFiles.forEach(file => {
             let dirfile = fs.readFileSync(file);
              dirfile = JSON.parse(dirfile); dirfile = dirfile[0];
               if(dirfile[extend.element] || dirfile[extend.element] == extend.element) {
                if(data.math == true) {
                 if(isNaN(parseInt(dirfile[data.element])) || isNaN(parseInt(data.change))) return console.log("Unable to update file due to given element or change returning NaN."); 
                  dirfile[data.element] = parseInt(dirfile[data.element] + (data.change));
                     obj = [ dirfile ]; obj = JSON.stringify(obj);
                      fs.writeFileSync(`${this.path}${file}`, obj);
                       this.feedback == true ? console.log(`Successfully updated 1 document. ${file}`) : "";
                }
               }
            })
         }
        }
        }catch(err){
            console.log(err.message);
        }
    }
