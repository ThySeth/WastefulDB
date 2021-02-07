const { CallTracker } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const { callbackify } = require('util');
const fsPromises = require('fs').promises;

let object = {
  table: []
}

let obj = 

module.exports = class WastefulDB {
 constructor(feedback = false) {
   this.feedback = feedback;
 }
  insert(data) {
   object.table.push(data); // .insert({id: "001", name: "Seth", dob: "3/20/**, money: 25"});
   try {
    let jsonify = JSON.stringify(object, null, 2);
    fs.writeFile(`./node_modules/wastefuldb/data/${data.id}.json`, jsonify, (err) => {
        if(err) return err;
    });
     if(this.feedback == true) {
       console.log("Inserted 1 document.");
     }
   }
   catch(err) {
    console.log("ERR:\n" + err);
   }
  }

  insertMult(x, y, z) { // .insertMult({user: "Seth"}, {id: "001"}, {money: 106, purchases: 2});
    if(x instanceof Object) object.table.push(x); if(y instanceof Object) object.table.push(y); if(z instanceof Object) object.table.push(z);
    let id = x.id || y.id || z.id; if(!id) return console.error("An identifier must be declared in order to insert multiple objects.");
     try {
       let jsoned = JSON.stringify(object, null, 2);
        fs.writeFile(`./node_modules/wastefuldb/data/${id}.json`, jsoned, (err) => {
          if(err) return err;
        });
     } catch(error) {
       console.log(`ERR:\n${error}`);
     }
  }
  
  find(data, cb) { // .find({id: "1"});
    fs.readFile(`./node_modules/wastefuldb/data/${data.id}.json`, async(err, foo) => {
     if(!foo) return cb(null);
      if(err) return err;
       let obj = JSON.parse(await foo);
       if((Object.keys(obj.table)).length > 1) {
         cb(obj.table);
       } else {
        cb(obj.table[0]);
       }
    })
  }

  search(data, caller) { // search("Identifier", (res) => { console.log(res) });
    fs.readdir("./node_modules/wastefuldb/data/", (err, file) => {
     if(err) return err;
       file.forEach(foo => {
         fs.readFile(`./node_modules/wastefuldb/data/${foo}`, (error, barr) => {
           if(error) return error;
           let obj = JSON.parse(barr); 
           if(obj == undefined || null) return;
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

  update(foo) { // update({id: "Xv5312", element: "name", change: "Neil"});
  let element = foo.element; let change = foo.change; let math = foo.math;
   if(!(foo.id || element || change)) return console.error("One or more variables missing."); if(math != true || false) { math = false }
    
    fs.readFile(`./node_modules/wastefuldb/data/${foo.id}.json`, (err, data) => {
    if(!data) return console.error(`Nothing was found for: ` + foo.id);
     if(err) return err;
      data = JSON.parse(data); 

    let newton, jeff;
      if((Object.keys(data.table)).length > 1) {
        newton = data.table;
         
        for(let i = 0; i < (Object.keys(data.table)).length; i++) {
          jeff = newton[i];

           if(!jeff[element]) {
             continue;
           } else {

           if(math == true) {
            if(isNaN(jeff[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
            let number = jeff[element];
             jeff[element] = number + change;
           } else {
             jeff[element] = change;
           }
          }
        }// END for-loop
        
        for(let x = 0; x < (Object.keys(data.table)).length; x++) {
          object.table.push(data.table[x]);
        }
         let jsonified = JSON.stringify(object);
        fs.writeFile(`./node_modules/wastefuldb/data/${foo.id}.json`, jsonified, (error) => {
          if(error) return error;
           if(this.feedback == true) {
             console.log("Updated 1 document.");
           }
        })

      } else {
      
      data = data.table[0];
       
       if(math == true) {
        if(isNaN(data[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
          let num = data[element];
        data[element] = num + change;
       } else {
        data[element] = change;
       }
        
       object.table.push(data);
        let jsoned = JSON.stringify(object);
       fs.writeFile(`./node_modules/wastefuldb/data/${foo.id}.json`, jsoned, (error) => {
          if(error) return error;
           if(this.feedback == true) {
            console.log("Updated 1 document.");   
           }
       })
      }
    })
    
}


searchUpdate(foo) { 
  let element = foo.element; let change = foo.change; let math = foo.math;
   if(!(foo.id || element || change)) return console.error("One or more variables missing."); if(math != true || false) { math = false }
    
    fs.readdir(`./node_modules/wastefuldb/data/`, (err, file) => {
      if(err) return err;

       file.forEach(res => {
        fs.readFile(`./node_modules/wastefuldb/data/${res}`, (error, bar) => {
          if(error) return error;
           let data = JSON.parse(bar); data = data.table[0];
            if(data.id != foo.id || !data) return;

            if(data.id == foo.id) {
             if(math == true) {
              if(isNaN(data[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");

              let num = parseInt(data[element]);
               data[element] = num + (parseInt(change));
             } else {
              data[element] = change;
             }

             object.table.push(data);
              let jsoned = JSON.stringify(object);
            fs.writeFile(`./node_modules/wastefuldb/data/${res}`, jsoned, (anotherError) => {
              if(anotherError) return anotherError;
               if(this.feedback == true) {
                 console.log("Found and updated 1 document.");
               }
            })

            }
        })

       })
    })
    
  }

  delete(data) {
   fs.rm(`./node_modules/wastefuldb/data/${data.id || data}.json`, (err) => {
    if(err) return err;
    if(this.feedback == true) {
      console.log("Removed 1 document.");
    }
   });
  }
  
}

module.exports.wastefuldb
