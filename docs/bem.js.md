## Classes

<dl>
<dt><a href="#ReactHelper">ReactHelper</a></dt>
<dd><p>React BEM Helper</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#bem">bem([props])</a> ⇒ <code><a href="#BEM">BEM</a></code></dt>
<dd><p>Creates an instance of <a href="#BEM">BEM</a>.</p>
</dd>
<dt><a href="#config">config([configProps])</a> ⇒ <code><a href="#BEMConfig">Readonly.&lt;BEMConfig&gt;</a></code></dt>
<dd><p>Sets / returns configuration</p>
</dd>
<dt><a href="#block">block(blockName, [mods], ...mixins)</a> ⇒ <code>string</code></dt>
<dd><p>Creates block classes</p>
</dd>
<dt><a href="#element">element(blockName, elementName, [mods], ...mixins)</a> ⇒ <code>string</code></dt>
<dd><p>Creates element classes</p>
</dd>
<dt><a href="#modifiers">modifiers(className, [mods])</a> ⇒ <code>string</code></dt>
<dd><p>Creates modifiers classes</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#BEMDelimiter">BEMDelimiter</a> : <code>string</code></dt>
<dd><p>Selector delimiter: non-empty string that consists of symbols: &#39;_&#39;, &#39;-&#39;, e.g. &#39;--&#39;</p>
</dd>
<dt><a href="#BEMFormatter">BEMFormatter</a> ⇒ <code>string</code></dt>
<dd><p>Function to format a part of BEM selector.</p>
</dd>
<dt><a href="#BEMModifiers">BEMModifiers</a> : <code>string</code> | <code>Array.&lt;string&gt;</code> | <code>Set.&lt;string&gt;</code> | <code>Object.&lt;string, *&gt;</code> | <code>Map.&lt;string, *&gt;</code></dt>
<dd></dd>
<dt><a href="#BEMConfig">BEMConfig</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#BEM">BEM</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#ComponentPropsWithClassName">ComponentPropsWithClassName</a> : <code>Object</code></dt>
<dd><p>Component props with <code>className</code> property</p>
</dd>
<dt><a href="#ComponentClassWithClassName">ComponentClassWithClassName</a> : <code>function</code></dt>
<dd><p>Component class with <code>className</code> property</p>
</dd>
<dt><a href="#ComponentWithClassName">ComponentWithClassName</a> : <code>Object</code></dt>
<dd><p>Component with <code>className</code> property</p>
</dd>
</dl>

<a name="ReactHelper"></a>

## ReactHelper
React BEM Helper

**Kind**: global class  

