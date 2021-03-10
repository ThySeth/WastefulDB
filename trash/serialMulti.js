insertMult(x, y, z) {
    if(x instanceof Object) object.table.push(x); if(y instanceof Object) object.table.push(y); if(z instanceof Object) object.table.push(z);
    let id;
    if(!x.id || y.id || z.id) {
       if(this.serial == true) {
           
           dirSize(`./node_modules/wastefuldb/data/`, function (data) {
             id = data

             try {
                let jsoned = JSON.stringify(object, null, 2);
                 fs.writeFile(`./node_modules/wastefuldb/data/${id}.json`, jsoned, (err) => {
                   if(err) return err;
                 });
              } catch(error) {
                console.log(`ERR:\n${error}`);
              }
              
           })
       } else {
        return console.error("A variable must be declared first.");
       }
        
    } else {
        id = x.id || y.id || z.id;

        try {
            let jsoned = JSON.stringify(object, null, 2);
             fs.writeFile(`./node_modules/wastefuldb/data/${id}.json`, jsoned, (err) => {
               if(err) return err;
             });
          } catch(error) {
            console.log(`ERR:\n${error}`);
          }
    }
    
    
  }
