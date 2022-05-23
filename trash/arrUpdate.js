update(data = {id, key, child, change, math:false}, directory = {dir: this.path}) { 
        let obj, files;
         try {
            if(data.key == undefined || data.change == undefined) return console.error("You must provide information needed to update files."); // if function is empty
              if(data.id == undefined || data.key == undefined || data.change == undefined) return console.error("One or more fields is incomplete. ('id', 'key', and/or 'change').");
              data.id = (data.id).toString();
                let file = fs.readFileSync(`${directory.dir}${data.id}.json`); file = JSON.parse(file); 
                if(file.length > 1) { // If document was created by insertBulk()
                    let filt = file.findIndex(ob => ob[data.key] != undefined);
                     filt = filt >= 0 ? [file[filt]] : undefined;
                     if(!filt) { // Missing key if-else
                      if(data.key instanceof Array && data.change instanceof Array) {
                        if(key.length != change.length) return console.error("The amount of keys does not equal the amount of changes provided.");
                        filt = file;
                         for(let i = 0; i < (data.key).length; i++) {
                           (filt[file.length-1])[key[i]] = data.change[i];
                         }
                         obj = file; obj = JSON.stringify(obj);
                          fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                      } else {
                       filt = file;
                        (filt[file.length-1])[data.key] = data.change;
                           obj = file; obj = JSON.stringify(obj);
                            fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                      }
                     } else {
                        if(data.math == true) { // math = true?
                         if(data.child) { // data has a key-child?
                          if(data.key instanceof Array && data.child instanceof Array && data.change instanceof Array) {
                            
                            if((data.key).length == 1 && (data.child).length == 1) { // ex: key:["one"], child:["sub_one"], change:["one", "two"] -> update two keys in a child
                              for(let i = 0; i < (data.change).length; i++) {
                                if(isNaN(Number(((filt[0])[data.key[0]])[data.child[0]]) || isNaN(Number(data.change[i])))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                                ((filt[0])[data.key[0]])[data.child[0]] = Number(((filt[0])[data.key[0]])[data.child[0]]) + (Number(data.change[i]));
                                ((filt[0])[data.key[0]])[data.child[0]] = ((filt[0])[data.key[0]])[data.child[0]] % 1 != 0 ? parseFloat((((filt[0])[data.key[0]])[data.child[0]]).toFixed(2)) : ((filt[0])[data.key[0]])[data.child[0]];
                                 file = JSON.stringify(file);
                                  fs.writeFileSync(`${directory.dir}${data.id}.json`, file); 
                              }
                            } else if((data.key).length == 1 && (data.child).length == (data.change).length) { // ex: key:["one"], child: ["sub_one", "sub_two"], change: ["one", "two"]
                              for(let i = 0; i < (data.change).length; i++) {
                                if(isNaN(Number(((filt[0])[data.key[0]])[data.child[i]]) || isNaN(Number(data.change[i])))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                                ((filt[0])[data.key[0]])[data.child[i]] = Number(((filt[0])[data.key[0]])[data.child[i]]) + (Number(data.change[i]));
                                ((filt[0])[data.key[0]])[data.child[i]] = ((filt[0])[data.key[0]])[data.child[i]] % 1 != 0 ? parseFloat((((filt[0])[data.key[0]])[data.child[i]]).toFixed(2)) : ((filt[0])[data.key[0]])[data.child[i]];
                                 file = JSON.stringify(file);
                                  fs.writeFileSync(`${directory.dir}${data.id}.json`, file); 
                              }
                            } else if((data.key).length == (data.change).length && (data.child).length == (data.key).length) { // ex: key:["one", "two"], child: ["sub_one", "sub_two"], change: ["one", "two"] -> update multiple keys at the same time
                              for(let i = 0; i < (data.key).length; i++) {
                                if(isNaN(Number(((filt[0])[data.key[i]])[data.child[i]]) || isNaN(Number(data.change[i])))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                                ((filt[0])[data.key[i]])[data.child[i]] = Number(((filt[i])[data.key[i]])[data.child[i]]) + (Number(data.change[i]));
                                ((filt[0])[data.key[i]])[data.child[i]] = ((filt[0])[data.key[i]])[data.child[i]] % 1 != 0 ? parseFloat((((filt[0])[data.key[i]])[data.child[i]]).toFixed(2)) : ((filt[0])[data.key[i]])[data.child[i]];
                                 file = JSON.stringify(file);
                                  fs.writeFileSync(`${directory.dir}${data.id}.json`, file); 
                              }
                            } else {
                              return console.error("Unable to update file likely due to one or more arguments being unequal.");
                            }

                          } else {
                            if(isNaN(Number(((filt[0])[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                             ((filt[0])[data.key])[data.child] = Number(((filt[0])[data.key])[data.child]) + (Number(data.change));
                             ((filt[0])[data.key])[data.child] = ((filt[0])[data.key])[data.child] % 1 != 0 ? parseFloat((((filt[0])[data.key])[data.child]).toFixed(2)) : ((filt[0])[data.key])[data.child];
                              file = JSON.stringify(file);
                               fs.writeFileSync(`${directory.dir}${data.id}.json`, file); 
                          }
                         } else { // no child
                          if(data.key instanceof Array && data.child instanceof Array && data.change instanceof Array) { // Has arrays
                            
                            if((data.key).length == 1 && (data.key).length < (data.change).length) { // ex: key:["one"], change:["one", "two"] -> update two values in a key
                              for(let i = 0; i < (data.change).length; i++) {
                                if(isNaN(Number((filt[0])[data.key[0]])) || isNaN(Number(data.change[i]))) return console.error("Unable to update file due to given key or change returning NaN.");
                                (filt[0])[data.key[0]] = Number((filt[0])[data.key[0]]) + (Number(data.change[i]));
                                (filt[0])[data.key[0]] = (filt[0])[data.key[0]] % 1 != 0 ? parseFloat(((filt[0])[data.key[0]]).toFixed(2)) : (filt[0])[data.key[0]];
                              file = JSON.stringify(file);
                               fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                              }
                            } else if((data.key).length == (data.change).length) { // ex: key:["one", "two"], change: ["one", "two"] -> update multiple keys at the same time
                              for(let i = 0; i < (data.key).length; i++) {
                                if(isNaN(Number((filt[0])[data.key[i]])) || isNaN(Number(data.change[i]))) return console.error("Unable to update file due to given key or change returning NaN.");
                                (filt[0])[data.key[i]] = Number((filt[0])[data.key[i]]) + (Number(data.change[i]));
                                (filt[0])[data.key[i]] = (filt[0])[data.key[i]] % 1 != 0 ? parseFloat(((filt[0])[data.key[i]]).toFixed(2)) : (filt[0])[data.key[i]];
                                  file = JSON.stringify(file);
                               fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                              }
                            } else {
                              return console.error("Unable to update file likely due to one or more arguments being unequal.");
                            }

                          } else { // No arrays
                            if(isNaN(Number((filt[0])[data.key])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given key or change returning NaN.");
                            (filt[0])[data.key] = Number((filt[0])[data.key]) + (Number(data.change));
                            (filt[0])[data.key] = (filt[0])[data.key] % 1 != 0 ? parseFloat(((filt[0])[data.key]).toFixed(2)) : (filt[0])[data.key];
                              file = JSON.stringify(file);
                               fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                          }
                         }
                        } else { // math = false?
                            if(data.child) { // data has a key-child?

                              if(data.key instanceof Array && data.child instanceof Array && data.change instanceof Array) { // Has array
                                if((data.key).length == 1 && (data.child).length == 1) { // ex: key:["one"], child:["sub_one"], change:["one", "two"] -> update two keys in a child
                                  for(let i = 0; i < (data.change).length; i++) {
                                    ((filt[0])[data.key[0]])[data.child[0]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                                       data.change[i] == "undefined" ? delete ((filt[0])[data.key[0]])[data.child[0]] : "";  
                                        file = JSON.stringify(file);
                                    fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                                  }
                                } else if((data.key).length == (data.change).length && (data.child).length == (data.key).length) { // ex: key:["one", "two"], child: ["sub_one", "sub_two"], change: ["one", "two"] -> update multiple keys at the same time
                                  for(let i = 0; i < (data.change).length; i++) {
                                    ((filt[0])[data.key[i]])[data.child[i]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                                       data.change[i] == "undefined" ? delete ((filt[0])[data.key[i]])[data.child[i]] : "";  
                                        file = JSON.stringify(file);
                                    fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                                  }
                                } else {
                                  return console.error("Unable to update file likely due to one or more arguments being unequal.");
                                }

                              } else { // No arrays

                                ((filt[0])[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                               data.change == "undefined" ? delete ((filt[0])[data.key])[data.child] : "";  
                                file = JSON.stringify(file);
                                  fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                              }
                            } else {
                              if(data.key instanceof Array && data.change instanceof Array) {
                                if((data.key).length == 1 && (data.key).length < (data.change).length) { // one key, several updates
                                  for(let i = 0; i < (data.change).length; i++) {
                                    (filt[0])[data.key[0]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                                    data.change[i] == "undefined" ? delete (filt[0])[data.key[0]] : "";
                                    file = JSON.stringify(file);
                                    fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                                  }
                                } else if((data.key).length == (data.change).length) {
                                  for(let i = 0; i < (data.change).length; i++) {
                                    (filt[0])[data.key[i]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                                    data.change[i] == "undefined" ? delete (filt[0])[data.key[i]] : "";
                                    file = JSON.stringify(file);
                                    fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                                  }
                                } else {
                                  return console.error("Unable to update file likely due to an uneven amount of key or change variables.");
                                }
                              } else {// no array
                                (filt[0])[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                                data.change == "undefined" ? delete (filt[0])[data.key] : "";
                                 file = JSON.stringify(file);
                                  fs.writeFileSync(`${directory.dir}${data.id}.json`, file);
                              }
                            }
                        }
                     }
                     this.feedback == true ? console.log("Successfully updated 1 bulk document.") : null;
                } else { 

                  // If document was created with insert()

                file = file[0];
                 if(file[data.key] == null || undefined) { // Insert new field if the provided key does not exist
                  file[data.key] = data.change;
                   obj = [ file ]; obj = JSON.stringify(obj);
                    fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                 } else { // If key exists:
                  if(data.math == true) { // If math is set to true: 
                   if(data.child) {

                    if(data.key instanceof Array && data.child instanceof Array && data.change instanceof Array) {
                      if((data.key).length == 1 && (data.child).length == 1) {
                        for(let i = 0; i < (data.change).length; i++) {
                          if(isNaN(Number((file[data.key[0]])[data.child[0]]) || isNaN(Number(data.change[i])))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                          (file[data.key[0]])[data.child[0]] = Number((file[data.key[0]])[data.child[0]]) + (Number(data.change[i]));
                          (file[data.key[0]])[data.child[0]] = (file[data.key[0]])[data.child[0]] % 1 != 0 ? parseFloat(((file[data.key[0]])[data.child[0]]).toFixed(2)) : (file[data.key[0]])[data.child[0]];
                          obj = [ file ]; obj = JSON.stringify(obj);
                         fs.writeFileSync(`${directory.dir}${file}`, obj);
                        }
                      } else if((data.key).length == 1 && (data.child).length == (data.change).length) { // key:["one"], child:["sub_one", "sub_two"], change:["one", "two"]
                        for(let i = 0; i < (data.change).length; i++) {
                          if(isNaN(Number((file[data.key[0]])[data.child[i]]) || isNaN(Number(data.change[i])))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                          (file[data.key[0]])[data.child[i]] = Number((file[data.key[0]])[data.child[i]]) + (Number(data.change[i]));
                          (file[data.key[0]])[data.child[i]] = (file[data.key[0]])[data.child[i]] % 1 != 0 ? parseFloat(((file[data.key[0]])[data.child[i]]).toFixed(2)) : (file[data.key[0]])[data.child[i]];
                          obj = [ file ]; obj = JSON.stringify(obj);
                         fs.writeFileSync(`${directory.dir}${file}`, obj);
                        }
                      } else if((data.key).length == (data.child).length && (data.key).length == (data.change).length) {
                        for(let i = 0; i < (data.change).length; i++) {
                          if(isNaN(Number((file[data.key[i]])[data.child[i]]) || isNaN(Number(data.change[i])))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                          (file[data.key[i]])[data.child[i]] = Number((file[data.key[i]])[data.child[i]]) + (Number(data.change[i]));
                          (file[data.key[i]])[data.child[i]] = (file[data.key[i]])[data.child[i]] % 1 != 0 ? parseFloat(((file[data.key[i]])[data.child[i]]).toFixed(2)) : (file[data.key[i]])[data.child[i]];
                          obj = [ file ]; obj = JSON.stringify(obj);
                         fs.writeFileSync(`${directory.dir}${file}`, obj);
                        }
                      } else {
                        return console.error("Unable to update file likely due to one or more arguments being unequal.");
                      }

                    } else { // Not an array -> update w/ child and math

                    if(isNaN(Number((file[data.key])[data.child]) || isNaN(Number(data.change)))) return console.error("Unable to update file due to given key, key's child, or change returning NaN.");
                    (file[data.key])[data.child] = Number((file[data.key])[data.child]) + (Number(data.change));
                    (file[data.key])[data.child] = (file[data.key])[data.child] % 1 != 0 ? parseFloat(((file[data.key])[data.child]).toFixed(2)) : (file[data.key])[data.child];
                     obj = [ file ]; obj = JSON.stringify(obj);
                      fs.writeFileSync(`${directory.dir}${file}`, obj);
                    }
                   } else { // -> update WITH math NO child
                  if(data.key instanceof Array && data.change instanceof Array) {
                   if((data.key).length == (data.change).length) {
                    for(let i = 0; i < (data.change).length; i++) {
                      if(isNaN(Number(file[data.key[i]])) || isNaN(Number(data.change[i]))) return console.error("Unable to update file due to given key or change returning NaN.");
                      file[data.key[i]] = Number(file[data.key[i]]) + (Number(data.change[i]));
                      file[data.key[i]] = file[data.key[i]] % 1 != 0 ? parseFloat((file[data.key[i]]).toFixed(2)) : file[data.key[i]];
                       obj = [ file ]; obj = JSON.stringify(obj);
                        fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                    }
                   } else { 
                     return console.error("Unable to update file likely due to one of the arguments being unequal.");
                   }
                    } else { // NO array
                      if(isNaN(Number(file[data.key])) || isNaN(Number(data.change))) return console.error("Unable to update file due to given key or change returning NaN.");
                      file[data.key] = Number(file[data.key]) + (Number(data.change));
                      file[data.key] = file[data.key] % 1 != 0 ? parseFloat((file[data.key]).toFixed(2)) : file[data.key];
                       obj = [ file ]; obj = JSON.stringify(obj);
                        fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                    }
                   }
                 } else { // NO math
                    if(data.child) {
                      if(data.key instanceof Array && data.child instanceof Array && data.change instanceof Array) {
                        if((data.key).length == 1 && (data.child).length == (data.change).length) {
                          for(let i =0; i < (data.change).length; i++) {
                            (file[data.key[0]])[data.child[i]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                            data.change[i] == "undefined" ? delete (file[data.key[0]])[data.child[i]] : "";
                            obj = [file]; obj = JSON.stringify(obj);
                              fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                          }
                        } else if((data.key).length == 1 && (data.child).length == 1) {
                          for(let i =0; i < (data.change).length; i++) {
                            (file[data.key[0]])[data.child[0]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                            data.change[i] == "undefined" ? delete (file[data.key[0]])[data.child[0]] : "";
                            obj = [file]; obj = JSON.stringify(obj);
                              fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                          }
                        } else if((data.key).length == (data.child).length && (data.child).length == (data.change)) {
                          for(let i =0; i < (data.change).length; i++) {
                            (file[data.key[i]])[data.child[i]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                            data.change[i] == "undefined" ? delete (file[data.key[i]])[data.child[i]] : "";
                            obj = [file]; obj = JSON.stringify(obj);
                              fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                          }
                        }
                      } else { // NO array
                        (file[data.key])[data.child] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                        data.change == "undefined" ? delete (file[data.key])[data.child] : "";
                          obj = [file]; obj = JSON.stringify(obj);
                              fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                      }
                    } else { // NO child
                  if(data.key instanceof Array && data.change instanceof Array) {
                    if((data.key).length == (data.change).length ) {
                      for(let i =0; i < (data.change).length; i++) {
                        file[data.key[i]] = (data.change[i] == "true" ? true : data.change[i] == "false" ? false : data.change[i]);
                        data.change[i] == "undefined" ? delete file[data.key[i]] : "";
                        obj = [ file ]; obj = JSON.stringify(obj);
                       fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                      }
                    } else {
                      return console.error("Unable to update file due to 'key' and 'change' not being even.");
                    }
                  } else { // NO array
                   file[data.key] = (data.change == "true" ? true : data.change == "false" ? false : data.change);
                   data.change == "undefined" ? delete file[data.key] : "";
                    obj = [ file ]; obj = JSON.stringify(obj);
                     fs.writeFileSync(`${directory.dir}${data.id}.json`, obj);
                     }
                   }
                  }
                }
              this.feedback == true ? console.log("Successfully updated 1 document.") : "";
              }
         }catch(err){
            if(this.kill == true) {
                throw new Error(err.message);
            }else{
             console.error("Error: " + err.message);
            }
         }
    }
