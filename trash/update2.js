let object = {
  table: []
}

update(foo) { // update({id: "Xv5312", element: "name", change: "Neil", math: false});
  let element = foo.element; let change = foo.change; foo.math = foo.math || true;
   if(!(foo.id || element || change)) return console.error("One or more variables missing."); if(math != true || false) return console.error("Variable 'math' is boolean only.");
    
    fs.readFile(`./node_modules/wastefuldb/data/${foo.id}.json`, (err, data) => {
     if(err) throw err;
      data = JSON.parse(data); data = data.table[0];
       
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
          if(error) throw error;
           if(this.feedback == true) {
            console.log("Updated 1 document.");   
           }
       })
    })
    
}



/*
// Adapted from:

const object = {
  "table": [
    {
      "id": "Xv5312",
      "name": "Seth",
      "age": 22,
      "money": 25,
      "example": true
    }
  ]
}

const template = {
    table: []
}

function edit(element, update) {

let foo = JSON.stringify(object);
foo = JSON.parse(foo);

let bar = foo.table[0];

console.log(bar);
console.log(bar[element]);
 bar[element] = update;
 
 console.log(bar);
  template.table.push(bar);
  console.log(template);
}

edit("name", "Leo");
*/


searchUpdate(id, element, change, math = true) { // searchUpdate("Xv5312", "name", "Nial", false);
   if(!(id || element || change)) return console.error("One or more variables missing."); if(math != true || false) return console.error("Variable 'math' is boolean only.");
    
    fs.readdir(`./node_modules/wastefuldb/data/`, (err, file) => {
      if(err) throw err;  
       file.forEach(foo => {
        fs.readFile(`./node_modules/wastefuldb/data/${file}`, (error, bar) => {
         if(error) throw error;
          let res = JSON.parse(bar); res = res.table[0];
            if(res == null || undefined) return;
            
            if(res.id == id) {
              
              if(math == true) {
               if(isNaN(res[element]) || change) return console.error("Variable 'element' or 'change' returned NaN.");
               let num = res[element];
                res[element] = num + change;
              } else {
               res[element] = change;   
              }
                
                object.table.push(res);
                 let jsonified = JSON.stringify(res);
                  fs.writeFile(`./node_modules/wastefuldb/data/${file}`, (anotherError) => {
                   if(anotherError) throw anotherError;
                    if(this.feedback == true) {
                     console.log("Found and updated 1 document.");   
                    }
                  })
                
            } else {
              if(this.feedback == true) {
               console.log("No documents were found.");   
              }
            }
       })
    })
    
}
