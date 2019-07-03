#!/usr/bin/env node

// combine version from package and TRAVIS_BUILD_NUMBER
const packageJson = require("./../package.json");
const version = packageJson.version;
const buildNumber = process.env.TRAVIS_BUILD_NUMBER || "dev-" + new Date().getTime();

const versionArray = version.split(".");
versionArray[2] = buildNumber;
const tiddlywikiVersion = packageJson.dependencies.tiddlywiki;

// write version in plugin.info
const fs = require('fs');
const pluginInfoOutputPath = "./plugins/sebastianovide/gsebd/plugin.info";
const pluginInfoInputPath = "./plugin.info";
const pluginInfo = JSON.parse(fs.readFileSync(pluginInfoInputPath));
pluginInfo.version = versionArray.join(".");
pluginInfo["core-version"] = tiddlywikiVersion.replace("^", ">=");
pluginInfo.description = packageJson.description;
pluginInfo.author = packageJson.author;

fs.writeFileSync(pluginInfoOutputPath, JSON.stringify(pluginInfo, "", 2));

// save the version for git tagging
const dir = './output';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.writeFileSync(dir + "/APP_VERSION", pluginInfo.version);
