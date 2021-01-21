insert(data) {
   if(this.serial == true) {
    if(!data.id) {
     fs.readdir("./data/", (err, file) => {
        let fsize = file.length; let asize = data.length;
         let serialize = {id: fsize};
        data.push(serialize);
     })
    }
   }
   if(!data.id) return console.error("Missing \"id\" variable.");
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
