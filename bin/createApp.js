#!/usr/bin/env node

try {
  const { execSync } = require("child_process");
  const fs = require("fs");
  const path = require("path");
  const dotenv = require("dotenv");

  const ownPath = process.cwd();
  const folderName = process.argv[2];
  const repo = "https://github.com/HasanAshab/larapress.git";

  console.log(`Downloading files from repo ${repo}`);
  execSync(`git clone --depth 1 ${repo} ${folderName}`);
  console.log(`Installing Dependency...`);
  execSync(`npm install`, { cwd: path.join(ownPath, folderName) });

  const pkgConfigPath = path.join(ownPath, folderName, "package.json");
  const pkgConfig = JSON.parse(fs.readFileSync(pkgConfigPath));
  pkgConfig.name = folderName;
  pkgConfig.version = "1.0.0";
  pkgConfig.bin = undefined;
  fs.writeFileSync(pkgConfigPath, JSON.stringify(pkgConfig, null, 2));
  fs.rmSync(path.join(ownPath, folderName, "bin"), {
    recursive: true,
    force: true,
  });
  const projectPath = path.join(ownPath, folderName);

  console.log("generating app key...");
  execSync(
    "rm -rf .git",
    { cwd: projectPath }
  );
  execSync(
    `ts-node -r tsconfig-paths/register --transpile-only cli.ts key:generate`,
    { cwd: projectPath }
  );

  console.log("configuring environment...");
  const projectEnv = dotenv.parse(fs.readFileSync(`${projectPath}/.env`));
  projectEnv.APP_NAME = folderName;
  projectEnv.MAIL_FROM_NAME = folderName;
  projectEnv.MAIL_FROM_ADDRESS = `noreply@${folderName}.com`;
  fs.writeFileSync(
    `${projectPath}/.env`,
    Object.entries(projectEnv)
      .map(([k, v]) => `${k}=${v}`)
      .join("\n")
  );
  console.log("\x1b[32m", "\nProject Created!");
} catch (err) {
  console.log(err);
}
