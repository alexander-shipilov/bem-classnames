const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const sassdocExtras = require('sassdoc-extras');

const swig = require('./swig');
const def = require('./default.json');

const { assign } = Object;

/**
 * Parse options and defaults.
 *
 * @param ctx
 */

const applyDefaults = function(ctx) {
  return assign({}, def, ctx, {
    groups: assign({}, def.groups, ctx.groups),
    display: assign({}, def.display, ctx.display)
  });
};

/**
 * Compile and render docs.
 *
 * @param template
 * @param ctx
 * @param dest
 * @returns {boolean}
 */

const buildDocs = function(template, ctx, dest) {
  const { byGroupAndType } = ctx.data;

  for (const group in byGroupAndType) {
    if (byGroupAndType.hasOwnProperty(group)) {
      // Set current group name.
      ctx.data.currentGroupName = ctx.groups[group];
      // Set current group.
      ctx.data.currentGroup = ctx.data.byGroupAndType[group];
      // Write file to destination.
      fs.writeFile(
          path.resolve(dest, group + '.scss.md'),
          swig.renderFile(template, ctx),
          (error) => {
            if (error) {
              throw error;
            }
          }
      );
    }
  }
  return true;
};

/**
 * Copy pages to destination.
 *
 * @param ctx
 * @param dest
 * @returns boolean
 */

const buildPages = function(ctx, dest) {
  if (ctx.pagesFrom) {
    // Copy pages from option to destination.
    const from = path.resolve(__dirname, ctx.pagesFrom);
    const to = path.resolve(dest);
    return fse.copySync(from, to);
  } else {
    return false;
  }
};

/**
 * Export.
 *
 * @param dest
 * @param ctx
 * @returns {*}
 */

module.exports = function(dest, ctx) {
  // Resolve entry template.
  const template = path.resolve(__dirname, './templates/index.markdown.swig');

  // Extend defaults.
  ctx = applyDefaults(ctx);

  // Sassdoc extras.
  sassdocExtras(ctx, 'display', 'groupName');

  // Set by group and type to sorted data by group and type.
  ctx.data.byGroupAndType = sassdocExtras.byGroupAndType(ctx.data);

  // Construct.
  return Promise.all([buildDocs(template, ctx, dest), buildPages(ctx, dest)]);
};
