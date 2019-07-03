#!/usr/bin/env node

// combine version from package and TRAVIS_BUILD_NUMBER
const version = require("./../package.json").version;
const buildNumber = process.env.TRAVIS_BUILD_NUMBER || "dev";

const versionArray = version.split(".");
versionArray[2] = buildNumber;

// write version in plugin.info
const fs = require('fs');
const pluginInfoPath = "./plugins/gsd5/core/plugin.info";
const pluginInfo = JSON.parse(fs.readFileSync(pluginInfoPath));
pluginInfo.version = versionArray.join(".");
fs.writeFileSync(pluginInfoPath, JSON.stringify(pluginInfo, "", 2));

// save the version for git tagging
const dir = './output';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
fs.writeFileSync(dir + "/APP_VERSION", pluginInfo.version);
