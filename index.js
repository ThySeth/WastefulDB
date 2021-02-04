const { CallTracker } = require('assert');
const fs = require('fs');
const { resolve } = require('path');
const { callbackify } = require('util');
const fsPromises = require('fs').promises;

let object = {
  table: []
}

let foo = [];

module.exports = class WastefulDB {
 constructor(feedback = false) {
   this.feedback = feedback;
 }
  insert(data) {
   object.table.push(data); // .insert({id: "001", name: "Seth", dob: "3/20/**, money: 25"});
   try {
    let jsonify = JSON.stringify(object, null, 2);
    fs.writeFile(`./node_modules/wastefuldb/data/${data.id}.json`, jsonify, (err) => {
        if(err) throw err;
    });
     if(this.feedback == true) {
       console.log("Inserted 1 document.");
     }
   }
   catch(err) {
    console.log("ERR:\n" + err);
   }
  }
  
  find(data, cb) { // .find({id: "1"});
    fs.readFile(`./node_modules/wastefuldb/data/${data.id}.json`, async(err, foo) => {
      if(err) throw err;
       let obj = JSON.parse(await foo);
        cb(obj.table[0]);
    })
  }

  search(data, caller) { // search("SessionToken", (res) => { console.log(res) });
    fs.readdir("./node_modules/wastefuldb/data/", (err, file) => {
     if(err) throw err;
       file.forEach(foo => {
         fs.readFile(`./node_modules/wastefuldb/data/${foo}`, (error, barr) => {
           if(error) throw error;
           let obj = JSON.parse(barr); 
           obj = obj.table[0];

           if(obj == undefined || null) return;

           if(obj.id == data) {
             caller(obj);
             return;
           }
         })
       })
    })
  }

  update(foo) { // update({id: "Xv5312", element: "name", change: "Neil", math: false});
  let element = foo.element; let change = foo.change; let math = foo.math;
   if(!(foo.id || element || change)) return console.error("One or more variables missing."); if(math != true || false) { math = false }
    
    fs.readFile(`./node_modules/wastefuldb/data/${foo.id}.json`, (err, data) => {
     if(err) throw err;
      data = JSON.parse(data); data = data.table[0];
       
       if(math == true) {
        if(isNaN(data[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
          let num = parseInt(data[element]);
        data[element] = num + (parseInt(change));
       } else {
        data[element] = change;
       }
        
       object.table.push(data);
        let jsoned = JSON.stringify(object);
       fs.writeFile(`./node_modules/wastefuldb/data/${foo.id}.json`, jsoned, (error) => {
          if(error) throw error;
           if(this.feedback == true) {
            console.log("Updated 1 document.");   
           }
       })
    })
    
  }

  searchUpdate(foo) { 
  let element = foo.element; let change = foo.change; let math = foo.math;
   if(!(foo.id || element || change)) return console.error("One or more variables missing."); if(math != true || false) { math = false }
    
    fs.readdir(`./node_modules/wastefuldb/data/`, (err, file) => {
      if(err) throw err;

       file.forEach(res => {
        fs.readFile(`./node_modules/wastefuldb/data/${res}`, (error, bar) => {
          if(error) throw error;
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
              if(anotherError) throw anotherError;
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
   fs.rm(`./node_modules/wastefuldb/data/${data.id}.json`, (err) => {
    if(err) throw err;
    if(this.feedback == true) {
      console.log("Removed 1 document.");
    }
   });
  }
  
}

module.exports.wastefuldb