* [ReactHelper](#ReactHelper)
    * [new ReactHelper([configProps])](#new_ReactHelper_new)
    * [.config()](#ReactHelper+config) ⇒ [<code>BEMConfig</code>](#BEMConfig)
    * [.block(component, [mods], ...mixins)](#ReactHelper+block) ⇒ <code>string</code>
    * [.blockModifiers(component, [mods])](#ReactHelper+blockModifiers) ⇒ <code>string</code>
    * [.element(component, elementName, [mods], ...mixins)](#ReactHelper+element) ⇒ <code>string</code>
    * [.elementModifiers(component, elementName, [mods])](#ReactHelper+elementModifiers) ⇒ <code>string</code>

<a name="new_ReactHelper_new"></a>

### new ReactHelper([configProps])

| Param | Type | Description |
| --- | --- | --- |
| [configProps] | [<code>BEMConfig</code>](#BEMConfig) | Configuration |

<a name="ReactHelper+config"></a>

### reactHelper.config() ⇒ [<code>BEMConfig</code>](#BEMConfig)
Returns configuration

**Kind**: instance method of [<code>ReactHelper</code>](#ReactHelper)  
<a name="ReactHelper+block"></a>

### reactHelper.block(component, [mods], ...mixins) ⇒ <code>string</code>
Creates block classes for Component

**Kind**: instance method of [<code>ReactHelper</code>](#ReactHelper)  

| Param | Type | Description |
| --- | --- | --- |
| component | [<code>ComponentWithClassName</code>](#ComponentWithClassName) \| [<code>ComponentClassWithClassName</code>](#ComponentClassWithClassName) | Component |
| [mods] | [<code>BEMModifiers</code>](#BEMModifiers) | Modifiers |
| ...mixins | <code>ClassValue</code> | Mixins |

**Example**  
```js
import React, { Component } from 'react';
import { ReactHelper } from '@helioscompanies/bem-classnames';

const bem = new ReactHelper();

function FooBar(props) {
  return (
    <div className={ bem.block(FooBar, null, props.classNames) } />
  );
}

FooBar.className = 'FooBar';

render(<FooBar className="test" />, document.getElementById('test'));

// <div class="FooBar test" />
```
<a name="ReactHelper+blockModifiers"></a>

### reactHelper.blockModifiers(component, [mods]) ⇒ <code>string</code>
Creates modifiers classes for Component block

**Kind**: instance method of [<code>ReactHelper</code>](#ReactHelper)  

| Param | Type | Description |
| --- | --- | --- |
| component | [<code>ComponentWithClassName</code>](#ComponentWithClassName) \| [<code>ComponentClassWithClassName</code>](#ComponentClassWithClassName) | Component |
| [mods] | [<code>BEMModifiers</code>](#BEMModifiers) | Modifiers |

<a name="ReactHelper+element"></a>

### reactHelper.element(component, elementName, [mods], ...mixins) ⇒ <code>string</code>
Creates classes for Component element

**Kind**: instance method of [<code>ReactHelper</code>](#ReactHelper)  

| Param | Type | Description |
| --- | --- | --- |
| component | [<code>ComponentWithClassName</code>](#ComponentWithClassName) \| [<code>ComponentClassWithClassName</code>](#ComponentClassWithClassName) | Component |
| elementName | <code>string</code> | Element name |
| [mods] | [<code>BEMModifiers</code>](#BEMModifiers) | Modifiers |
| ...mixins | <code>ClassValue</code> | Mixins |

**Example**  
```js
import React, { Component } from 'react';
import { ReactHelper } from '@helioscompanies/bem-classnames';

const bem = new ReactHelper();

class FooBar extends Component {
  render() {
    return (
      <div className={ bem.block(this) }>
        <div className={ bem.element(this, 'inner') } />
      </div>
    );
  }
}

FooBar.className = 'FooBar';

render(<FooBar className="test" />, document.getElementById('test'));

// <div class="FooBar test">
//   <div class="FooBar__inner" />
// </div>
```
<a name="ReactHelper+elementModifiers"></a>

### reactHelper.elementModifiers(component, elementName, [mods]) ⇒ <code>string</code>
Creates modifiers classes for Component element

**Kind**: instance method of [<code>ReactHelper</code>](#ReactHelper)  

| Param | Type | Description |
| --- | --- | --- |
| component | [<code>ComponentWithClassName</code>](#ComponentWithClassName) \| [<code>ComponentClassWithClassName</code>](#ComponentClassWithClassName) | Component |
| elementName | <code>string</code> | Element name |
| [mods] | [<code>BEMModifiers</code>](#BEMModifiers) | Modifiers |

<a name="bem"></a>

## bem([props]) ⇒ [<code>BEM</code>](#BEM)
Creates an instance of [BEM](#BEM).

**Kind**: global function  
**Throws**:

- <code>TypeError</code> specified delimiters should be a string described by [BEMDelimiter](#BEMDelimiter)
- <code>TypeError</code> specified formatters should be a function
- <code>TypeError</code> resulting `modifierDelimiter` should not contain resulting `elementDelimiter`


| Param | Type |
| --- | --- |
| [props] | [<code>Partial.&lt;BEMConfig&gt;</code>](#BEMConfig) | 

**Example**  
```js
import { kebabCase } from 'lodash';
import { bem } from 'bem-classnames';

const bem1 = bem();
const bem2 = bem({ formatter: kebabCase, blockFormatter: (name) => `my-${name}` });

bem1.element('AlertBlock', 'messageWrapper', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true });
// 'AlertBlock__messageWrapper_foo_bar AlertBlock__messageWrapper_ted mixin1 mixin2'

bem2.element('AlertBlock', 'messageWrapper', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true });
// 'my-alert-block__message-wrapper_foo_bar my-alert-block__message-wrapper_ted mixin1 mixin2'
```
<a name="config"></a>

## config([configProps]) ⇒ [<code>Readonly.&lt;BEMConfig&gt;</code>](#BEMConfig)
Sets / returns configuration

**Kind**: global function  
**Throws**:

- <code>TypeError</code> specified delimiters should be a string described by [BEMDelimiter](#BEMDelimiter)
- <code>TypeError</code> specified formatters should be a function
- <code>TypeError</code> resulting `modifierDelimiter` should not contain resulting `elementDelimiter`


| Param | Type | Description |
| --- | --- | --- |
| [configProps] | [<code>Partial.&lt;BEMConfig&gt;</code>](#BEMConfig) | Configuration |

**Example**  
```js
import { kebabCase } from 'lodash';
import { config, element } from 'bem-classnames';

config({
  formatter: kebabCase,
  blockFormatter: (name) => `prefix-${name}`
});

element('AlertBlock', 'messageWrapper', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true });
// 'prefix-alert-block__message-wrapper_foo_bar prefix-alert-block__message-wrapper_ted mixin1 mixin2'
```
<a name="block"></a>

## block(blockName, [mods], ...mixins) ⇒ <code>string</code>
Creates block classes

**Kind**: global function  
**Throws**:

- <code>TypeError</code> `blockName` should not contain delimiters
- <code>TypeError</code> `mods` should be one of the type listed in [BEMModifiers](#BEMModifiers)
- <code>TypeError</code> `mods` should not contain delimiters


| Param | Type | Description |
| --- | --- | --- |
| blockName | <code>string</code> | Block name |
| [mods] | [<code>BEMModifiers</code>](#BEMModifiers) | Modifiers |
| ...mixins | <code>ClassValue</code> | Mixins |

**Example**  
```js
block('block');
// 'block'

block('block', 'foo');
// 'block_foo'

block('block', ['foo', 'bar']);
// 'block_foo block_bar'

block('block', { foo: 'bar', ted: true })
// 'block_foo_bar block_ted'

block('block', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true })
// 'block_foo_bar block_ted mixin1 mixin2'
```
<a name="element"></a>

## element(blockName, elementName, [mods], ...mixins) ⇒ <code>string</code>
Creates element classes

**Kind**: global function  
**Throws**:

- <code>TypeError</code> `blockName` should not contain delimiters
- <code>TypeError</code> `elementName` should not contain delimiters
- <code>TypeError</code> `mods` should be one of the type listed in [BEMModifiers](#BEMModifiers)
- <code>TypeError</code> `mods` should not contain delimiters


| Param | Type | Description |
| --- | --- | --- |
| blockName | <code>string</code> | Block name |
| elementName | <code>string</code> | Element name |
| [mods] | [<code>BEMModifiers</code>](#BEMModifiers) | Modifiers |
| ...mixins | <code>ClassValue</code> | Mixins |

**Example**  
```js
element('block', 'element');
// 'block__element'

element('block', 'element', 'foo');
// 'block_element_foo'

element('block', 'element', ['foo', 'bar']);
// 'block__element_foo block__element_bar'

element('block', 'element', { foo: 'bar', ted: true })
// 'block__element_foo_bar block__element_ted'

element('block', 'element', { foo: 'bar', ted: true }, 'mixin1', { 'mixin2': true })
// 'block__element_foo_bar block__element_ted mixin1 mixin2'
```
<a name="modifiers"></a>

## modifiers(className, [mods]) ⇒ <code>string</code>
Creates modifiers classes

**Kind**: global function  
**Throws**:

- <code>TypeError</code> `className` should not contain `modifierDelimiter`
- <code>TypeError</code> `mods` should be one of the type listed in [BEMModifiers](#BEMModifiers)
- <code>TypeError</code> `mods` should not contain delimiters


| Param | Type |
| --- | --- |
| className | <code>string</code> | 
| [mods] | [<code>BEMModifiers</code>](#BEMModifiers) | 

**Example**  
```js
modifies('block');
// ''

modifies('block', { foo: false, bar: 0, baz: '', ted: undefined, qux: null });
// ''

modifies('block', 'foo');
// 'block_foo'

modifies('block', ['foo', 'bar']);
// 'block_foo block_bar'

modifies('block', { foo: 'bar', ted: true })
// 'block_foo_bar block_ted'

modifies(element('block', 'element'), { foo: 'bar', ted: true })
// 'block__element_foo_bar block__element_ted'
```
<a name="BEMDelimiter"></a>

## BEMDelimiter : <code>string</code>
Selector delimiter: non-empty string that consists of symbols: '_', '-', e.g. '--'

**Kind**: global typedef  
<a name="BEMFormatter"></a>

## BEMFormatter ⇒ <code>string</code>
Function to format a part of BEM selector.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| part | <code>string</code> | Part of BEM selector |

<a name="BEMModifiers"></a>

## BEMModifiers : <code>string</code> \| <code>Array.&lt;string&gt;</code> \| <code>Set.&lt;string&gt;</code> \| <code>Object.&lt;string, \*&gt;</code> \| <code>Map.&lt;string, \*&gt;</code>
**Kind**: global typedef  
<a name="BEMConfig"></a>

## BEMConfig : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| [elementDelimiter] | [<code>BEMDelimiter</code>](#BEMDelimiter) | <code>__</code> | Element delimiter |
| [modifierDelimiter] | [<code>BEMDelimiter</code>](#BEMDelimiter) | <code>_</code> | Modifier delimiter. Should not contain `elementDelimiter` |
| [formatter] | [<code>BEMFormatter</code>](#BEMFormatter) |  | Formatter |
| [blockFormatter] | [<code>BEMFormatter</code>](#BEMFormatter) |  | Block formatter |
| [elementFormatter] | [<code>BEMFormatter</code>](#BEMFormatter) |  | Element formatter |
| [modifierFormatter] | [<code>BEMFormatter</code>](#BEMFormatter) |  | Modifier name formatter |
| [modifierValueFormatter] | [<code>BEMFormatter</code>](#BEMFormatter) |  | Modifier value formatter |

<a name="BEM"></a>

## BEM : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>function</code> | [config](#config) |
| block | <code>function</code> | [block](#block) |
| element | <code>function</code> | [element](#element) |
| modifiers | <code>function</code> | [modifiers](#modifiers) |

<a name="ComponentPropsWithClassName"></a>

## ComponentPropsWithClassName : <code>Object</code>
Component props with `className` property

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| className? | <code>string</code> | 

<a name="ComponentClassWithClassName"></a>

## ComponentClassWithClassName : <code>function</code>
Component class with `className` property

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| className? | <code>string</code> | 

<a name="ComponentWithClassName"></a>

## ComponentWithClassName : <code>Object</code>
Component with `className` property

**Kind**: global typedef  
**Properties**

| Name | Type |
| --- | --- |
| className? | <code>string</code> | 
| constructor | [<code>ComponentClassWithClassName</code>](#ComponentClassWithClassName) | 
| props | [<code>ComponentPropsWithClassName</code>](#ComponentPropsWithClassName) | 

