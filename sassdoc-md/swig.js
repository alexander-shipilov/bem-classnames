const Swig = require('swig');
const markdownTable = require('markdown-table');

/**
 * Set Swig default options.
 *
 * @url http://paularmstrong.github.io/swig/docs/api/#SwigOpts
 */

Swig.setDefaults({ autoescape: false });

const swig = new Swig.Swig();


/**
 * Output input with a decorative underline.
 *
 * @param {string} input
 * @param {string} char
 *
 * @return {string}
 */
function parseHeading(input, char) {
  return char + ' ' + input;
}

/**
 * Output decorated heading.
 *
 * @param input
 * @returns {string}
 */

const headingSection = function(input) {
  return parseHeading(input, '#');
};

/**
 * Output decorated sub heading.
 *
 * @param input
 * @returns {string}
 */

const headingSubsection = function(input) {
  return parseHeading(input, '##');
};

/**
 * Output decorated sub sub heading.
 *
 * @param input
 * @returns {string}
 */

const headingSubsubsection = function(input) {
  return parseHeading(input, '###');
};

/**
 * Remove extra whitespace from a block.
 *
 * @url http://stackoverflow.com/questions/19643805/removing-multiple-new-lines-r-n-from-string
 * @param input
 * @returns {string|*}
 */

const parseBlock = function(input) {
  input = input.trim();
  input = input.replace(/(\n){3,}/g, '\n\n');
  return input;
};

/**
 * Remove new line with tab and new line.
 *
 * @param input
 * @returns {string|*}
 */

const parseCode = function(input) {
  input = input.trim();
  // input = input.replace(/(?:\r\n|\r|\n)/g, "\n");
  return input;
};

/**
 * Output arguments for source code preview.
 *
 * @param item
 * @returns {string}
 */

const outputArg = function(item) {
  let output = '';
  if (item.parameter === undefined) {
    return output;
  }
  item.parameter.forEach(function(parameter) {
    let string = '$' + parameter.name;
    if (parameter.default) {
      string = string + ': ' + parameter.default;
    }
    if (parameter.type.toLowerCase() === 'arglist') {
      string = string + '...';
    }
    if (output === '') {
      output = string;
    } else {
      output = output + ', ' + string;
    }
  });
  return output;
};

/**
 * Output a parameters table.
 *
 * @param parameters
 * @returns String
 */

const outputParameters = function(parameters) {
  const tableHead = ['Name', 'Description', 'Type', 'Default Value'];
  const table = [];
  const parts = ['name', 'description', 'type', 'default'];

  parameters.forEach(function(parameter) {
    const row = [];
    parts.forEach(function(part) {
      let output = parameter[part] || '';

      output = output.replace('\n', '').replace(/\s*\|\s*/g, ', ').trim();

      if (output) {
        row.push(output);
      }
    });
    if (row.length) {
      table.push(row);
    }
  });
  if (tableHead.length && table.length) {
    table.unshift(tableHead);
    return markdownTable(table);
  }
};

/**
 * Returns if key is in object.
 *
 * @param key
 * @param object
 * @returns {boolean}
 */

const inFilter = function(key, object) {
  return key in object;
};

/**
 * Log value to the console.
 *
 * @param value
 */

const debug = function(value) {
  console.log(value);
  return '';
};

/**
 * Set filters.
 *
 * @url http://paularmstrong.github.io/swig/docs/api/#setFilter
 */

swig.setFilter('in', inFilter);
swig.setFilter('section_heading', headingSection);
swig.setFilter('subsection_heading', headingSubsection);
swig.setFilter('subsubsection_heading', headingSubsubsection);
swig.setFilter('parse_block', parseBlock);
swig.setFilter('parse_code', parseCode);
swig.setFilter('output_arg', outputArg);
swig.setFilter('output_parameters', outputParameters);
swig.setFilter('debug', debug);

/**
 * Export module
 */

module.exports = swig;
