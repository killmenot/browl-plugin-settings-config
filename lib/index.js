'use strict';

const path = require('path');
const fs = require('fs-extra');
const browlUtil = require('browl-util');
const getConfig = require('settings-config').getConfig;
const debug = require('debug')('browl-plugin-settings-config')

function loadConfig(branch, repoConfig, options) {
  const pathToConfigRelative = repoConfig.browlPluginSettingsConfig.path || 'config';
  const pathToConfigAbsolute = path.join(options.cwd, pathToConfigRelative);
  const env = browlUtil.clean(branch);

  let config;

  try {
    fs.accessSync(pathToConfigAbsolute);
    config = getConfig(pathToConfigAbsolute, env);
  } catch (err) {
    config = {};
  }

  return Object.assign({
    branch: browlUtil.clean(branch)
  }, config);
}

/**
  * @param {Object} strategy
  */
module.exports = (strategy) => {
  debug('init');

  const repo = strategy.repo;
  const rootConfig = strategy.rootConfig;
  const repoConfig = strategy.repoConfig;

  strategy.create = (branch, options) => {
    debug('create %s', branch);

    repoConfig.browlPluginSettingsConfig = repoConfig.browlPluginSettingsConfig || {};
    repoConfig.browlPluginSettingsConfig.config = loadConfig(branch, repoConfig, options);

    return Promise.resolve();
  };

  return strategy;
}
