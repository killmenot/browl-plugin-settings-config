'use strict';

const path = require('path');
const NullStrategy = require('browl-null');
const settingsConfigPlugin = require('../');

describe('browl-plugin-settings-config', () => {
  let repo;
  let rootConfig;
  let repoConfig;

  let strategy;
  let branch;
  let options;

  function toActual(config) {
    delete config._obj;
    delete config.ENV;

    return config;
  }

  beforeEach(() => {
    repo = 'webapp';
    rootConfig = {
      conf_dir: '/etc/browl'
    };
    repoConfig = {};

    strategy = new NullStrategy(repo, rootConfig, repoConfig);

    branch = 'develop';
    options = {
      cwd: path.join(__dirname, 'fixtures/webapp/develop')
    };
  });

  describe('#create', () => {
    it('config could not be loaded', (done) => {
      const expected = {};

      settingsConfigPlugin(strategy);

      options.cwd = '/path/to/instance/workdir';

      strategy.create(branch, options).then(() => {
        expect(repoConfig.settingsConfig.config).eql(expected);

        done();
      }).catch(done);
    });

    it('config loaded', (done) => {
      const expected = {
        value1: 'baz',
        value2: 'bar'
      };

      settingsConfigPlugin(strategy);

      strategy.create(branch, options).then(() => {
        const actual = toActual(repoConfig.settingsConfig.config);

        expect(actual).eql(expected);

        done();
      }).catch(done);
    });

    it('config loaded on relative path', (done) => {
      const expected = {
        value1: 'foo',
        value2: 'bar'
      };

      branch = 'master';
      options = {
        cwd: path.join(__dirname, 'fixtures/webapp/develop/bar')
      };

      repoConfig.settingsConfig = {
        path: '../config'
      };

      settingsConfigPlugin(strategy);

      strategy.create(branch, options).then(() => {
        const actual = toActual(repoConfig.settingsConfig.config);

        expect(actual).eql(expected);

        done();
      }).catch(done);
    });

    it('config loaded on absolute path', (done) => {
      const expected = {
        value1: 'baz',
        value2: 'bar'
      };

      repoConfig.settingsConfig = {
        path: path.join(__dirname, 'fixtures/webapp/develop/config')
      };

      settingsConfigPlugin(strategy);

      strategy.create(branch, options).then(() => {
        const actual = toActual(repoConfig.settingsConfig.config);

        expect(actual).eql(expected);

        done();
      }).catch(done);
    });

    it('unknown direction flow returns error', (done) => {
      repoConfig.settingsConfig = {
        direction: 'foo'
      };

      settingsConfigPlugin(strategy);

      strategy.create(branch, options).catch((err) => {
        expect(err.message).equal('direction "foo" is not supported.');

        done();
      });
    });

    it('forward direction flow', (done) => {
      const expected = {
        value1: 'baz',
        value2: 'bar'
      };

      repoConfig.settingsConfig = {
        direction: 'forward'
      };

      settingsConfigPlugin(strategy);

      strategy.create(branch, options).then(() => {
        const actual = toActual(repoConfig.settingsConfig.config);

        expect(actual).eql(expected);

        done();
      }).catch(done);
    });

    it('backward direction flow', (done) => {
      const expected = {
        value1: 'baz',
        value2: 'bar'
      };

      repoConfig.settingsConfig = {
        direction: 'backward'
      };

      settingsConfigPlugin(strategy);

      strategy.create(branch, options).then(() => {
        const actual = toActual(repoConfig.settingsConfig.config);

        expect(actual).eql(expected);

        done();
      }).catch(done);
    });
  });
});
