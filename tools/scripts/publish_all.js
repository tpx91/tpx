#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
console.log(fs.readdirSync('libs'))
let tpxLibs = fs.readdirSync('libs')?.filter((l) => {
  try {
    fs.readFileSync(`libs/${l}/ng-package.json`);
  } catch(e) {
    return false;
  }
  return true;
});

const runCommand = (command, options) => {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      console.log(
        `ran '${command}' in ${(options && options.cwd) || 'current directory'}`
      );
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      resolve();
    });
  });
};

tpxLibs.forEach((lib) => {
  const libDirectory = `dist/libs/${lib}`;
  runCommand(`npm publish ${libDirectory}`);
});
