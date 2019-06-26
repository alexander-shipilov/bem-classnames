import classNames from 'classnames';

/**
 * Selector delimiter: non-empty string that consists of symbols: '_', '-', e.g. '--'
 * @typedef { string } BEMDelimiter
 */

/**
 * Function to format a part of BEM selector.
 * @callback BEMFormatter
 *
 * @param { string } part - Part of BEM selector
 * @return { string }
 */

/**
 * @typedef { string | string[] | Set<string> | Object<string, *> | Map<string, *> } BEMModifiers
 */

/**
 * @typedef { Object } BEMConfig
 * @property { BEMDelimiter } [elementDelimiter=__] - Element delimiter
 * @property { BEMDelimiter } [modifierDelimiter=_] - Modifier delimiter. Should not contain `elementDelimiter`
 * @property { ?BEMFormatter } [formatter] - Formatter
 * @property { ?BEMFormatter } [blockFormatter] - Block formatter
 * @property { ?BEMFormatter } [elementFormatter] - Element formatter
 * @property { ?BEMFormatter } [modifierFormatter] - Modifier name formatter
 * @property { ?BEMFormatter } [modifierValueFormatter] - Modifier value formatter
 */

/**
 * @typedef { Object } BEM
 * @property { function(?Partial<BEMConfig>=): BEMConfig } config {@link config}
 * @property { function(string, ?BEMModifiers=, ...[ClassValue]): string } block {@link block}
 * @property { function(string, string, ?BEMModifiers=, ...[ClassValue]): string } element {@link element}
 * @property { function(string, ?BEMModifiers=): string } modifiers {@link modifiers}
 */

const { isArray } = Array;
const { assign, entries, freeze } = Object;

/**
 * @ignore
 * @type { string[] }
 */
const delimiterProps = [
  'elementDelimiter',
  'modifierDelimiter',
];

/**
 * @ignore
 * @type { string[] }
 */
const formatterProps = [
  'formatter',
  'blockFormatter',
  'elementFormatter',
  'modifierFormatter',
  'modifierValueFormatter',
];

/**
 * @ignore
 * @type { RegExp }
 */
const DELIMITER_REGEXP = /^[_-]+$/;

/**
 * @ignore
 * @type { RegExp }
 */
const CLASS_NAME_REGEXP = /^[\w-]+$/;

/**
 * Checks if the passed value is a valid delimiter, i.e. consists of '_', '-'
 * @ignore
 *
 * @param { string } value
 *
 * @return { boolean }
 */
function isDelimiter(value) {
  return typeof value === 'string' && DELIMITER_REGEXP.test(value);
}

/**
 * Checks if the passed value is a valid class name, i.e. consists of alphanumerics, '_' and '-'
 * @ignore
 *
 * @param { string } value
 *
 * @return { boolean }
 */
function isClassName(value) {
  return typeof value === 'string' && CLASS_NAME_REGEXP.test(value);
}

/**
 * Creates an instance of {@link BEM}.
 *
 * @param { ?Partial<BEMConfig> } [props]
 *
 * @return { BEM }
 *
 * @throws { TypeError } specified delimiters should be a string described by {@link BEMDelimiter}
 * @throws { TypeError } specified formatters should be a function
 * @throws { TypeError } resulting `modifierDelimiter` should not contain resulting `elementDelimiter`
 *
 * @example
 *
 * import { kebabCase } from 'lodash';
 * import { bem } from 'bem-classnames';
 *
 * const bem1 = bem();
 * const bem2 = bem({ formatter: kebabCase, blockFormatter: (name) => `my-${name}` });
 *
 * bem1.element('AlertBlock', 'messageWrapper', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true });
 * // 'AlertBlock__messageWrapper_foo_bar AlertBlock__messageWrapper_ted mixin1 mixin2'
 *
 * bem2.element('AlertBlock', 'messageWrapper', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true });
 * // 'my-alert-block__message-wrapper_foo_bar my-alert-block__message-wrapper_ted mixin1 mixin2'
 *
 */
