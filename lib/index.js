'use strict';

const path = require('path');
const fs = require('fs-extra');
const browlUtil = require('browl-util');
const getConfig = require('settings-config').getConfig;
const debug = require('debug')('browl-plugin-settings-config');

/**
  * @param {Object} strategy
  */
module.exports = (strategy) => {
  debug('init');

  const repoConfig = strategy.repoConfig;
  const browlPluginSettingsConfig = repoConfig.browlPluginSettingsConfig || {};

  const originalCreate = strategy.create.bind(strategy);

  function loadConfig(branch, options) {
    const pathToConfigRelative = browlPluginSettingsConfig.path || 'config';
    const pathToConfigAbsolute = path.join(options.cwd, pathToConfigRelative);
    const env = browlUtil.clean(branch);

    debug('pathToConfigAbsolute = %s', pathToConfigAbsolute);
    debug('env = %s', env);

    let config;

    try {
      fs.accessSync(pathToConfigAbsolute);
      config = getConfig(pathToConfigAbsolute, env);
      debug('config loaded');
    } catch (err) {
      debug('config could not be loaded');
      config = {};
    }

    return config;
  }

  function create(branch, options) {
    repoConfig.browlPluginSettingsConfig.config = loadConfig(branch, options);

    return Promise.resolve();
  }

  strategy.create = (branch, options) => {
    debug('create %s', branch);

    const sequence = browlPluginSettingsConfig.sequence || 'before';
    debug('sequence = %s', sequence);

    if (sequence === 'before') {
      return create(branch, options).then(() => {
        return originalCreate(branch, options);
      });
    }

    if (sequence === 'after') {
      return originalCreate(branch, options).then(() => {
        return create(branch, options);
      });
    }

    return Promise.reject(new Error('sequence is not supported'));
  };

  return strategy;
};
