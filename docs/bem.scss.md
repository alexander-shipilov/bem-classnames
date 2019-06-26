# bem

## -bem-config

### Access

private

### Source

```scss
$-bem-config: (
  element-delimiter: __,
  modifier-delimiter: _,
  formatter: null,
  block-formatter: null,
  element-formatter: null,
  modifier-formatter: null,
  modifier-value-formatter: null
)
```

### Map Structure

| Name                                  | Description              | Type      | Default Value |
| ------------------------------------- | ------------------------ | --------- | ------------- |
| $-bem-config.element-delimiter        | Element delimiter        | string    | __            |
| $-bem-config.modifier-delimiter       | Modifier delimiter       | string    | _             |
| $-bem-config.formatter                | Formatter                | ?function |               |
| $-bem-config.block-formatter          | Block formatter          | ?function |               |
| $-bem-config.element-formatter        | Element formatter        | ?function |               |
| $-bem-config.modifier-formatter       | Modifier formatter       | ?function |               |
| $-bem-config.modifier-value-formatter | Modifier value formatter | ?function |               |

---

## -bem-delimiter-chars

### Access

private

### Source

```scss
$-bem-delimiter-chars: -_
```

---

## -bem-class-name-chars

### Access

private

### Source

```scss
$-bem-class-name-chars: abcdefghijklmnopqrstuvwxyz0123456789-_
```

---

## -bem-delimiter-props

### Access

private

### Source

```scss
$-bem-delimiter-props: (element-delimiter, modifier-delimiter)
```

---

## -bem-formatter-props

### Access

private

### Source

```scss
$-bem-formatter-props: (formatter, block-formatter, element-formatter, modifier-formatter, modifier-value-formatter)
```

---

## -bem-test

### Access

private

### Source

```scss
@function -bem-test($string, $chars) { 
  $length: str-length($string);
  $match: false;

  @for $index from 1 to $length + 1 {
    $char: str-slice($string, $index, $index);
    $match: str-index($chars, $char) != null;

    @if (not $match) {
      @return false;
    }
  }

  @return $match;
}
```

### Description

Test if the given string is consists of the passed chars.

### Parameters

| Name   | Description    | Type   | Default Value |
| ------ | -------------- | ------ | ------------- |
| string | String         | string |               |
| chars  | Expected chars | string |               |

### Returns

` bool `

---

## -bem-is-class-name

### Access

private

### Source

```scss
@function -bem-is-class-name($value) { 
  @return type-of($value) == 'string' and -bem-test(to-lower-case($value), $-bem-class-name-chars);
}
```

### Description

Checks if the passed value is a valid class name.
i.e. it's a string that consists of alphanumerics and '-' char

### Parameters

| Name  | Description | Type   | Default Value |
| ----- | ----------- | ------ | ------------- |
| value | Value       | string |               |

### Returns

` bool `

---

## -bem-is-delimiter

### Access

private

### Source

```scss
@function -bem-is-delimiter($value) { 
  @return type-of($value) == 'string' and -bem-test($value, $-bem-delimiter-chars);
}
```

### Description

Checks if the given value is a delimiter

### Parameters

| Name  | Description | Type   | Default Value |
| ----- | ----------- | ------ | ------------- |
| value | Value       | string |               |

### Returns

` bool `

---

## bem-config

### Source

```scss
@function bem-config($config-props) { 
  @if ($config-props != null) {
    $next-config: map-merge($-bem-config, $config-props);

    @each $delimiter-prop in $-bem-delimiter-props {
      $delimiter: map-get($next-config, $delimiter-prop);

      @if (not -bem-is-delimiter($delimiter)) {
        @error 'bem-config($config-props): #{ $delimiter-prop } should be a valid delimiter string';
      }
    }

    @if (str-index(map-get($next-config, modifier-delimiter), map-get($next-config, element-delimiter)) != null) {
      @error 'bem-config($config-props): $modifier-delimiter cannot contain $element-delimiter';
    }

    @each $formatter-prop in $-bem-formatter-props {
      $formatter: map-get($next-config, $formatter-prop);

      @if ($formatter != null and type-of($formatter) != 'function') {
        @error 'bem-config($config-props): #{ $formatter-prop } should be a function or null';
      }
    }

    $-bem-config: $next-config !global;
  }

  @return $-bem-config;
}
```