export function bem(props = null) {
  /**
   * @ignore
   * @type { BEMConfig }
   */
  let bemConfig = freeze({
    elementDelimiter: '__',
    modifierDelimiter: '_',
    formatter: undefined,
    blockFormatter: undefined,
    elementFormatter: undefined,
    modifierFormatter: undefined,
    modifierValueFormatter: undefined,
  });

  /**
   * Sets / returns configuration
   * @alias config
   *
   * @param { ?Partial<BEMConfig> } [configProps] - Configuration
   *
   * @return { Readonly<BEMConfig> }
   *
   * @throws { TypeError } specified delimiters should be a string described by {@link BEMDelimiter}
   * @throws { TypeError } specified formatters should be a function
   * @throws { TypeError } resulting `modifierDelimiter` should not contain resulting `elementDelimiter`
   *
   * @example
   *
   * import { kebabCase } from 'lodash';
   * import { config, element } from 'bem-classnames';
   *
   * config({
   *   formatter: kebabCase,
   *   blockFormatter: (name) => `prefix-${name}`
   * });
   *
   * element('AlertBlock', 'messageWrapper', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true });
   * // 'prefix-alert-block__message-wrapper_foo_bar prefix-alert-block__message-wrapper_ted mixin1 mixin2'
   *
   */
  function config(configProps) {
    if (configProps !== null) {
      /**
       * @ignore
       * @type { BEMConfig }
       */
      const nextConfig = assign({}, bemConfig, configProps);

      delimiterProps.forEach((delimiterProp) => {
        if (!isDelimiter(nextConfig[delimiterProp])) {
          throw new TypeError(`config(): ${delimiterProp} should be a valid delimiter`);
        }
      });

      if (nextConfig.modifierDelimiter.indexOf(nextConfig.elementDelimiter) !== -1) {
        throw new TypeError('config(): modifierDelimiter cannot contain elementDelimiter');
      }

      formatterProps.forEach((formatterProp) => {
        const formatter = nextConfig[formatterProp];

        if (formatter !== null && formatter !== undefined && typeof formatter !== 'function') {
          throw new TypeError(`config(): ${formatterProp} should be a function or null`);
        }
      });

      bemConfig = freeze(nextConfig);
    }

    return bemConfig;
  }

  /**
   * @ignore
   * @param { string } name
   *
   * @return { boolean }
   */
  function isName(name) {
    return isClassName(name)
        && name.indexOf(bemConfig.elementDelimiter) === -1
        && name.indexOf(bemConfig.modifierDelimiter) === -1;
  }

  /**
   * @ignore
   * @param { string } type
   * @param { * } value
   *
   * @return { string }
   */
  function toName(type, value) {
    let name = value;

    if (isClassName(value)) {
      const { formatter, [`${type}Formatter`]: typeFormatter } = bemConfig;

      if (typeFormatter) {
        name = typeFormatter(name);
      }

      if (formatter) {
        name = formatter(name);
      }

      if (isName(name)) {
        return name;
      }
    }

    throw new Error(`Invalid ${type} ${JSON.stringify(name)}`);
  }

  /**
   * @ignore
   * @param { string } className
   * @param { string } modName
   * @param { * } modValue
   *
   * @return { string }
   */
  function formatModifier(className, modName, modValue) {
    let modClassName = '';

    if (modValue != null && modValue !== false && modValue !== '') {
      const { modifierDelimiter } = bemConfig;

      modClassName = `${className}${modifierDelimiter}${toName('modifier', modName)}`;

      if (modValue !== true) {
        modClassName = `${modClassName}${modifierDelimiter}${toName('modifierValue', `${modValue}`)}`;
      }
    }

    return modClassName;
  }

  /**
   * @ignore
   * @param { BEMModifiers } mods
   *
   * @return { Map<string, *> }
   */
  function toModifiers(mods) {
    const type = typeof mods;
    let modsMap;

    if (mods instanceof Map) {
      modsMap = mods;
    } else if (isArray(mods) || (mods instanceof Set)) {
      modsMap = new Map([...mods].map((mod) => [mod, true]));
    } else if (type === 'object') {
      modsMap = new Map(entries(mods));
    } else if (type === 'string') {
      modsMap = new Map([[mods, true]]);
    } else {
      throw new TypeError(`Invalid modifier ${JSON.stringify(mods)}`);
    }

    return modsMap;
  }

  /**
   * @ignore
   * @param { string } className
   * @param { ?BEMModifiers } mods
   *
   * @return { string[] }
   */
  function formatModifiers(className, mods) {
    const modClassNames = [];

    if (mods != null) {
      toModifiers(mods).forEach((modValue, modName) => {
        const modClassName = formatModifier(className, modName, modValue);

        if (modClassName !== '') {
          modClassNames.push(modClassName);
        }
      });
    }

    return modClassNames;
  }

  /**
   * @ignore
   *
   * @param { string } className
   * @param { ?BEMModifiers } mods
   * @param { ...ClassValue } mixins
   *
   * @return { string }
   */
  function bemClassNames(className, mods, ...mixins) {
    return classNames(className, ...formatModifiers(className, mods), ...mixins);
  }

  /**
   * Creates block classes
   * @alias block
   *
   * @param { string } blockName - Block name
   * @param { ?BEMModifiers } [mods] - Modifiers
   * @param { ...ClassValue } mixins - Mixins
   *
   * @return { string }
   *
   * @throws { TypeError } `blockName` should not contain delimiters
   * @throws { TypeError } `mods` should be one of the type listed in {@link BEMModifiers}
   * @throws { TypeError } `mods` should not contain delimiters
   *
   * @example
   *
   * block('block');
   * // 'block'
   *
   * block('block', 'foo');
   * // 'block_foo'
   *
   * block('block', ['foo', 'bar']);
   * // 'block_foo block_bar'
   *
   * block('block', { foo: 'bar', ted: true })
   * // 'block_foo_bar block_ted'
   *
   * block('block', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true })
   * // 'block_foo_bar block_ted mixin1 mixin2'
   *
   */
  function block(blockName, mods, ...mixins) {
    return bemClassNames(toName('block', blockName), mods, ...mixins);
  }

  /**
   * Creates element classes
   * @alias element
   *
   * @param { string } blockName - Block name
   * @param { string } elementName - Element name
   * @param { ?BEMModifiers} [mods] - Modifiers
   * @param { ...ClassValue } mixins - Mixins
   *
   * @return { string }
   *
   * @throws { TypeError } `blockName` should not contain delimiters
   * @throws { TypeError } `elementName` should not contain delimiters
   * @throws { TypeError } `mods` should be one of the type listed in {@link BEMModifiers}
   * @throws { TypeError } `mods` should not contain delimiters
   *
   * @example
   *
   * element('block', 'element');
   * // 'block__element'
   *
   * element('block', 'element', 'foo');
   * // 'block_element_foo'
   *
   * element('block', 'element', ['foo', 'bar']);
   * // 'block__element_foo block__element_bar'
   *
   * element('block', 'element', { foo: 'bar', ted: true })
   * // 'block__element_foo_bar block__element_ted'
   *
   * element('block', 'element', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true })
   * // 'block__element_foo_bar block__element_ted mixin1 mixin2'
   *
   */
  function element(blockName, elementName, mods, ...mixins) {
    const className = `${toName('block', blockName)}${bemConfig.elementDelimiter}${toName('element', elementName)}`;

    return bemClassNames(className, mods, ...mixins);
  }

  /**
   * Creates modifiers classes
   * @alias modifiers
   *
   * @param { string } className
   * @param { ?BEMModifiers } [mods]
   *
   * @return { string }
   *
   * @throws { TypeError } `className` should not contain `modifierDelimiter`
   * @throws { TypeError } `mods` should be one of the type listed in {@link BEMModifiers}
   * @throws { TypeError } `mods` should not contain delimiters
   *
   * @example
   *
   * modifies('block');
   * // ''
   *
   * modifies('block', { foo: false, bar: 0, baz: '', ted: undefined, qux: null });
   * // ''
   *
   * modifies('block', 'foo');
   * // 'block_foo'
   *
   * modifies('block', ['foo', 'bar']);
   * // 'block_foo block_bar'
   *
   * modifies('block', { foo: 'bar', ted: true })
   * // 'block_foo_bar block_ted'
   *
   * modifies(element('block', 'element'), { foo: 'bar', ted: true })
   * // 'block__element_foo_bar block__element_ted'
   *
   */
  function modifiers(className, mods) {
    if (!isClassName(className)) {
      throw new Error(`Invalid class name ${JSON.stringify(className)}`);
    }

    return classNames(...formatModifiers(className, mods));
  }

  if (props) {
    config(props);
  }

  return { config, block, element, modifiers };
}

export const { config, block, element, modifiers } = bem();
