const rl = require('readline');
const chalk = require("chalk");
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})
const Wasteful = require('./index.js');
const fs = require('fs');
const { WSAEINPROGRESS } = require('constants');
let config = fs.readFileSync("./config.json"); config = JSON.parse(config);

const db = new Wasteful({feedback: config.feed, path: config.path, serial: config.serial});

function wipe() {
    for(let i = 0; i < 50; i++) {
        console.log(" ");
    }
}

function configSetup() {
    wipe();
    readline.question(`${chalk.underline("Configurations")}\n1) Serialization ( ${chalk.cyan(config.serial)} )\n2) Feedback ( ${chalk.cyan(config.feed)} )\nType 'end' to exit.\n`, function(configCheck) {
        switch(configCheck) {
            case "1":
             //config.serial == false ? updates.push({serial: true}) : updates.push({serial: false});
             config.serial == false ? config.serial = true : config.serial = false;
              console.log(`Serialization: ${config.serial}`);
               configSetup();
            break;
            case "2":
             config.feed == false ? config.feed = true : config.feed = false;
              console.log(`Feedback: ${config.feed}`);
               configSetup();
            break;
            
            case "end":
             console.log("Exiting configuration setup...");
              fs.writeFileSync(`./config.json`, JSON.stringify(config));
               wipe();
                repeater();
            break;
        }
    });
}

function info() {
  wipe();
    readline.question(`${chalk.underline.green("WastefulDB Help / Info")}\n \n${chalk.yellow(">")} You can type ${chalk.green("end")} at any time during a process to return to the options menu.\n \n${chalk.yellow(">")} Enabling ${chalk.blue("serialization")} in the configuration automatically assigns identifiers to files so you don't have to.\nType 'end' to return to the menu.\n`, function (answer) {
        if(answer == "end") {
            return repeater();
        }
    })
}

function repeater () {
  wipe();
    readline.question(`${chalk.underline.green("WastefulDB's Beta Interface")}\n \n` + `${chalk.cyan("1")}) Configuration\n${chalk.cyan("2")}) Insert document\n${chalk.cyan("3")}) Find document\n${chalk.cyan("4")}) Update document\n${chalk.cyan("5")}) Help / Info\n`, function(answer) {
        switch(answer) {
            case "1":
             configSetup();
            break;
            case "2":
             insert();
            break;
            case "3":
             findSimple();
            break;
            case "4":
             update();
            break;
            case "5":
             info();
            break;
        }
        repeater();
    })
}

function update() {
  let updater = {}
  let fieldman = {}
    readline.question(`Which method do you wish to update the file? ${chalk.yellow("id")} or ${chalk.yellow("field")}?`, function(answer) {
    if(answer == "end") return repeater();
        if(answer == "id") {
            readline.question("Provide the identifier of the file you wish to update.\n", function(identifier) {
        if(identifier == "end") return repeater();
                updater["id"] = identifier;
                 readline.question(`${chalk.blue("ID:")} ${identifier}\nProvide the element within the file you wish to update.\n`, function(element) {
            if(element == "end") return repeater();
                    updater["element"] = element;
                     readline.question(`${chalk.blue("ID:")} ${identifier}\n${chalk.blue("Element:")} ${element}\nProvide the change you wish to make.\n`, function(change) {
                if(change == "end") return repeater();
                        updater["change"] = change;
                         readline.question(`${chalk.blue("ID:")} ${identifier}\n${chalk.blue("Element:")} ${element}\n${chalk.blue("Change:")} ${change}\nDoes this update require math? ${chalk.yellow("(y / n)")}\n`, function(math){
                             if(math == "y") {
                                 updater["math"] = true;
                                 console.log(updater)
                                 db.update(updater);
                                    repeater();
                             } else if(math == "n") {
                                 updater["math"] = false;
                                 console.log(updater)
                                 db.update(updater);
                                    repeater();
                             } else if(math == "end") {
                                 repeater();
                             }
                         }) 
                     })
                 })
            })
        } else if(answer == "field") {
            readline.question(`Provide the field ${chalk.underline("name")} contained within a file.\n`, function(searchName) {
        if(searchName == "end") return repeater();
                fieldman["name"] = searchName;
                 readline.question(`Provide the field's (${searchName}) ${chalk.underline("value")} attached to it.\n`, function(searchValue) {
            if(searchValue == "end") return repeater();
                     fieldman["content"] = searchValue;
                      readline.question(`Provide the element within the file you wish to update.\n`, function(element) {
                if(element == "end") return repeater();
                          updater["element"] = element
                           readline.question(`${chalk.blue("Element:")} ${element}\nProvide the change you wish to make.\n`, function(change) {
                    if(change == "end") return repeater();
                            updater["change"] = change;
                             readline.question(`${chalk.blue("Element:")} ${element}\n${chalk.blue("Change:")} ${change}\nDoes this update require math? (${chalk.yellow("(y / n)")})\n`, function(math) {
                                 if(math == "y") {
                                     updater["math"] = true;
                                     db.update(updater, fieldman);
                                        repeater();
                                 } else if(math == "n") {
                                     updater["math"] = false;
                                     db.update(updater, fieldman);
                                        repeater();
                                 } else if(math == "end") {
                                     return repeater();
                                 }
                             })
                           })
                      })
                 })
            })
        }
    })
}

function findSimple() {
    wipe();
     readline.question(`Provide the ${chalk.blue("identifier")} of the file!\n`, function(id) {
         if(id == "end") return repeater();
          let info = db.find(id);
           if(!info) {
                readline.question("Type 'end' to exit or type 'retry' to retry.\n", function(answer) {
                    if(answer == "end") {
                        repeater();
                    } else if(answer == "retry") {
                        findSimple();
                    }
                })
           } else {
               console.log(info);
               readline.question("Type 'end' to exit or type 'retry' to try another search.\n", function(answer) {
                   if(answer == "end") {
                       repeater();
                   } else if(answer == "retry") {
                       findSimple();
                   }
               })
           }
     })
}

let data = {}
function insert() {
  wipe();
  let finalizer;
   if(config.serial == false && (Object.keys(data)).includes("id") == false) {
       readline.question(`Provide your file's ${chalk.underline("unique")} identifier: `, function(identifier) {
         if(identifier == "end") return repeater();
           data["id"] = identifier
            insert();
       })
   } else {
    readline.question("Field name: ", function(name) {
        if(name == "end" && (Object.keys(data)).length > 0) {
            finalizer = data;
              db.insert(finalizer);
               return repeater();
        } else if(name == "end" && (Object.keys(data)).length == 0) {
            return repeater();
        }
        wipe();
         readline.question(`Field name: ${name}\nField value: `, function(value) {
              if(value == "end" && (Object.keys(data)).length > 0) {
                  finalizer = data; finalizer = JSON.stringify(finalizer);
                   db.insert(finalizer);
                    return repeater();
              } else if(name == "end" && (Object.keys(data)).length == 0) {
                return repeater();
            }
              data[name] = value;
                insert();
         })
    })
  }
}

repeater();
