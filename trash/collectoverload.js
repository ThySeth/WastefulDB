collect(data) {
      if(!data) return;
        let obj = [];
         try {
            let files = fs.readdirSync(`${this.path}`);
             files.forEach(file => {
                 let target = fs.readFileSync(`${this.path}${file}`);
                  target = JSON.parse(target); target = target[0];
                   if(data.id && data.element == undefined) { // collect({id: });
                       if(target.id == data.id) return obj.push(target);
                   } else if(data.element && data.id == undefined) { // collect()
                        if(target[data.element]) return obj.push(target);
                   } else if(data.element && data.id) {
                         if(target.id == data.id && target[data.element]) return obj.push(target);
                   } else {
                       return;
                   }
             });
              return obj;
         }catch(err){
             console.log(err.message);
         }
    }
