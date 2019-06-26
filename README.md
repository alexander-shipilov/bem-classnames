bem-classnames
===========

[![Version](http://img.shields.io/npm/v/@helioscompanies/bem-classnames.svg)](https://www.npmjs.org/package/@helioscompanies/bem-classnames)

JavaScript and Sass utilities to manage BEM class names

Install with [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/):

npm:
```sh
npm install @helioscompanies/bem-classnames
```

Yarn (note that `yarn add` automatically saves the package to the `dependencies` in `package.json`):
```sh
yarn add @helioscompanies/bem-classnames
```

## Usage

### JavaScript

See [JavaScript API](docs/bem.js.md)

```js
// file: bem-config.js

import { kebabCase } from "lodash";
import { ReactHelper } from "@helioscompanies/bem-classnames";

export default new ReactHelper({ blockFormatter: (name) => `my-${name}`, formatter: kebabCase });
```

```js
// file: FooBar.js

import bem from "bem-config";
import React, { Component } from "react";

import "FooBar.scss";

class FooBar extends Component {
  render() {
    return (
      <div className={ bem.block(this) }>
        <div className={ bem.element(this, "inner") } />
      </div>
    );
  }
}

render(<FooBar className="test" />, document.getElementById("test"));

// <div class="my-foo-bar test">
//   <div class="my-foo-bar__inner" />
// </div>
```


### Scss

See [Scss API](docs/bem.scss.md)

```scss
// file: bem-config.scss

@import "~sassdash/index";
@import "~@helioscompanies/sass-classnames/index";
@import "~@helioscompanies/bem-classnames/index";

@function -my-bem-block-formatter($name) {
  @return "my-#{ $name }";
}

$-my-bem-config: bem-config((
  formatter: get-function(_kebab-case),
  block-formatter: get-function(-my-bem-block-formatter) 
)) !default;
```

```scss
// file: FooBar.scss

@import "bem-config.scss";

#{ bem-block(FooBar, null, test) } {
  // ...
}

#{ bem-block(FooBar, ted, test) } {
  // ...
}

#{ bem-element(FooBar, inner) } {
  // ...
}

// .my-foo-bar.test {}
// .my-foo-bar.my-foo-bar_ted.test {}
// .my-foo-bar__inner {}
```

