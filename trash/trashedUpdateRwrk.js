// key == object ?
    //  - key.parent {parent: "key", child: "key"}
    //  - key.child
    update(data = {id, key, change:"", math: false}, directory = {dir: this.path}) {
        try {
          if(!data.id) return console.log("Unable to find any documents because an 'id' key and value has not been declared.");
            if(!data.key || (!(data.key.parent) && !(data.key.child))) return console.log("Cannot update any documents becaues a target key must be provided in the 'key' key.");
              if(!data.change) return console.log("Unable to update any documents becase the 'change' key has not been declared.");
                data.id = (data.id).toString();
            let obj, file = fs.readFileSync(`${directory.dir}${data.id}.json`); file = JSON.parse(file);
              if(data.key.child && !data.key.parent) return console.log("Unable to update any documents because a 'key.parent' key has not been declared but 'key.child' has.");
            if(file.length > 1) { // The document was made with `.insertBulk()`
              console.log(1);
              let filt = file.findIndex(ob => {(data.key.child > 0 ? (ob[data.key.parent])[data.key.child] : ob[(data.key.parent || data.key)]) != undefined});
              console.log(filt);
              filt = filt >= 0 ? [file[filt]] : undefined;
              console.log(2)
                if(!filt) {
                    filt = file;
                      data.key.child ? (filt[file.length-1][data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)] = data.change;
                        obj = file; obj = JSON.stringify(obj, null, 3);
                } else {
                    if(data.math == true) {
                      if(isNaN(Number((data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)]))) || isNaN(Number(data.change))) return console.log("Unable to update document due to a given key or change returning NaN.");
                        data.change = Number(data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)]) + Number(data.change);
                        data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)] = data.change;
                        data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)] = data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)] % 1 != 0 ? parseFloat((data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)]).toFixed(2)) : (data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)]);
                        file = JSON.stringify(file, null, 3);
                            fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                    } else {
                      data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                        data.change == "undefined" ? delete (data.key.child ? (filt[data.key.parent])[data.key.child] : filt[(data.key.parent || data.key)]) : "";
                          file = JSON.stringify(file, null, 3);
                            fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                    }
                }
                this.feedback == true ? console.log("Successfully updated 1 bulk document.") : "";
                this.log == true ? Logger(`[ ${new Date()} - update() ] File "${data.id}" was successfully updated.`) : ""
            } else { // The document was made with `.insert()`
              file = file[0];
                if(!(data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)])) {
                  data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)] = data.change;
                    obj = [ file ]; obj = JSON.stringify(obj, null, 3);
                     fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                } else {
                  if(data.math == true) {
                    if(data.math == true) {
                      if(isNaN(Number((data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)]))) || isNaN(Number(data.change))) return console.log("Unable to update document due to a given key or change returning NaN.");
                        data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)] = Number((data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)])) + Number(data.change);
                        data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)] = (data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)]) % 1 != 0 ? parseFloat((data.key.child ? (filt[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)]).toFixed(2)) : (data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)]);
                          file = JSON.stringify(file, null, 3);
                            fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                    } else {
                      data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                        data.change == "undefined" ? delete (data.key.child ? (file[data.key.parent])[data.key.child] : file[(data.key.parent || data.key)]) : "";
                          file = JSON.stringify(file, null, 3);
                            fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                    }
                  }
                }
              this.feedback == true ? console.log("Successfully updated 1 document.") : "";
              this.log == true ? Logger(`[ ${new Date()} - update() ] File "${data.id}" was successfully updated.`) : ""
            }
        } catch(err) {
          this.log == true ? Logger(`[ ${new Date()} - ERROR ] An error was encountered while performing "update()"!`) : ""
          if(this.kill) {
            throw new Error(err);
          } else {
            return console.log(err);
          }
        }
    }
