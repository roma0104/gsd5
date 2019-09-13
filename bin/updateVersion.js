#!/usr/bin/env node

const git = require('simple-git/promise');
const packageJson = require("./../package.json");
const semver = require('semver')
const fs = require('fs');

(async ()  => {
  const versions = (await git('.').tag()).split('\n').filter(tag => semver.clean(tag));

  const version = makeVersion(versions);
  fs.writeFileSync("./build/APP_VERSION", version);
  writePluginInfo(version);
})()

function makeVersion(versions) {
  versions = versions.sort(semver.rcompare)
  const biggestVersion = versions[0]

  // find new version
  let version = semver.inc(biggestVersion, "patch");
  if (semver.gt(packageJson.version, biggestVersion)) {
    version = packageJson.version
  }

  // in dev it may be usefull to have always a bigger version so that it can be upgraded
  if (!process.env.TRAVIS_BUILD_NUMBER ) {
    version = `${semver.major(version)}.${semver.minor(version)}.${new Date().getTime()}`
  }

  return version;
}

function writePluginInfo(version) {
  const tiddlywikiVersion = packageJson.dependencies.tiddlywiki;

  // write version in plugin.info
  const pluginInfoInputPath = "./plugin.info";
  const pluginInfoOutputPath = "./plugin/plugin.info";
  const pluginInfo = JSON.parse(fs.readFileSync(pluginInfoInputPath));
  pluginInfo.version = version;
  pluginInfo["core-version"] = tiddlywikiVersion.replace("^", ">=");
  pluginInfo.description = packageJson.description;
  pluginInfo.author = packageJson.author;

  fs.writeFileSync(pluginInfoOutputPath, JSON.stringify(pluginInfo, "", 2));
}