### Description

Configures bem

### Parameters

| Name         | Description   | Type | Default Value |
| ------------ | ------------- | ---- | ------------- |
| config-props | Configuration | map  |               |

### Returns

` map ` — config-props

### Throws

* bem-config($config-props): #{ $delimiter-prop } should be a valid delimiter string

* bem-config($config-props): $modifier-delimiter cannot contain $element-delimiter

* bem-config($config-props): #{ $formatter-prop } should be a function or null

---

## -bem-is-name

### Access

private

### Source

```scss
@function -bem-is-name($value) { 
  $element-delimiter: map-get($-bem-config, element-delimiter);
  $modifier-delimiter: map-get($-bem-config, modifier-delimiter);

  @return -bem-is-class-name($value)
    and str-index($value, $element-delimiter) == null
    and str-index($value, $modifier-delimiter) == null;
}
```

### Parameters

| Name  | Description | Type | Default Value |
| ----- | ----------- | ---- | ------------- |
| value | Value       | *    |               |

---

## -bem-format-name

### Access

private

### Source

```scss
@function -bem-format-name($value) { 
  $formatter: map-get($-bem-config, formatter);

  @return if($formatter == null, $name, call($formatter, $name));
}
```

### Parameters

| Name  | Description | Type | Default Value |
| ----- | ----------- | ---- | ------------- |
| value | Value       | *    |               |

### Returns

` string `

---

## -bem-to-name

### Access

private

### Source

```scss
@function -bem-to-name($type, $value) { 
  @if (-bem-is-class-name($value)) {
    $formatter: map-get($-bem-config, '#{ $type }-formatter');
    $name: -bem-format-name(if($formatter == null, $value, call($formatter, $value)));

    @if (-bem-is-name($name)) {
      @return $name;
    }
  }

  @error 'Invalid #{ $type } #{ inspect($value) }';
}
```

### Parameters

| Name  | Description | Type   | Default Value |
| ----- | ----------- | ------ | ------------- |
| type  | Part type   | string |               |
| value | Value       | *      |               |

### Throws

* Invalid #{ $type } #{ inspect($value) }

---

## -bem-format-modifier

### Access

private

### Source

```scss
@function -bem-format-modifier($class-name, $mod-name, $mod-value) { 
  $mod-name: -bem-to-name(modifier, $mod-name);
  $mod-class-name: null;

  @if ($mod-value != null and $mod-value != false and $mod-value != '') {
    $mod-delimiter: map-get($-bem-config, modifier-delimiter);
    $mod-class-name: '#{ $class-name }#{ $mod-delimiter }#{ $mod-name }';

    @if ($mod-value != true) {
      $mod-class-name: '#{ $mod-class-name }#{ $mod-delimiter }#{ -bem-to-name(modifier-value, '#{ $mod-value }') }';
    }
  }
  @return $mod-class-name;
}
```

### Parameters

| Name       | Description    | Type   | Default Value |
| ---------- | -------------- | ------ | ------------- |
| class-name | Class name     | string |               |
| mod-name   | Modifier name  | string |               |
| mod-value  | Modifier value | *      |               |

### Returns

` string `

---

## -bem-to-modifiers

### Access

private

### Source

```scss
@function -bem-to-modifiers($mods) { 
  $type: type-of($mods);
  $mods-map: null;

  @if ($type == map) {
    $mods-map: $mods;
  } @else if ($type == list or $type == arglist) {
    $mods-map: ();
    $length: length($mods);

    @for $index from 1 to $length + 1 {
      $mods-map: map-merge($mods-map, (#{ nth($mods, $index) }: true));
    }
  } @else if ($type == string) {
    $mods-map: (#{ $mods }: true);
  } @else {
    @error 'Invalid modifier #{ inspect($mods) }';
  }

  @return $mods-map;
}
```

### Parameters

| Name | Description | Type              | Default Value |
| ---- | ----------- | ----------------- | ------------- |
| mods | Modifiers   | string, list, map |               |

