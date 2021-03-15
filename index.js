const fs = require('fs');

let object = {
    table: []
}

module.exports = class WastefulDB {
    constructor(options = {}) {
        this.feedback = options.feedback || false;
        this.serial = options.serial || false;
    }


    insert(data) {
        if(!(data instanceof Object)) return console.error("Data being inserted is not an Object.");
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


    insertMult(x, y, z) { // .insertMult({user: "Seth"}, {id: "001"}, {money: 106, purchases: 2});
    let xo = x instanceof Object; let yo = y instanceof Object; let zo = z instanceof Object;
   let fb = this.feedback
    if(xo) object.table.push(x); if(yo) object.table.push(y); if(zo) object.table.push(z);
      let id;
        if(xo && x.id) {
          id = x.id;
        } else if(yo && y.id) {
          id = y.id;
        } else if(zo && z.id) {
          id = z.id;
        } else { // *

            if(this.serial == true) {

                dirSize(`./node_modules/wastefuldb/data/`, function (data) {

                    try {
                        let jsoned = JSON.stringify(object, null, 2);
                         fs.writeFile(`./node_modules/wastefuldb/data/${data}.json`, jsoned, (err) => {
                             if(err) return err;
                         })
                         if(fb == true) {
                            console.log("Inserted 1 document.");
                        }
                    }
                    catch(e) {
                        console.log(e);
                    }

                })

            } else if(this.serial == false) {

                console.error("An identifier variable must be declared when inserting multiple objects.");

            }

        } // *

        if(id != null || undefined) {

            try {
                let jsoned = JSON.stringify(object, null, 2);
                 fs.writeFile(`./node_modules/wastefuldb/data/${id}.json`, jsoned, (err) => {
                   if(err) return err;
                 });
                 if(fb == true) {
                    console.log("Inserted 1 document.");
                }
              } catch(error) {
                console.log(`ERR:\n${error}`);
              }

        }

    }
    
    find(data, caller) {
        fs.readFile(`./node_modules/wastefuldb/data/${data.id || data}.json`, async(err, foo) => {
            if(!foo) return caller(null); // if(!res) return;
             if(err) return err;

            let obj = JSON.parse(foo);
             if((Object.keys(obj.table)).table > 1) {
                 caller(obj.table);
             } else {
                 caller(obj.table[0]);
             }
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
                    if(obj.length > 1) {
                        obj = obj.table;
                         if(obj.hasOwnProperty(data)) return caller(obj);
                    } else {
                        obj = obj.table[0];
                         if(obj.id == data) return caller(obj);
                    }
                 })
             })
        })
    }

    update(data) {
      let element = data.element; let change = data.change; let math = foo.math;
       if(!(data.id || element || change)) return console.error("Missing variable(s) while updating.");
       

        fs.readFile(`./node_modules/wastefuldb/data/${data.id}.json`, (data) => {
            if(!data) { // Begin searchUpdate function

                fs.readdir(`./node_modules/wastefuldb/data/`, (err, files) => {
                    if(err) return err;
                     files.forEach(res => {
                         fs.readFile(`./node_modules/wastefuldb/data/${res}`, (error, details) => {
                             if(error) return error;
                             let deets = JSON.parse(details);
                              if(deets.hasOwnProperty(data.id)) {
                                 let newton, jeff;

                                 if((Object.keys(deets.table)).length > 1) {
                                    newton = deets.table;

                                     for(let i = 0; i < (Object.keys(deets.table)).length; i++) {
                                        jeff = newton[i];

                                        if(!jeff[element]) {
                                            continue;
                                        } else {
                                            if(math == true) {
                                                if(isNaN(jeff[element] || change)) return console.error("Variable 'element' or 'change' is NaN.");
                                                let number = jeff[element];
                                                 jeff[element] = number + change;
                                            } else {
                                                jeff[element] = change;
                                            }

                                        }
                                     } // end for()

                                     for(let x = 0; x < (Object.keys(deets.table)).length; x++) {
                                         object.table.push(deets.table[x]);
                                     }
                                     let jsoned = JSON.stringify(object);
                                      fs.writeFile(`./node_modules/wastefuldb/data/${data.id}.json`, jsoned, (someErr) => {
                                          if(someErr) return someErr;
                                           if(this.feedback == true) {
                                               console.log("Updated 1 document.");
                                           }
                                      })

                                 } else {

                                    deets = data.table[0];

                                    if(math == true) {
                                        if(isNaN(deets[element] || change)) return console.error("Variable 'element' or 'change' is NaN.");
                                         let num = deets[element];
                                          deets[element] = num + change;
                                    } else {
                                        deets[element] = change;
                                    }

                                    object.table.push(deets);
                                     let jsonify = JSON.stringify(object);
                                     fs.writeFile(`./node_modules/wastefuldb/data/${data.id}`, jsonify, (e) => {
                                         if(e) return e;
                                          if(this.feedback == true) {
                                              console.log("Updated 1 document");
                                          }
                                     })

                                 }

                              } 

                         })
                     })
                })

            } else { // Regular update function

                data = JSON.parse(data);
                let nick, jake;
                 nick = data.table[0];

                 if(math == true) {
                     if(isNaN(nick[element] || change)) return console.error("Variable 'element' or 'change' is NaN.");
                      let num = nick[element];
                       nick[element] = num + change;
                 } else {
                     nick[element] = change;
                 }

                 object.table.push(nick);
                  let jsoned = JSON.stringify(object);

                fs.writeFile(`./node_modules/wastefuldb/data/${nick.id}.json`, jsoned, (errors) => {
                    if(errors) return errors;
                     if(this.feedback == true) {
                         console.log("Updated 1 document.");
                     }
                })

            }


        })
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

function dirSize(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if(err) return err;
         return callback(files.length);
    })
}

module.exports.wastefuldb;
