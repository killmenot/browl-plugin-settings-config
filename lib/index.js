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
  const settingsConfig = repoConfig.settingsConfig || {};

  const originalCreate = strategy.create.bind(strategy);

  function loadConfig(branch, options) {
    const pathToConfigRelative = settingsConfig.path || './config';
    const pathToConfigAbsolute = pathToConfigRelative.startsWith('/') ?
      pathToConfigRelative :
      path.join(options.cwd, pathToConfigRelative);
    const env = browlUtil.clean(branch);

    debug('pathToConfigRelative = %s', pathToConfigRelative);
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
    (repoConfig.settingsConfig = repoConfig.settingsConfig || {}).config = loadConfig(branch, options);

    return Promise.resolve();
  }

  strategy.create = (branch, options) => {
    debug('create %s', branch);

    const direction = settingsConfig.direction || 'forward';
    debug('direction = %s', direction);

    const flow = {
      forward: () => create(branch, options).then(() => originalCreate(branch, options)),
      backward: () => originalCreate(branch, options).then(() => create(branch, options))
    };

    if (!flow[direction]) {
      return Promise.reject(new Error(`direction "${direction}" is not supported.`));
    }

    return flow[direction](branch, options);
  };

  return strategy;
};
