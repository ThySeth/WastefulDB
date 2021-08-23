
const {fs, dirent} = require("fs");

const defpath = `${__dirname}/data/`

async function check(path) { 
 if(path == defpath) return;
  let res = await dirent.isFile(path);
   if res == true {
    return;
   } else {
    console.error("Invalid path name.");
     process.kill();
   }
}

