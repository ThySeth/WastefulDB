const fs = require('fs');
const { resolve } = require('path');
const fsPromises = require('fs').promises;

let object = {
  table: []
}

let foo;

module.exports = class WastefulDB {
  insert(data) {
   object.table.push(data); // .insert({id: "001", name: "Seth", dob: "3/20/**, money: 25"});
   try {
    let jsonify = JSON.stringify(object, null, 2);
    fs.writeFile(`./data/${data.id}.json`, jsonify, (err) => {
        if(err) throw err;
    });
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

  delete(data) {
   fs.rm(`./data/${data.id}.json`, (err) => {
    if(err) throw err;
   });
  }
  
}