### Returns

` map `

### Throws

* Invalid modifier #{ inspect($mods) }

---

## -bem-format-modifiers

### Access

private

### Source

```scss
@function -bem-format-modifiers($class-name, $mods) { 
  $mod-class-names: [];

  @if ($mods != null) {
    $mods: -bem-to-modifiers($mods);

    @each $mod-name, $mod-value in $mods {
      $mod-class-name: -bem-format-modifier($class-name, $mod-name, $mod-value);

      @if ($mod-class-name != null) {
        $mod-class-names: append($mod-class-names, $mod-class-name);
      }
    }
  }

  @return $mod-class-names;
}
```

### Parameters

| Name       | Description | Type              | Default Value |
| ---------- | ----------- | ----------------- | ------------- |
| class-name | Class name  | string            |               |
| mods       | Modifiers   | string, list, map |               |

### Returns

` string[] `

---

## -bem-class-names

### Access

private

### Source

```scss
@function -bem-class-names($class-name, $mods, $mixins...) { 
  @return class-names($class-name, -bem-format-modifiers($class-name, $mods), $mixins...);
}
```

### Parameters

| Name       | Description | Type              | Default Value |
| ---------- | ----------- | ----------------- | ------------- |
| class-name | Class name  | string            |               |
| mods       | Modifiers   | string, list, map |               |
| mixins...  | Mixins      | *                 |               |

### Returns

` ?list `

---

## bem-block

### Source

```scss
@function bem-block($block-name, $mods: null, $mixins...) { 
  @return -bem-class-names(-bem-to-name(block, $block-name), $mods, $mixins...);
}
```

### Description

Creates block class names

### Parameters

| Name       | Description | Type              | Default Value |
| ---------- | ----------- | ----------------- | ------------- |
| block-name | Block name  | string            |               |
| mods       | Modifiers   | string, list, map | null          |
| mixins...  | Mixins      | arglist           |               |

### Returns

` ?list `

### Example

```scss
bem-block(FooBar, (ted: qux, zoo: false)) // -&gt; .FooBar.FooBar_ted_qux
bem-block(FooBar, (ted: baz), bem-block(Qux, foo)) // -&gt; .FooBar.FooBar_ted_baz.Qux.Qux_foo
```

---

## bem-element

### Source

```scss
@function bem-element($block-name, $element-name, $mods: null, $mixins) { 
  $element-delimiter: map-get($-bem-config, element-delimiter);
  $class-name: '#{ -bem-to-name(block, $block-name) }#{ $element-delimiter }#{ -bem-to-name(element, $element-name) }';

  @return -bem-class-names($class-name, $mods, $mixins...);
}
```

### Description

Creates element class names

### Parameters

| Name         | Description  | Type              | Default Value |
| ------------ | ------------ | ----------------- | ------------- |
| block-name   | Block name   | string            |               |
| element-name | Element name | string            |               |
| mods         | Modifiers    | string, list, map | null          |
| mixins       | Mixins       | arglist           |               |

### Returns

` ?list `

### Example

```scss
bem-element(FooBar, baz, (ted: qux, zoo: false)) // -&gt; .FooBar__baz.FooBar__baz_ted_qux
bem-element(FooBar, baz, (ted: qux), bem-block(Qux, foo)) // -&gt; .FooBar__baz.FooBar__baz_ted_qux.Qux.Qux_foo
```

---

## bem-modifiers

### Source

```scss
@function bem-modifiers($class-name, $mods: null) { 
  @if (not -bem-is-class-name($class-name)) {
    @error 'Invalid class name #{ inspect($class-name) }';
  }

  @return class-names(-bem-format-modifiers($class-name, $mods));
}
```

### Description

Creates modifiers class names

### Parameters

| Name       | Description | Type              | Default Value |
| ---------- | ----------- | ----------------- | ------------- |
| class-name | Class name  | string            |               |
| mods       | Modifiers   | string, list, map | null          |

### Returns

` list `

### Example

```scss
bem-modifiers(FooBar, (ted: qux, zoo: false)); // -&gt; .FooBar_ted_qux
```

### Throws

* Invalid class name #{ inspect($class-name) }

---