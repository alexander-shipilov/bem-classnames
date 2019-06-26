import { ClassValue } from "classnames/types";

/**
 * Selector delimiter: non-empty string that consists of symbols: '_', '-', e.g. '--'
 * @typedef { string } BEMDelimiter
 */
declare type BEMDelimiter = string;

/**
 * Function to format a part of BEM selector.
 * @callback BEMFormatter
 *
 * @param { string } part - Part of BEM selector
 * @return { string }
 */
declare type BEMFormatter = (part: string) => string;

/**
 * @typedef { string | string[] | Set<string> | Object<string, *> | Map<string, *> } BEMModifiers
 */
declare type BEMModifiers = string | string[] | Set<string> | { [key: string]: any; } | Map<string, any>;

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
declare type BEMConfig = {
  elementDelimiter: BEMDelimiter;
  modifierDelimiter: BEMDelimiter;
  formatter?: BEMFormatter;
  blockFormatter?: BEMFormatter;
  elementFormatter?: BEMFormatter;
  modifierFormatter?: BEMFormatter;
  modifierValueFormatter?: BEMFormatter;
};

/**
 * @typedef { Object } BEM
 * @property { function(?Partial<BEMConfig>=): BEMConfig } config {@link config}
 * @property { function(string, ?BEMModifiers=, ...[ClassValue]): string } block {@link block}
 * @property { function(string, string, ?BEMModifiers=, ...[ClassValue]): string } element {@link element}
 * @property { function(string, ?BEMModifiers=): string } modifiers {@link modifiers}
 */
declare interface BEM {
  config(configProps?: Partial<BEMConfig>): BEMConfig;

  block(blockName: string, mods?: BEMModifiers, ...mixins: ClassValue[]): string;

  element(blockName: string, elementName: string, mods?: BEMModifiers, ...mixins: ClassValue[]): string;

  modifiers(className: string, mods?: BEMModifiers): string;
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
declare function bem(props?: Partial<BEMConfig>): BEM;

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
declare function config(configProps?: Partial<BEMConfig>): Readonly<BEMConfig>;

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
declare function block(blockName: string, mods?: BEMModifiers, ...mixins: ClassValue[]): string;

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
declare function element(blockName: string, elementName: string, mods?: BEMModifiers, ...mixins: ClassValue[]): string;

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
declare function modifiers(className: string, mods?: BEMModifiers): string;

/**
 * Component props with `className` property
 * @typedef { Object } ComponentPropsWithClassName
 * @property { string } className?
 */
declare type ComponentPropsWithClassName = {
  className?: string;
};

/**
 * Component class with `className` property
 * @typedef { Function } ComponentClassWithClassName
 * @property { string } className?
 */
declare type ComponentClassWithClassName = () => void;

/**
 * Component with `className` property
 * @typedef { Object } ComponentWithClassName
 * @property { string } className?
 * @property { ComponentClassWithClassName } constructor
 * @property { ComponentPropsWithClassName } props
 */
declare type ComponentWithClassName = {
  className?: string;
  constructor: ComponentClassWithClassName;
  props: ComponentPropsWithClassName;
};

/**
 * @param { BEMConfig } [configProps] - Configuration
 *
 * @return { ReactHelper }
 */
declare class ReactHelper {
  constructor(configProps?: BEMConfig);

  /**
   * Returns configuration
   *
   * @return { BEMConfig }
   */
  config(): BEMConfig;

  /**
   * Creates block classes for Component
   *
   * @param { ComponentWithClassName | ComponentClassWithClassName } component - Component
   * @param { BEMModifiers } [mods] - Modifiers
   * @param { ...ClassValue } mixins - Mixins
   *
   * @return { string }
   *
   * @example
   * import React, { Component } from 'react'l
   * import { ReactHelper } from '@helioscompanies/bem-classnames';
   *
   * const bem = new ReactHelper();
   *
   * function FooBar(props) {
   *   return (
   *     <div className={ bem.block(FooBar, null, props.classNames) } />
   *   );
   * }
   *
   * FooBar.className = 'FooBar';
   *
   * render(<FooBar className='test' />, document.getElementById('test'));
   *
   * // <div class="FooBar test" />
   */
  block(
      component: ComponentWithClassName | ComponentClassWithClassName, mods?: BEMModifiers,
      ...mixins: ClassValue[]
  ): string;

  /**
   * Creates modifiers classes for Component block
   *
   * @param { ComponentWithClassName | ComponentClassWithClassName } component - Component
   * @param { BEMModifiers } [mods] - Modifiers
   *
   * @return { string }
   */
  blockModifiers(component: ComponentWithClassName | ComponentClassWithClassName, mods?: BEMModifiers): string;

  /**
   * Creates classes for Component element
   *
   * @param { ComponentWithClassName | ComponentClassWithClassName } component - Component
   * @param { string } elementName - Element name
   * @param { BEMModifiers } [mods] - Modifiers
   * @param { ...ClassValue } mixins - Mixins
   *
   * @return { string }
   *
   * @example
   * import React, { Component } from 'react'l
   * import { ReactHelper } from '@helioscompanies/bem-classnames';
   *
   * const bem = new ReactHelper();
   *
   * class FooBar extends Component {
   *   render() {
   *     return (
   *       <div className={ bem.block(this) }>
   *         <div className={ bem.element(this, 'inner') } />
   *       </div>
   *     );
   *   }
   * }
   *
   * render(<FooBar className='test' />, document.getElementById('test'));
   *
   * // <div class="FooBar test">
   * //   <div class="FooBar__inner" />
   * // </div>
   */
  element(
      component: ComponentWithClassName | ComponentClassWithClassName, elementName: string, mods?: BEMModifiers,
      ...mixins: ClassValue[]
  ): string;

  /**
   * Creates modifiers classes for Component element
   *
   * @param { ComponentWithClassName | ComponentClassWithClassName } component - Component
   * @param { string } elementName - Element name
   * @param { BEMModifiers } [mods] - Modifiers
   *
   * @return { string }
   */
  elementModifiers(
      component: ComponentWithClassName | ComponentClassWithClassName, elementName: string,
      mods?: BEMModifiers
  ): string;
}


