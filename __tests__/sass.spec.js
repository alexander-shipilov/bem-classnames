/* eslint-disable require-jsdoc */

const path = require('path');
const sassTrue = require('sass-true');

const file = path.resolve(__dirname, 'bem.spec.scss');
const includePaths = [__dirname, path.resolve(__dirname, '../src')];

function importer(url) {
  if (url[0] === '~') {
    url = path.resolve('node_modules', url.substr(1));
  }

  return { file: url };
}

describe('node-sass', () => {
  sassTrue.runSass({ importer, file }, { describe, it });
});
