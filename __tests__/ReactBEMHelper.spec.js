import { config } from 'bem';
import ReactHelper from 'ReactHelper';

const { assign } = Object;

/** @ignore */
class MockComponentWithClassName {
  // noinspection JSUnusedGlobalSymbols
  static className = 'MockComponent';

  // noinspection JSUnusedGlobalSymbols
  props = {
    className: 'mixin-class',
  };
}

/** @ignore */
class MockComponentWithNoClassName {
}

const defaultConfig = config();
const bem = new ReactHelper();

describe('ReactHelper', () => {
  let component;
  let componentWithClassName;
  let componentWithNoClassName;

  beforeAll(() => {
    component = new MockComponentWithClassName();
    componentWithClassName = assign(new MockComponentWithNoClassName(), { className: 'FooBar' });
    componentWithNoClassName = new MockComponentWithNoClassName();
  });


  describe('#constructor(configProps)', () => {
    it('should create a new instance of ReactHelper', () => {
      expect(new ReactHelper()).toBeInstanceOf(ReactHelper);
    });
  });

  describe('#config()', () => {
    it('should return config', () => {
      const configProps = { elementDelimiter: '--', modifierDelimiter: '-' };

      expect(new ReactHelper().config()).toEqual(defaultConfig);
      expect(new ReactHelper(configProps).config()).toEqual(assign({}, defaultConfig, configProps));
    });
  });

  describe('#block(target, mods, ...mixins)', () => {
    it('should create block classes for component constructor', () => {
      expect(bem.block(MockComponentWithClassName)).toBe('MockComponent');
      expect(bem.block(MockComponentWithClassName, { foo: 'bar', ted: true }))
          .toBe('MockComponent MockComponent_foo_bar MockComponent_ted');
    });

    it('should create block classes for component instance', () => {
      expect(bem.block(componentWithClassName)).toBe('FooBar');
      expect(bem.block(component)).toBe('MockComponent mixin-class');
      expect(bem.block(component, { foo: 'bar', ted: true }))
          .toBe('MockComponent MockComponent_foo_bar MockComponent_ted mixin-class');
    });

    it('should throw if constructor does not have className', () => {
      expect(() => bem.block(MockComponentWithNoClassName)).toThrow('Invalid block ""');
      expect(() => bem.block(componentWithNoClassName)).toThrow('Invalid block ""');
    });
  });

  describe('#element(target, name, mods, ...mixins)', () => {
    it('should create element classes for component constructor', () => {
      expect(bem.element(MockComponentWithClassName, 'qux')).toBe('MockComponent__qux');
      expect(bem.element(MockComponentWithClassName, 'qux', { foo: 'bar', ted: true }))
          .toBe('MockComponent__qux MockComponent__qux_foo_bar MockComponent__qux_ted');
    });

    it('should create element classes for component instance', () => {
      expect(bem.element(componentWithClassName, 'qux')).toBe('FooBar__qux');
      expect(bem.element(component, 'qux')).toBe('MockComponent__qux');
      expect(bem.element(component, 'qux', { foo: 'bar', ted: true }))
          .toBe('MockComponent__qux MockComponent__qux_foo_bar MockComponent__qux_ted');
    });

    it('should throw if constructor does not have className', () => {
      expect(() => bem.element(MockComponentWithNoClassName, 'qux')).toThrow('Invalid block ""');
      expect(() => bem.element(componentWithNoClassName, 'qux')).toThrow('Invalid block ""');
    });
  });

  describe('#blockModifiers(target, mods)', () => {
    it('should create block modifier classes for component constructor', () => {
      expect(bem.blockModifiers(MockComponentWithClassName)).toBe('');

      expect(bem.blockModifiers(MockComponentWithClassName, 'foo'))
          .toBe('MockComponent_foo');
      expect(bem.blockModifiers(MockComponentWithClassName, { foo: 'bar', ted: true }))
          .toBe('MockComponent_foo_bar MockComponent_ted');
    });

    it('should create block modifier classes for component instance', () => {
      expect(bem.blockModifiers(componentWithClassName)).toBe('');

      // noinspection JSCheckFunctionSignatures
      expect(bem.blockModifiers(component, 'foo')).toBe('MockComponent_foo');

      // noinspection JSCheckFunctionSignatures
      expect(bem.blockModifiers(component, { foo: 'bar', ted: true }))
          .toBe('MockComponent_foo_bar MockComponent_ted');
    });

    it('should throw if constructor does not have className', () => {
      expect(() => bem.blockModifiers(MockComponentWithNoClassName)).toThrow('Invalid block ""');
      expect(() => bem.blockModifiers(componentWithNoClassName)).toThrow('Invalid block ""');
    });
  });

  describe('#elementModifiers(target, name, mods)', () => {
    it('should create element modifier classes for component constructor', () => {
      expect(bem.blockModifiers(MockComponentWithClassName)).toBe('');
      expect(bem.blockModifiers(MockComponentWithClassName, 'foo'))
          .toBe('MockComponent_foo');
      expect(bem.blockModifiers(MockComponentWithClassName, { foo: 'bar', ted: true }))
          .toBe('MockComponent_foo_bar MockComponent_ted');
    });

    it('should create element modifier classes for component instance', () => {
      expect(bem.blockModifiers(componentWithClassName)).toBe('');
      expect(bem.blockModifiers(component, 'foo')).toBe('MockComponent_foo');
      expect(bem.blockModifiers(component, { foo: 'bar', ted: true }))
          .toBe('MockComponent_foo_bar MockComponent_ted');
    });

    it('should throw if constructor does not have className', () => {
      expect(() => bem.blockModifiers(MockComponentWithNoClassName)).toThrow('Invalid block ""');
      expect(() => bem.blockModifiers(componentWithNoClassName)).toThrow('Invalid block ""');
    });
  });
});
