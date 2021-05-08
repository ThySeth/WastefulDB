const fs = require('fs');

module.exports = class WastefulDB {
    constructor(options = {}) {
        this.feedback = options.feedback || false;
        this.serial = options.serial || false;
    }


    insert(data) {
        if(!(data instanceof Object)) return console.error("Data being inserted is not an Object.");
        let object = {
            table: []
        }
        let jsonify;

         try {
           object.table.push(data);
            if(this.serial == true) {
            fs.readdir(`./node_modules/wastefuldb/data/`, (err, files) => {
              if(err) return err;
                let size = files.length;
                 object.table[0].id = size;
                 jsonify = JSON.stringify(object, null, 3);
                fs.writeFile(`./node_modules/wastefuldb/data/${size}.json`, jsonify, (error) => {
                    if(error) return error;
                })
            })
            } else if(this.serial == false) {
              if(!data.id) return console.error("Missing identifier in data object.");
               jsonify = JSON.stringify(object, null, 3);
                fs.writeFile(`./node_modules/wastefuldb/data/${data.id}.json`, jsonify, (anError) => {
                    if(anError) return anError;
                })
            }

            if(this.feedback == true) {
                console.log("Inserted 1 document.");
            }

         }
         catch(error) {
            console.log(error);
         }
    }
    
    find(data, caller) {
        fs.readFile(`./node_modules/wastefuldb/data/${data.id || data}.json`, async(err, foo) => {
            if(!foo) return caller(null); // if(!res) return;
             if(err) return err;

            let obj = JSON.parse(foo);
                 caller(obj.table[0]);
        })
    }

    search(data, caller) {
        fs.readdir(`./node_modules/wastefuldb/data/`, (err, files) => {
            if(err) return err;
             files.forEach(foo => {
                 fs.readFile(`./node_modules/wastefuldb/data/${foo}`, (error, bar) => {
                     if(error) return error;
                      let obj = JSON.parse(bar);
                       if(!obj) return;
                        obj = obj.table[0];
                         if(obj.id == data) return caller(obj);
                 })
             })
        })
    }


    update(data = {id, element, change, math: false}) {
        const id = data.id; const element = data.element; const change = data.change; const math = data.math;
        let object = {
            table: []
        }
        /// pre-defined variables
        let parsed;
        let temp;
        ///
        try {
         if(fs.existsSync(`./node_modules/wastefuldb/data/${id}.json`) == true) { 
            fs.readFile(`./node_modules/wastefuldb/data/${id}.json`, (err, file) => {
             if(err) return err;
              parsed = JSON.parse(file);
                //// multiple
                    parsed = parsed.table[0];
                     if(math == true) {
                         if(isNaN(parsed[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
                          parsed[element] = parsed[element] + (change);
                     } else {
                         parsed[element] = change;
                     }
                    object.table.push(parsed);
                     temp = JSON.stringify(object);
                      fs.writeFile(`./node_modules/wastefuldb/data/${id}.json`, temp, (error) => {
                          if(error) return error;
                           if(this.feedback == true) {
                               console.log("Updated 1 document.");
                           }
                      })
            })
         } else { 
            fs.readdir(`./node_modules/wastefuldb/data/`, (err, files) => {
                if(err) return err;
                 files.forEach(file => {
                    fs.readFile(`./node_modules/wastefuldb/data/${file}/`, (error, res) => {
                     if(error) return error;
                        let obj = JSON.parse(res);
                        if(!obj) return;
                         obj = obj.table[0];
                          if(obj.id == id)  {
                              if(math == true) {
                                  if(isNaN(obj[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
                                   obj[element] = obj[element] + (change);
                              } else {
                                  obj[element] = change;
                              }
                              object.table.push(obj);
                               temp = JSON.stringify(object);
                                fs.writeFile(`./node_modules/wastefuldb/data/${file}/`, temp, (finalErr) => {
                                    if(finalErr) return finalErr;
                                     if(this.feedback == true) {
                                         console.log("Updated 1 document.");
                                     }
                                });
                          }
                    })
                 })
            })
         }
        } catch(tryErr) {
            console.error(tryErr);
        }
    }

    size() {
        try {
        let files = fs.readdirSync(`./node_modules/wastefuldb/data/`);
         return files.length;
        }
        catch(err) {
            return err;
        }
    }

    check(data) {
        let chk = fs.existsSync(`./node_modules/wastefuldb/data/${data.id || data}.json`);
         if(chk) {
             return true;
         } else {
             return false;
         }
    }

    delete(data) {
        fs.rm(`./node_modules/wastefuldb/data/${data.id || data}.json`, (err) => {
            if(err) return err;
             if(this.feedback == true) {
                 console.log("Removed 1 document.");
             }
        })
    }


}

module.exports.wastefuldb;
