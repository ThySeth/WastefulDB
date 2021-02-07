searchUpdate(foo) {
  let element = foo.element; let change = foo.change; let math = foo.math; if(math != true || false) { math = false };
   if(!(foo.id || element || change)) return console.error("One or more variables missing."); 
  fs.readdir(`./node_modules/wastefuldb/data/`, (err, file) => {
    if(err) return err;
     file.forEach(res => { // result
      fs.readFile(`./node_modules/wastefuldb/data/${res}`, (error, bar) => {
        if(error) return error;
         let data = JSON.parse(bar);
         if((Object.keys(data.table)).length > 1) {
           let dog = data.table
        let cat;
          for(let i = 0; i < (Object.keys(data.table)).length; i++) {
            cat = dog[i];
          let c = cat["id"]
             if(c != foo.id) {
               continue;
             } else {
              
              for(let y = 0; y < (Object.keys(dog)).length; y++) {
              cat = dog[y];
              if(!cat[element]) {
                continue;
              } else {
   
              if(math == true) {
               if(isNaN(cat[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
               let number = jeff[element];
                cat[element] = number + change;
              } else {
                cat[element] = change;
              }
             }
              } // END for-loop ( y )
              for(let z = 0; z < (Object.keys(data.table)).length; z++) {
                object.table.push(data.table[z]);
              } // END for-loop ( z )
              let jsonified = JSON.stringify(object);
               fs.writeFile(`./node_modules/wastefuldb/data/${res}`, jsonified, (anotherError) => {
                 if(anotherError) return anotherError;
                  if(this.feedback == true) {
                    console.log("Found and updated 1 document.");
                  }
               })
             } // END else-statement for ID check
          } // END for-loop ( i )
         } else { // ELSE for single-insert files
          if(data.id == foo.id) {
            if(math == true) {
              if(isNaN(data[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
              let num = data[element];
               data[element] = num + change;
            } else {
              data[element] = change;
            }
            object.table.push(data);
             let jsoned = JSON.stringify(object);
              fs.writeFile(`./node_modules/wastefuldb/data/${res}`, jsoned, (finalError) => {
                if(finalError) return finalError;
                 if(this.feedback == true) {
                   console.log("Found and updated 1 document.");
                 }
              })
            }
         }
      })
     })
  })
}
