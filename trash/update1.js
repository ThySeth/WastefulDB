  update(data, element) {
    fs.readFile(`./data/${data}.json`, (error, foo) => {
      if(error) throw error;
      object.table.push(JSON.parse(foo));
      console.log(object.table[0].table[0]);
      foo = object.table[0].table[0]
       foo.splice(element.name, element.change);
       foo = object.table.push(JSON.parse(foo));
        fs.rm(`./data/${data}.json`);
        let result = JSON.stringify(foo);
         fs.writeFile(`./data/${data}.json`, result, (err) => {
           if(err) throw err;
         })
    })
  }
