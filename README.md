# browl-plugin-settings-config

[![Build Status](https://travis-ci.org/killmenot/browl-plugin-settings-config.svg?branch=master)](https://travis-ci.org/killmenot/browl-plugin-settings-config) [![Coverage Status](https://coveralls.io/repos/github/killmenot/browl-plugin-yaml/badge.svg?branch=master)](https://coveralls.io/github/killmenot/browl-plugin-settings-config?branch=master) [![Dependency Status](https://david-dm.org/killmenot/browl-plugin-settings-config.svg)](hhttps://david-dm.org/killmenot/browl-plugin-settings-config) [![npm version](https://img.shields.io/npm/v/browl-plugin-settings-config.svg)](https://www.npmjs.com/package/browl-plugin-settings-config)

Browl plugin that loads application's configuration data created by [settings-config](https://github.com/killmenot/node-settings-config)


## Configuration

### path
Type: `string`
The absolute or relative path (relative to deployed instance directory) to configuration
*Default*: './config'

### direction
Type: `string`
Values: `forward`, `backward`
Defines the direction of the execution flow.
*Default*: `forward`


### Usage

Once plugin's `create` method was called, application's configuration data is accessible via `repoConfig.settingsConfig.config`


## Example
```ini
[settingsConfig]
path = /path/to/webapp/develop/config
direction = backward
```

## License

    The MIT License (MIT)

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.
