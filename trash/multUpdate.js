update(foo) { // update({id: "Xv5312", element: "name", change: "Neil", math: false});
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
