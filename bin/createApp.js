#!/usr/bin/env node

try {
const { execSync } = require('child_process');
//const path = require('path');

//const ownPath = process.cwd();
const folderName = process.argv[2];
const repo = 'https://github.com/HasanAshab/larapress.git';

console.log(`Downloading files from repo ${repo}`);
execSync(`git clone --depth 1 ${repo} ${folderName}`);

/*
const artisanPath = path.join(ownPath, folderName, 'artisan.ts');
console.log(artisanPath)
execSync(`ts-node -r tsconfig-paths/register --transpile-only ${artisanPath} key:generate`);
}*/
catch (err) {
  console.log(err)
}