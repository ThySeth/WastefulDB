

                fs.readdir(`./node_modules/wastefuldb/data/`, (err, files) => {
                    if(err) return err;
                    let __data;
                     files.forEach((_data) => {
                        __data = JSON.parse(_data);
                         if(Object.keys(__data).length > 1) { // IF insertMult()
                            for(let i = 0; i <= Object.keys(__data).length; i++) {
                                if(Object.keys(__data[i]).includes(id)) { // 
                                    _data = _data.table[0];
                                      if(math == true) {
                                        if(isNaN(_data[element] || change)) return console.error("Variable 'element' or 'change' returned NaN.");
                                          _data[i] = _data[element] + (change);
                                      } else if(math == false) {
                                          _data[i] = change;
                                      }
                                  } else {
                                      continue;
                                  } 
                            } // END ForLoop
                         }
                     })
                })
