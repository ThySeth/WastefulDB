let object = {
  table: []
}

update(foo) { // foo.id, foo.element, foo.change, foo.math
  let element = foo.element; let change = foo.change;
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
