const postcssImport = require('postcss-import');

module.exports = {
  syntax: 'postcss-scss',
  plugins: [postcssImport({ resolve: (path) => path + '.scss' })]
};
