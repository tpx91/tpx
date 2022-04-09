#!/usr/bin/env node

const fs = require('fs');
const pjsonRaw = fs.readFileSync('package.json');
const pjson = JSON.parse(pjsonRaw);
console.log(pjson.version);
let afpLibsRaw = fs.readFileSync('afp_libs.json');
let afpLibs = JSON.parse(afpLibsRaw);
console.log(afpLibs);

Object.keys(afpLibs).forEach((key) => {
  let packageJsonLocaltion = `${afpLibs[key]}/package.json`;
  console.log(packageJsonLocaltion);
  bumpVersion(packageJsonLocaltion);
});

function bumpVersion(path) {
  const jsonRaw = fs.readFileSync(path);
  const json = JSON.parse(jsonRaw);
  json.version = pjson.version;

  fs.writeFileSync(path, JSON.stringify(json, null, 2));
}
