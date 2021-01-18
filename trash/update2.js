update(queries) { // update({id: "001", element: "money", change: -10})
    queries.math = true;
     if(queries.math != true || false) return console.error(`"math" element is boolean only.`);
     if(!(queries.id || element || change)) return console.error(`"id", "element", or "change" is missing data.`);
     let update = 0;
    fs.readFile(`./data/${queries.id}.json`, (error, data) => {
      if(error) throw error;
       data = JSON.parse(data); data = data.table[0];
            console.log(data);
            foo.push(data);
        update = foo.indexOf(queries.element);
            console.log(update);
        if(queries.math == true) {
         data[update] = data[update] + queries.element
          console.log(data);
        } else {
         data[update] = queries.change;
        }
        update = foo.push(data); update = JSON.stringify(update);
        fs.writeFile(`./data/${queries.id}.json`, update, (err) => {
          if(err) throw err;
           if(this.feedback == true) {
            console.log("Updated 1 document.");
           }
        })
       
    })
  }
