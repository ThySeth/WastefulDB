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
    fs.writeFile(`./data/${data.id}.json`, jsonify, (err) => {
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
    fs.readFile(`./data/${data.id}.json`, async(err, foo) => {
      if(err) throw err;
       let obj = JSON.parse(await foo);
        cb(obj.table[0]);
    })
  }

  search(data, caller) { // search("SessionToken", (res) => { console.log(res) });
    fs.readdir("./data/", (err, file) => {
     if(err) throw err;
       file.forEach(foo => {
         fs.readFile(`./data/${foo}`, (error, barr) => {
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

  delete(data) {
   fs.rm(`./data/${data.id}.json`, (err) => {
    if(err) throw err;
    if(this.feedback == true) {
      console.log("Removed 1 document.");
    }
   });
  }
  
}

module.exports.wastefuldb
