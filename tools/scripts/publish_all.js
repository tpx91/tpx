#!/usr/bin/env node
const { exec } = require('child_process');
const fs = require('fs');
let afpLibsRaw = fs.readFileSync('afp_libs.json');
let afpLibs = JSON.parse(afpLibsRaw);

const snapshot = process.env.BRANCH_NAME !== 'master' && !process.env.BRANCH_NAME.startsWith('release/');
const buildNumber = process.env.BUILD_NUMBER || '0';

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

const libVersion = JSON.parse(fs.readFileSync(`package.json`)).version;
Object.keys(afpLibs).forEach((key) => {
  const libDirectory = `dist/${afpLibs[key]}`;
  if (snapshot) {
    const snapshotVersion = `${libVersion}-SNAPSHOT.${buildNumber}`;
    runCommand(
      `npm --ignore-scripts version --no-git-tag-version ${snapshotVersion}`,
      { cwd: libDirectory }
    ).then(() => {
      runCommand(`npm publish ${libDirectory} --tag snapshot`);
    });
  } else {
    runCommand(`npm publish ${libDirectory}`);
  }
});
