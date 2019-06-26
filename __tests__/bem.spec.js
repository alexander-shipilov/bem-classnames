import kebabCase from 'lodash/kebabCase';
import { bem, block, config, element, modifiers } from 'bem';

const { assign, create, isFrozen } = Object;

describe('bem', () => {
  const formatter = kebabCase;
  const blockFormatter = (name) => `b_${name}`;
  const elementFormatter = (name) => `e_${name}`;
  const modifierFormatter = (name) => `m_${name}`;
  const modifierValueFormatter = (name) => `v_${name}`;

  const defaultConfig = config();

  beforeEach(() => {
    config(defaultConfig);
  });

  describe('config() should return frozen copy of current config', () => {
    expect(defaultConfig).toEqual({
      elementDelimiter: '__',
      modifierDelimiter: '_',
    });

    expect(isFrozen(defaultConfig)).toBeTruthy();
  });

  describe('config(configProps)', () => {
    it('should set and return new config', () => {
      const configProps = { elementDelimiter: '--', modifierDelimiter: '__' };
      const nextConfig = config(configProps);

      expect(nextConfig).toEqual(assign({}, defaultConfig, configProps));
      expect(config()).toEqual(nextConfig);
    });

    it('should throw if invalid delimiters given', () => {
      const invalidDelimiters = [null, '', 'a'];

      ['elementDelimiter', 'modifierDelimiter'].forEach((delimiterProp) => {
        invalidDelimiters.forEach((invalidDelimiter) => {
          expect(() => config({ [delimiterProp]: invalidDelimiter }))
              .toThrow(`config(): ${delimiterProp} should be a valid delimiter`);
        });
      });
    });

    it('should throw if modifierDelimiters contains elementDelimiter', () => {
      expect(() => config({ elementDelimiter: '-', modifierDelimiter: '--' }))
          .toThrow('config(): modifierDelimiter cannot contain elementDelimiter');
    });

    it('should throw if invalid formatters given', () => {
      ['formatter', 'blockFormatter', 'elementFormatter', 'modifierFormatter', 'modifierValueFormatter']
          .forEach((formatterProp) => {
            // noinspection JSCheckFunctionSignatures
            expect(() => config({ [formatterProp]: 1 }))
                .toThrow(`config(): ${formatterProp} should be a function or null`);
          });
    });
  });

  describe('block(blockName, mods, ...mixins)', () => {
    it('should build class names using `blockName` and `mods`', () => {
      expect(block('FooBar')).toBe('FooBar');
      expect(block('FooBar', { ted: 'baz' })).toBe('FooBar FooBar_ted_baz');
    });

    it('should append modifiers classes', () => {
      expect(block('FooBar', { ted: true })).toBe('FooBar FooBar_ted');
      expect(block('FooBar', { ted: 'qux' })).toBe('FooBar FooBar_ted_qux');
      expect(block('FooBar', { ted: 'qux', zoo: false })).toBe('FooBar FooBar_ted_qux');
    });

    it('should append `mixins`', () => {
      expect(block('FooBar', { ted: 'baz' }, 'other')).toBe('FooBar FooBar_ted_baz other');

      expect(block('FooBar', { ted: 'baz' }, ['other1', 'other2']))
          .toBe('FooBar FooBar_ted_baz other1 other2');

      expect(block('FooBar', { ted: 'baz' }, { other1: true, other2: false }))
          .toBe('FooBar FooBar_ted_baz other1');
    });

    it('should use config.blockFormatter and then config.formatter', () => {
      config({ formatter, blockFormatter });

      expect(block('FooBar', { modName: 'modValue' }, { 'mixinClass': true }))
          .toBe('b-foo-bar b-foo-bar_mod-name_mod-value mixinClass');
    });

    it('should throw if invalid `blockName` is given', () => {
      // noinspection JSCheckFunctionSignatures
      expect(() => block(null)).toThrow('Invalid block null');
      expect(() => block('')).toThrow('Invalid block ""');
      expect(() => block('#dd')).toThrow('Invalid block "#dd"');
    });

    it('should throw if invalid `blockName` is given (with config)', () => {
      config({ formatter, blockFormatter });

      // noinspection JSCheckFunctionSignatures
      expect(() => block(null)).toThrow('Invalid block null');
      expect(() => block('')).toThrow('Invalid block ""');
      expect(() => block('#dd')).toThrow('Invalid block "#dd"');
    });

    it('should throw if `blockName` contains delimiters', () => {
      expect(() => block(defaultConfig.elementDelimiter))
          .toThrow(`Invalid block "${defaultConfig.elementDelimiter}"`);

      expect(() => block(defaultConfig.modifierDelimiter))
          .toThrow(`Invalid block "${defaultConfig.modifierDelimiter}"`);
    });
  });

  describe('element(blockName, elementName, mods, ...mixins)', () => {
    it('should build class names using `blockName`, `elementName`', () => {
      expect(element('FooBar', 'baz')).toBe('FooBar__baz');
      expect(element('FooBar', 'baz', { ted: 'qux' })).toBe('FooBar__baz FooBar__baz_ted_qux');
    });

    it('should append modifiers classes from `mods`', () => {
      expect(element('FooBar', 'baz', { ted: true })).toBe('FooBar__baz FooBar__baz_ted');
      expect(element('FooBar', 'baz', { ted: 'qux' })).toBe('FooBar__baz FooBar__baz_ted_qux');
      expect(element('FooBar', 'baz', { ted: 'qux', zoo: false })).toBe('FooBar__baz FooBar__baz_ted_qux');
    });

    it('should append `mixins`', () => {
      expect(element('FooBar', 'baz', { ted: 'qux' }, 'other')).toBe('FooBar__baz FooBar__baz_ted_qux other');

      expect(element('FooBar', 'baz', { ted: 'qux' }, ['other1', 'other2']))
          .toBe('FooBar__baz FooBar__baz_ted_qux other1 other2');

      expect(element('FooBar', 'baz', { ted: 'qux' }, { other1: true, other2: false }))
          .toBe('FooBar__baz FooBar__baz_ted_qux other1');
    });

    it('should use config.elementFormatter and then config.formatter', () => {
      config({ formatter, elementFormatter: (block) => 'e_' + block });

      expect(element('FooBar', 'ted', { modName: 'modValue' }, { 'mixinClass': true }))
          .toBe('foo-bar__e-ted foo-bar__e-ted_mod-name_mod-value mixinClass');
    });

    it('should throw if invalid `elementName` is given', () => {
      // noinspection JSCheckFunctionSignatures
      expect(() => element('FooBar', null)).toThrow('Invalid element null');
      expect(() => element('FooBar', '')).toThrow('Invalid element ""');
      expect(() => element('FooBar', '#')).toThrow('Invalid element "#"');
    });

    it('should throw if invalid `elementName` is given (with config)', () => {
      config({ formatter, elementFormatter });

      // noinspection JSCheckFunctionSignatures
      expect(() => element('FooBar', null)).toThrow('Invalid element null');
      expect(() => element('FooBar', '')).toThrow('Invalid element ""');
      expect(() => element('FooBar', '#')).toThrow('Invalid element "#"');
    });

    it('should throw if `elementName` contains delimiters', () => {
      expect(() => element('FooBar', defaultConfig.elementDelimiter))
          .toThrow(`Invalid element "${defaultConfig.elementDelimiter}"`);

      expect(() => element('FooBar', defaultConfig.modifierDelimiter))
          .toThrow(`Invalid element "${defaultConfig.modifierDelimiter}"`);
    });
  });

  describe('modifiers(className, mods)', () => {
    it('should build class names using `className`, `mods`', () => {
      expect(modifiers('FooBar', { ted: true })).toBe('FooBar_ted');
      expect(modifiers('FooBar', { ted: 'qux' })).toBe('FooBar_ted_qux');
      expect(modifiers('FooBar', { ted: 'qux', zoo: false })).toBe('FooBar_ted_qux');
    });

    it('should support types: string, string[], Set<string>, Map<string, *>, and Object<string, *>', () => {
      // string
      expect(modifiers('FooBar', 'ted')).toBe('FooBar_ted');
      // string[]
      expect(modifiers('FooBar', ['ted'])).toBe('FooBar_ted');
      // Set<string>
      expect(modifiers('FooBar', new Set(['ted']))).toBe('FooBar_ted');
      // Map<string, *>
      expect(modifiers('FooBar', new Map([['ted', 'qux']]))).toBe('FooBar_ted_qux');
      expect(modifiers('FooBar', new Map([['ted', 'qux'], ['zoo', false]]))).toBe('FooBar_ted_qux');
      // Object<string, *>
      expect(modifiers('FooBar', { ted: 'qux' })).toBe('FooBar_ted_qux');
      expect(modifiers('FooBar', { ted: 'qux', zoo: false })).toBe('FooBar_ted_qux');
    });

    it('should return an empty string if no `mods` provided or `mods` is empty', () => {
      expect(modifiers('FooBar')).toBe('');
      expect(modifiers('FooBar', [])).toBe('');
      expect(modifiers('FooBar', new Set())).toBe('');
      expect(modifiers('FooBar', new Map())).toBe('');
      expect(modifiers('FooBar', {})).toBe('');
      expect(modifiers('FooBar', create({ foo: 'bar' }))).toBe('');
    });

    it('should skip `mods` with falsy values (but not 0)', () => {
      expect(modifiers('FooBar', { ted: undefined })).toBe('');
      expect(modifiers('FooBar', { ted: null })).toBe('');
      expect(modifiers('FooBar', { ted: false })).toBe('');
      expect(modifiers('FooBar', { ted: '' })).toBe('');

      expect(modifiers('FooBar', { ted: 0 })).toBe('FooBar_ted_0');
    });

    it('should use config.modifierFormatter, config.modifierValueFormatter and then config.formatter', () => {
      config({ formatter, modifierFormatter, modifierValueFormatter });

      expect(element('FooBar', 'ted', { modName: 'modValue' }, { 'mixinClass': true }))
          .toBe('foo-bar__ted foo-bar__ted_m-mod-name_v-mod-value mixinClass');
    });

    it('should throw if invalid `mods` given', () => {
      const test = () => {
        const invalid = ['', '#', 1, true];

        expect(() => modifiers('FooBar', { '': true })).toThrow('Invalid modifier ""');
        expect(() => modifiers('FooBar', { '#': true })).toThrow('Invalid modifier "#"');

        invalid.forEach((mod) => {
          const modString = JSON.stringify(mod);

          expect(() => modifiers('FooBar', mod)).toThrow(`Invalid modifier ${modString}`);
          expect(() => modifiers('FooBar', [mod])).toThrow(`Invalid modifier ${modString}`);
          expect(() => modifiers('FooBar', new Set([mod]))).toThrow(`Invalid modifier ${modString}`);
          expect(() => modifiers('FooBar', new Map([[mod, true]]))).toThrow(`Invalid modifier ${modString}`);
        });

        expect(() => modifiers('FooBar', { ted: '#' })).toThrow('Invalid modifierValue "#"');
      };

      test();

      // with config
      config({ formatter, modifierFormatter, modifierValueFormatter });
      test();
    });

    it('should throw if keys or values of `mods` contain delimiters', () => {
      expect(() => modifiers('FooBar', { [defaultConfig.elementDelimiter]: true }))
          .toThrow(`Invalid modifier "${defaultConfig.elementDelimiter}"`);

      expect(() => modifiers('FooBar', { [defaultConfig.modifierDelimiter]: true }))
          .toThrow(`Invalid modifier "${defaultConfig.modifierDelimiter}"`);

      expect(() => modifiers('FooBar', { ted: defaultConfig.elementDelimiter }))
          .toThrow(`Invalid modifierValue "${defaultConfig.elementDelimiter}"`);

      expect(() => modifiers('FooBar', { ted: defaultConfig.modifierDelimiter }))
          .toThrow(`Invalid modifierValue "${defaultConfig.modifierDelimiter}"`);
    });
  });

  describe('bem() should return BEM object', () => {
    const configProps = { formatter, modifierFormatter, modifierValueFormatter };
    const bemObject= bem(configProps);

    expect(bemObject.config()).toEqual(assign({}, defaultConfig, configProps));
  });
});
