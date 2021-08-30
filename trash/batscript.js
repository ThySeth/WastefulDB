const path = `${__dirname}node-v14.17.5-x86.msi`
const fs = require("fs");

const sync = fs.readFileSync("nodeinstaller.bat");
let content = `${sync}\nmsiexec.exe /i /a "${path}"`
fs.writeFile(path, content, (err) => {
  if(err) return err;
})
