const rl = require('readline');
const chalk = require("chalk");
const readline = rl.createInterface({
    input: process.stdin,
    output: process.stdout
})
const Wasteful = require('./index.js');
const fs = require('fs');
let config = fs.readFileSync("./config.json"); config = JSON.parse(config);

const db = new Wasteful({feedback: config.feed, path: config.path, serial: config.serial});

function wipe() {
    for(let i = 0; i < 50; i++) {
        console.log(" ");
    }
}

function configSetup() {
    wipe();
    readline.question(`${chalk.underline("Configurations")}\n1) Serialization ( ${chalk.cyan(config.serial)} )\n2) Feedback ( ${chalk.cyan(config.feed)} )\n3) Directory/Path ( ${chalk.green(config.path)} )\nType 'end' to exit.\n`, function(configCheck) {
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
            case "3":
             readline.question("Provide your new directory path. Ensure it is formatted correctly! (ex: `${__dirname}data/`)", function(newPath) {
                 config.path = newPath;
                  configSetup();
             });
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

function repeater () {
  wipe();
    readline.question(`${chalk.underline.green("WastefulDB Beta Interface")}\n \n` + "1) Configuration\n2) Insert document\n3) Find document\n", function(answer) {
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
        }
        repeater();
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
