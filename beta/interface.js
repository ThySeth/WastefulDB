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

const configSetup = function() {
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
              console.log(`Feedback: ${updates.feed}`);
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

const repeater = function () {
  wipe();
    readline.question(`${chalk.underline.green("WastefulDB Beta Interface")}\n \n` + "1) Configuration\n", function(answer) {
        switch(answer) {
            case "1":
             configSetup();
            break;
            case "2":
             dirLister();
            break;
        }
        repeater();
    })
}

repeater();
