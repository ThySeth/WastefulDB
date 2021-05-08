insertMult(x, y, z) { // .insertMult({user: "Seth"}, {id: "001"}, {money: 106, purchases: 2});
    let xo = x instanceof Object; let yo = y instanceof Object; let zo = z instanceof Object;
    let object = {
        table: []
    }
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


update(data = {id, element, change, math: false}) {
        const id = data.id; const element = data.element; const change = data.change; const math = data.math;
        let object = {
            table: []
        }
        /// pre-defined variables
        let parsed;
        let temp; let temp2;
        ///
         if(fs.existsSync(`./node_modules/wastefuldb/data/${id}.json`) == true) { 
            fs.readFile(`./node_modules/wastefuldb/data/${id}.json`, (err, file) => {
             if(err) return err;
              parsed = JSON.parse(file);
                //// multiple
                if((Object.keys(parsed.table)).length > 1) {
                 temp = parsed.table;
                 for(let i = 0; i < (Object.keys(parsed.table)).length; i++) {
                    temp2 = temp[i];
                    if(!temp2[element]) {
                        continue;
                    } else {
                        if(math == true) {
                            if(isNaN(temp2[element] || change)) return console.error("Variable 'element' or 'change' is NaN.");
                            let number = temp2[element];
                            temp2[element] = number + change;
                        } else {
                            temp2[element] = change;
                        }

                    }
                 } // end for()

                 for(let x = 0; x < (Object.keys(parsed.table)).length; x++) {
                     object.table.push(parsed.table[x]);
                 }
                 let jsoned = JSON.stringify(object);
                  fs.writeFile(`./node_modules/wastefuldb/data/${data.id}.json`, jsoned, (someErr) => {
                      if(someErr) return someErr;
                       if(this.feedback == true) {
                           console.log("Updated 1 document.");
                       }
                  })
                //// end multiple
                } else {
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
                }
                
            })
         } else { 
            console.error("File does not exist.");
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


function dirSize(dir, callback) {
    fs.readdir(dir, (err, files) => {
        if(err) return err;
         return callback(files.length);
    })
}
