import { bem } from './bem';

/**
 * Component props with `className` property
 * @typedef { Object } ComponentPropsWithClassName
 * @property { string } className?
 */

/**
 * Component class with `className` property
 * @typedef { Function } ComponentClassWithClassName
 * @property { string } className?
 */

/**
 * Component with `className` property
 * @typedef { Object } ComponentWithClassName
 * @property { string } className?
 * @property { ComponentClassWithClassName } constructor
 * @property { ComponentPropsWithClassName } props
 */

const { defineProperty } = Object;

/**
 * @ignore
 * @param { ComponentWithClassName | ComponentClassWithClassName } constructor
 *
 * @return { string }
 */
function getConstructorClassName(constructor) {
  return constructor.className || '';
}

/**
 * @ignore
 * @param { ComponentWithClassName | ComponentClassWithClassName } component
 *
 * @return { string }
 */
function getComponentClassName(component) {
  return component.className || getConstructorClassName(component.constructor);
}

/**
 * @ignore
 * @param { ComponentWithClassName | ComponentClassWithClassName } target
 *
 * @return { string }
 */
function getClassName(target) {
  return typeof target === 'function' ? getConstructorClassName(target) : getComponentClassName(target);
}

const $bem = Symbol('ReactHelper#bem');

/**
 * React BEM Helper
 * @class
 */
class ReactHelper {
  /**
   * @param { BEMConfig } [configProps] - Configuration
   *
   * @return { ReactHelper }
   */
  constructor(configProps) {
    return defineProperty(this, $bem, { value: bem(configProps) });
  }

  /**
   * Returns configuration
   *
   * @return { BEMConfig }
   */
  config() {
    return this[$bem].config();
  }

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
   * import React, { Component } from 'react';
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
   * render(<FooBar className="test" />, document.getElementById('test'));
   *
   * // <div class="FooBar test" />
   */
  block(component, mods, ...mixins) {
    const className = component.props ? component.props.className : '';

    return this[$bem].block(getClassName(component), mods, className, ...mixins);
  }

  /**
   * Creates modifiers classes for Component block
   *
   * @param { ComponentWithClassName | ComponentClassWithClassName } component - Component
   * @param { BEMModifiers } [mods] - Modifiers
   *
   * @return { string }
   */
  blockModifiers(component, mods) {
    return this[$bem].modifiers(this[$bem].block(getClassName(component)), mods);
  }

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
   * import React, { Component } from 'react';
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
   * FooBar.className = 'FooBar';
   *
   * render(<FooBar className="test" />, document.getElementById('test'));
   *
   * // <div class="FooBar test">
   * //   <div class="FooBar__inner" />
   * // </div>
   */
  element(component, elementName, mods, ...mixins) {
    return this[$bem].element(getClassName(component), elementName, mods, ...mixins);
  }

  /**
   * Creates modifiers classes for Component element
   *
   * @param { ComponentWithClassName | ComponentClassWithClassName } component - Component
   * @param { string } elementName - Element name
   * @param { BEMModifiers } [mods] - Modifiers
   *
   * @return { string }
   */
  elementModifiers(component, elementName, mods) {
    return this[$bem].modifiers(this[$bem].element(getClassName(component), elementName), mods);
  }
}

export default ReactHelper;
