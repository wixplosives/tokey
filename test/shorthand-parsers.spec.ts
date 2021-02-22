import { expect } from 'chai';
import { describe, it } from 'mocha';

import { createCssValueAST, CSSCodeAst } from '../src/parsers/css-value-tokenizer';
import {
  ParseShorthandAPI,
  OpenedShorthand,
  ShorthandOpenerInner,
  Paddings,
  ShorthandsTypeMap,
  evaluateAst,
  edgesShorthandOpener,
  getShorthandOpener,
  openBackgroundShorthandLayerInner,
  openBackgroundShorthandLastLayerInner,
  NoMandatoryPartMatchError,
  InvalidEdgesInputLengthError,
  NoDataTypeMatchError,
} from '../src/shorthands';
import {
  DEFAULT_COLOR,
  DEFAULT_BACKGROUND_COLOR,
  DEFAULT_BG_IMAGE,
  DEFAULT_BG_SIZE,
  DEFAULT_REPEAT_STYLE,
  DEFAULT_ATTACHMENT,
  DEFAULT_LINE_HEIGHT,
  DEFAULT_FLEX_GROW,
  DEFAULT_FLEX_SHRINK,
  INITIAL_FLEX_BASIS,
  DEFAULT_FLEX_BASIS,
  AUTO_FLEX_GROW,
  NONE_FLEX_SHRINK,
} from '../src/css-data-types';

type CSSCodeAstMap = Map<CSSCodeAst, CSSCodeAst[]>;
type OpenPropAst<T extends string> = (
  ast: CSSCodeAst[],
  map?: CSSCodeAstMap,
  shallow?: boolean,
) => OpenedShorthand<T>;

const createSimpleApi: (map: CSSCodeAstMap) => ParseShorthandAPI = map => ({
  isExpression: node => map.has(node),
  getValue: node => map.get(node) || [],
});

const createInnerOpenPropAst = <T extends string>(openShorthand: ShorthandOpenerInner<T>): OpenPropAst<T> =>
  (ast: CSSCodeAst[], map: CSSCodeAstMap = new Map()) => {
    const api = createSimpleApi(map);
    return openShorthand(evaluateAst(ast, api), api);
  };

const createOpenPropAst = <T extends keyof ShorthandsTypeMap>(prop: T): OpenPropAst<ShorthandsTypeMap[T]> =>
  (ast, map = new Map(), shallow = false) => getShorthandOpener(prop)(ast, createSimpleApi(map), shallow);

// TODO: Test default marking in value/origin
const defaultNode = (value: string) => ({
  value: {
    type: 'text',
    text: value,
    start: 0,
    end: value.length,
    after: [],
    before: [],
  },
});

const UniversalKeywordTest = <T extends keyof ShorthandsTypeMap>(
  prop: T,
  expectedProps: Array<ShorthandsTypeMap[T]>,
  description?: string,
  shallow = false,
) => {
  it(`should open ${prop + (description ? (' ' + description) : '')} shorthand with a universal keyword`, () => {
    const openPropAst = createOpenPropAst(prop);
    const ast = createCssValueAST('inherit');

    const expectedOpened = expectedProps.reduce((currExpectedOpened, expecterProp) => {
      currExpectedOpened[expecterProp] = { value: ast[0] };
      return currExpectedOpened;
    }, {} as Record<ShorthandsTypeMap[T], any>);

    expect(openPropAst(ast, undefined, shallow)).to.eql(expectedOpened);
  });
};


describe('Edges Shorthand Parser', () => {
  const EdgeShorthandTest = (
    prop: string,
    description: string,
    value: string,
    astIndices: number[],
    opener?: OpenPropAst<string>,
  ) => {
    const openPropAst = opener || createInnerOpenPropAst(edgesShorthandOpener<string>(prop));
    const [ prefix, suffix ] = prop.split('-');
    const finalSuffix = suffix ? `-${suffix}` : '';

    it(`should open ${prop} shorthand: ${description}`, () => {
      const ast = createCssValueAST(value);
  
      expect(openPropAst(ast)).to.eql({
        [`${prefix}-top${finalSuffix}`]:    { value: ast[astIndices[0]] },
        [`${prefix}-right${finalSuffix}`]:  { value: ast[astIndices[1]] },
        [`${prefix}-bottom${finalSuffix}`]: { value: ast[astIndices[2]] },
        [`${prefix}-left${finalSuffix}`]:   { value: ast[astIndices[3]] },
      });
    });
  };

  describe('border-style - inner', () => {
    EdgeShorthandTest('border-style', 'all edges', '10px', [0, 0, 0, 0]);
    EdgeShorthandTest('border-style', 'top-bottom right-left', '10px 12px', [0, 1, 0, 1]);
    EdgeShorthandTest('border-style', 'top right-left bottom', '10px 12px 13px', [0, 1, 2, 1]);
    EdgeShorthandTest('border-style', 'top right bottom left', '10px 11px 12px 13px', [0, 1, 2, 3]);
  });

  const EdgeShorthandOpenerSuite = <T extends keyof ShorthandsTypeMap>(
    prop: T,
    expectedProps: Array<ShorthandsTypeMap[T]>,
  ) => {
    describe(prop, () => {
      UniversalKeywordTest(prop, expectedProps);
      EdgeShorthandTest(prop, 'full opener', '10px 11px 12px 13px', [0, 1, 2, 3], createOpenPropAst(prop));
    });
  };

  EdgeShorthandOpenerSuite('margin', [
    'margin-top',
    'margin-right',
    'margin-bottom',
    'margin-left',
  ]);

  EdgeShorthandOpenerSuite('padding', [
    'padding-top',
    'padding-right',
    'padding-bottom',
    'padding-left',
  ]);
  
  EdgeShorthandOpenerSuite('border-style', [
    'border-top-style',
    'border-right-style',
    'border-bottom-style',
    'border-left-style',
  ]);

  EdgeShorthandOpenerSuite('border-width', [
    'border-top-width',
    'border-right-width',
    'border-bottom-width',
    'border-left-width',
  ]);

  EdgeShorthandOpenerSuite('border-color', [
    'border-top-color',
    'border-right-color',
    'border-bottom-color',
    'border-left-color',
  ]);

  const openPaddingAstInner = createInnerOpenPropAst(edgesShorthandOpener<Paddings>('padding'));

  describe('variables', () => {
    it('should include usages for variable with one item that is used once', () => {
      const edgeValueWithVar = '10px $var 13px';
      const varValue = '11px';
      const ast = createCssValueAST(edgeValueWithVar);
      const varAst = createCssValueAST(varValue);
      const varsMap = new Map([[ast[1], varAst]]);
  
      expect(openPaddingAstInner(ast, varsMap)).to.eql({
        'padding-top':    { value: ast[0] },
        'padding-right':  { value: varAst[0], origin: ast[1] },
        'padding-bottom': { value: ast[2] },
        'padding-left':   { value: varAst[0], origin: ast[1] },
      });
    });
  
    it('should include usages for variable with two items that is used once', () => {
      const edgeValueWithVar = '10px $var 13px';
      const varValue = '11px 12px';
      const ast = createCssValueAST(edgeValueWithVar);
      const varAst = createCssValueAST(varValue);
      const varsMap = new Map([[ast[1], varAst]]);
  
      expect(openPaddingAstInner(ast, varsMap)).to.eql({
        'padding-top':    { value: ast[0] },
        'padding-right':  { value: varAst[0], origin: ast[1] },
        'padding-bottom': { value: varAst[1], origin: ast[1] },
        'padding-left':   { value: ast[2] },
      });
    });

    it('should include usages for variable with one item that is used twice', () => {
      const edgeValueWithVarUsedTwice = '10px $var 12px $var';
      const varValue = '11px';
      const ast = createCssValueAST(edgeValueWithVarUsedTwice);
      const varAst = createCssValueAST(varValue);
      const varsMap = new Map([[ast[1], varAst], [ast[3], varAst]]);
  
      expect(openPaddingAstInner(ast, varsMap)).to.eql({
        'padding-top':    { value: ast[0] },
        'padding-right':  { value: varAst[0], origin: ast[1] },
        'padding-bottom': { value: ast[2] },
        'padding-left':   { value: varAst[0], origin: ast[3] },
      });
    });

    it('should include usages for values containing one variable for the whole value', () => {
      const edgeValueOnlyVar = '$var';
      const ast = createCssValueAST(edgeValueOnlyVar);
      const varAst = createCssValueAST('10px 11px 12px 13px');
      const varsMap = new Map([[ast[0], varAst]]);
  
      expect(openPaddingAstInner(ast, varsMap)).to.eql({
        'padding-top':    { value: varAst[0], origin: ast[0] },
        'padding-right':  { value: varAst[1], origin: ast[0] },
        'padding-bottom': { value: varAst[2], origin: ast[0] },
        'padding-left':   { value: varAst[3], origin: ast[0] },
      });
    });
  });

  describe('errors', () => {
    it('should not open edges shorthand for invalid lengths', () => {
      const ast = createCssValueAST('1px 2px 3px 4px 5px');

      expect(() => openPaddingAstInner(ast)).to.throw(InvalidEdgesInputLengthError, /\[padding\].*5/);
    });
  });
});

describe('Corners Shorthand Parser', () => {
  type BorderRadiusTest = { description: string, value: string, astIndices: number[] };
  const borderRadiusValues: BorderRadiusTest[] = [
    { description: 'all corners', value: '10px', astIndices: [0, 0, 0, 0] },
    { description: 'top-left-bottom-right top-right-bottom-left', value: '10px 12px', astIndices: [0, 1, 0, 1] },
    { description: 'top-left top-right-bottom-left bottom-right', value: '10px 12px 13px', astIndices: [0, 1, 2, 1] },
    { description: 'top-left top-right bottom-right bottom-left', value: '10px 11px 12px 13px', astIndices: [0, 1, 2, 3] },
  ];

  const openBorderRadiusAst = createOpenPropAst('border-radius');

  UniversalKeywordTest('border-radius', [
    'border-top-left-radius',
    'border-top-right-radius',
    'border-bottom-right-radius',
    'border-bottom-left-radius',
  ]);

  describe('single radius', () => {
    const SingleRadiusCornerShorthandTest = ({ description, value, astIndices }: BorderRadiusTest) => {
      it(`should parse ${description} corner shorthand`, () => {
        const ast = createCssValueAST(value);
    
        expect(openBorderRadiusAst(ast)).to.eql({
          'border-top-left-radius':     [{ value: ast[astIndices[0]] }],
          'border-top-right-radius':    [{ value: ast[astIndices[1]] }],
          'border-bottom-right-radius': [{ value: ast[astIndices[2]] }],
          'border-bottom-left-radius':  [{ value: ast[astIndices[3]] }],
        });
      });
    };

    SingleRadiusCornerShorthandTest(borderRadiusValues[0]);
    SingleRadiusCornerShorthandTest(borderRadiusValues[1]);
    SingleRadiusCornerShorthandTest(borderRadiusValues[2]);
    SingleRadiusCornerShorthandTest(borderRadiusValues[3]);
  });

  describe('multi radius', () => {
    const MultiRadiusCornerShorthandTest = (firstTest: BorderRadiusTest, secondTest: BorderRadiusTest) => {  
      it(`should parse ${firstTest.description} / ${secondTest.description} corner shorthand`, () => {
        const ast = createCssValueAST(`${firstTest.value} / ${secondTest.value}`);
        const firstTestItems = firstTest.value.split(' ').length;

        expect(openBorderRadiusAst(ast)).to.eql({
          'border-top-left-radius':     [{ value: ast[firstTest.astIndices[0]] }, { value: ast[secondTest.astIndices[0] + firstTestItems + 1] }],
          'border-top-right-radius':    [{ value: ast[firstTest.astIndices[1]] }, { value: ast[secondTest.astIndices[1] + firstTestItems + 1] }],
          'border-bottom-right-radius': [{ value: ast[firstTest.astIndices[2]] }, { value: ast[secondTest.astIndices[2] + firstTestItems + 1] }],
          'border-bottom-left-radius':  [{ value: ast[firstTest.astIndices[3]] }, { value: ast[secondTest.astIndices[3] + firstTestItems + 1] }],
        });
      });
    };
  
    borderRadiusValues.forEach(firstTest => {
      borderRadiusValues.forEach(secondTest => {
        MultiRadiusCornerShorthandTest(firstTest, secondTest);
      });
    });
  });

  // TODO: More with defaults
});

// TODO: Tests with vars
describe('Border/Outline Shorthand Parser', () => {
  describe('border', () => {
    const BorderShallowSuite = <T extends keyof ShorthandsTypeMap>(
      prop: T,
      shallow = false,
    ) => {
      const expectedProps = [
        `${prop}-style`,
        `${prop}-width`,
        `${prop}-color`,
      ] as Array<ShorthandsTypeMap[T]>;

      UniversalKeywordTest(prop, expectedProps, 'shallow', shallow);
  
      it(`should shallow open ${prop} shorthand`, () => {
        const openPropAst = createOpenPropAst(prop);
        const ast = createCssValueAST('1px solid black');
    
        expect(openPropAst(ast, undefined, shallow)).to.eql({
          [expectedProps[0]]: { value: ast[1] },
          [expectedProps[1]]: { value: ast[0] },
          [expectedProps[2]]: { value: ast[2] },
        });
      });
    };

    describe('shallow', () => {
      const openBorderAstShallow = createOpenPropAst('border');

      BorderShallowSuite('border', true);
    
      it('should error on double data-type match, for single-appearance data-type', () => {
        const ast = createCssValueAST('1px red black');
    
        expect(() => openBorderAstShallow(ast, undefined, true)).to.throw(NoDataTypeMatchError, 'black');
      });
    
      it('should open partial border shorthand', () => {
        const ast = createCssValueAST('dashed 5px');
    
        expect(openBorderAstShallow(ast, undefined, true)).to.eql({
          'border-style': { value: ast[0] },
          'border-width': { value: ast[1] },
          'border-color': defaultNode(DEFAULT_COLOR),
        });
      });
    });
    
    describe('deep', () => {
      const openBorderAst = createOpenPropAst('border');
  
      UniversalKeywordTest('border', [
        'border-top-style',
        'border-bottom-style',
        'border-left-style',
        'border-right-style',
        'border-top-width',
        'border-bottom-width',
        'border-left-width',
        'border-right-width',
        'border-top-color',
        'border-bottom-color',
        'border-left-color',
        'border-right-color',
      ], 'deep');
  
      it('should deep open border shorthand', () => {
        const ast = createCssValueAST('solid 1px black');
    
        expect(openBorderAst(ast)).to.eql({
          'border-top-style':    { value: ast[0] },
          'border-bottom-style': { value: ast[0] },
          'border-left-style':   { value: ast[0] },
          'border-right-style':  { value: ast[0] },
          'border-top-width':    { value: ast[1] },
          'border-bottom-width': { value: ast[1] },
          'border-left-width':   { value: ast[1] },
          'border-right-width':  { value: ast[1] },
          'border-top-color':    { value: ast[2] },
          'border-bottom-color': { value: ast[2] },
          'border-left-color':   { value: ast[2] },
          'border-right-color':  { value: ast[2] },
        });
      });
    });

    describe('edges', () => {
      BorderShallowSuite('border-top');
      BorderShallowSuite('border-right');
      BorderShallowSuite('border-bottom');
      BorderShallowSuite('border-left');
    });
  });

  describe('outline', () => {
    const openOutlineAst = createOpenPropAst('outline');

    UniversalKeywordTest('outline', [
      'outline-style',
      'outline-width',
      'outline-color',
    ]);

    it('should open outline shorthand', () => {
      const ast = createCssValueAST('1px solid black');
  
      expect(openOutlineAst(ast)).to.eql({
        'outline-style': { value: ast[1] },
        'outline-width': { value: ast[0] },
        'outline-color': { value: ast[2] },
      });
    });
  
    it('should open partial outline shorthand', () => {
      const ast = createCssValueAST('dashed 5px');
  
      expect(openOutlineAst(ast)).to.eql({
        'outline-style': { value: ast[0] },
        'outline-width': { value: ast[1] },
        'outline-color': defaultNode(DEFAULT_COLOR),
      });
    });
  });

  // TODO: More with defaults
});

// TODO: Tests with vars
describe('Background Shorthand Parser', () => {
  describe('single layer', () => {
    const openBackgroundLayerAst = createInnerOpenPropAst(openBackgroundShorthandLayerInner);

    it('should open background shorthand layer', () => {
      const ast = createCssValueAST('border-box fixed linear-gradient(red 0%, blue 100%) padding-box repeat-x center / contain');

      expect(openBackgroundLayerAst(ast)).to.eql({
        'background-attachment': { value: ast[1] },
        'background-clip':       { value: ast[3] },
        'background-image':      { value: ast[2] },
        'background-origin':     { value: ast[0] },
        'background-position':   [ { value: ast[5] } ],
        'background-repeat':     [ { value: ast[4] } ],
        'background-size':       [ { value: ast[7] } ],
      });
    });

    it('should open last background shorthand layer', () => {
      const openBackgroundLastLayerAst = createInnerOpenPropAst(openBackgroundShorthandLastLayerInner);
      const ast = createCssValueAST('border-box fixed linear-gradient(red 0%, blue 100%) padding-box repeat-x center / contain orange');

      expect(openBackgroundLastLayerAst(ast)).to.eql({
        'background-attachment': { value: ast[1] },
        'background-clip':       { value: ast[3] },
        'background-color':      { value: ast[8] },
        'background-image':      { value: ast[2] },
        'background-origin':     { value: ast[0] },
        'background-position':   [ { value: ast[5] } ],
        'background-repeat':     [ { value: ast[4] } ],
        'background-size':       [ { value: ast[7] } ],
      });
    });

    it('should open background shorthand layer for multiple-appearance data-type with single data-type match', () => {
      const ast = createCssValueAST('fixed border-box linear-gradient(red 0%, blue 100%) repeat-x center / contain');

      expect(openBackgroundLayerAst(ast)).to.eql({
        'background-attachment': { value: ast[0] },
        'background-clip':       { value: ast[1] },
        'background-image':      { value: ast[2] },
        'background-origin':     { value: ast[1] },
        'background-position':   [ { value: ast[4] } ],
        'background-repeat':     [ { value: ast[3] } ],
        'background-size':       [ { value: ast[6] } ],
      });
    });

    it('should open background shorthand layer for look-ahead data-types with multi-values', () => {
      const ast = createCssValueAST('border-box fixed linear-gradient(red 0%, blue 100%) padding-box round space top 10px left 30% / auto 60px');

      expect(openBackgroundLayerAst(ast)).to.eql({
        'background-attachment': { value: ast[1] },
        'background-clip':       { value: ast[3] },
        'background-image':      { value: ast[2] },
        'background-origin':     { value: ast[0] },
        'background-position':   [ { value: ast[6]  },  { value: ast[7]  }, { value: ast[8] }, { value: ast[9] } ],
        'background-repeat':     [ { value: ast[4]  },  { value: ast[5]  } ],
        'background-size':       [ { value: ast[11] },  { value: ast[12] } ],
      });
    });

    it('should open background shorthand layer for different items with the same value', () => {
      const ast = createCssValueAST('border-box fixed linear-gradient(red 0%, blue 100%) padding-box repeat-x 30% / 30%');

      expect(openBackgroundLayerAst(ast)).to.eql({
        'background-attachment': { value: ast[1] },
        'background-clip':       { value: ast[3] },
        'background-image':      { value: ast[2] },
        'background-origin':     { value: ast[0] },
        'background-position':   [ { value: ast[5] } ],
        'background-repeat':     [ { value: ast[4] } ],
        'background-size':       [ { value: ast[7] } ],
      });
    });

    describe('errors', () => {
      it('should not open background shorthand layer for optional values appearing after the wrong value', () => {
        const ast = createCssValueAST('border-box fixed linear-gradient(red 0%, blue 100%) padding-box repeat-x / contain center');

        expect(() => openBackgroundLayerAst(ast)).to.throw(NoDataTypeMatchError, '/');
      });

      it('should not open background shorthand layer for optional values appearing without the right delimiter', () => {
        const ast = createCssValueAST('border-box fixed linear-gradient(red 0%, blue 100%) padding-box repeat-x center contain');

        expect(() => openBackgroundLayerAst(ast)).to.throw(NoDataTypeMatchError, 'contain');
      });

      it('should not open background shorthand non-last layer with last layer values', () => {
        const ast = createCssValueAST('border-box fixed linear-gradient(red 0%, blue 100%) padding-box repeat-x center / contain orange');

        expect(() => openBackgroundLayerAst(ast)).to.throw(NoDataTypeMatchError, 'orange');
      });
    });
  });

  describe('multiple layers', () => {
    const openBackgroundAst = createOpenPropAst('background');

    UniversalKeywordTest('background', [
      'background-attachment',
      'background-clip',
      'background-image',
      'background-origin',
      'background-position',
      'background-repeat',
      'background-size',
      'background-color',
    ]);

    it('should open background shorthand with a single layer', () => {
      const ast = createCssValueAST('#AABBCC linear-gradient(green 0%, yellow 100%) 40% 30% / auto border-box fixed padding-box repeat-x');

      expect(openBackgroundAst(ast)).to.eql({
        'background-attachment': { value: ast[7] },
        'background-clip':       { value: ast[8] },
        'background-image':      { value: ast[1] },
        'background-origin':     { value: ast[6] },
        'background-position':   [ { value: ast[2] }, { value: ast[3] } ],
        'background-repeat':     [ { value: ast[9] } ],
        'background-size':       [ { value: ast[5] } ],
        'background-color':      { value: ast[0] },
      });
    });

    it('should open background shorthand with multiple layers', () => {
      const ast = createCssValueAST([
        'border-box fixed linear-gradient(red 0%, blue 100%) padding-box repeat-x center / contain',
        '#AABBCC linear-gradient(green 0%, yellow 100%) 40% 30% / auto border-box fixed padding-box repeat-x',
      ].join(', '));

      expect(openBackgroundAst(ast)).to.eql({
        'background-attachment': [ { value: ast[1] }, { value: ast[16] } ],
        'background-clip':       [ { value: ast[3] }, { value: ast[17] } ],
        'background-image':      [ { value: ast[2] }, { value: ast[10] } ],
        'background-origin':     [ { value: ast[0] }, { value: ast[15] } ],
        'background-position':   [ [ { value: ast[5] } ], [ { value: ast[11] }, { value: ast[12] } ] ],
        'background-repeat':     [ [ { value: ast[4] } ], [ { value: ast[18] } ] ],
        'background-size':       [ [ { value: ast[7] } ], [ { value: ast[14] } ] ],
        'background-color':      { value: ast[9] },
      });
    });

    describe('defaults', () => {
      it('should open background shorthand with multiple layers and default values', () => {
        const ast = createCssValueAST([
          'border-box linear-gradient(red 0%, blue 100%) padding-box center / contain',
          '40% 30% border-box fixed padding-box repeat-x',
        ].join(', '));
  
        expect(openBackgroundAst(ast)).to.eql({
          'background-attachment': [ defaultNode(DEFAULT_ATTACHMENT), { value: ast[10] } ],
          'background-clip':       [ { value: ast[2] }, { value: ast[11] } ],
          'background-image':      [ { value: ast[1] }, defaultNode(DEFAULT_BG_IMAGE) ],
          'background-origin':     [ { value: ast[0] }, { value: ast[9] } ],
          'background-position':   [ [ { value: ast[3] } ], [ { value: ast[7] }, { value: ast[8] } ] ],
          'background-repeat':     [ [ defaultNode(DEFAULT_REPEAT_STYLE) ], [ { value: ast[12] } ] ],
          'background-size':       [ [ { value: ast[5] } ], [ defaultNode(DEFAULT_BG_SIZE) ] ],
          'background-color':      defaultNode(DEFAULT_BACKGROUND_COLOR),
        });
      });
    });
  });
});

// TODO: Tests with vars
describe('Font Shorthand Parser', () => {
  const openFontAst = createOpenPropAst('font');

  describe('keyword values', () => {
    it('should leave font shorthand with keyword value as it is', () => {
      const ast = createCssValueAST('message-box');
  
      expect(openFontAst(ast)).to.eql({
        'font': { value: ast[0] },
      });
    });

    UniversalKeywordTest('font', [
      'font-family',
      'font-size',
      'font-stretch',
      'font-style',
      'font-variant',
      'font-weight',
      'line-height',
    ]);
  });

  it('should open font shorthand', () => {
    const ast = createCssValueAST('italic small-caps bold condensed 10px / 1.2 "Font 1", fallback');

    expect(openFontAst(ast)).to.eql({
      'font-family':  [ { value: ast[7] }, { value: ast[8] }, { value: ast[9] } ],
      'font-size':    { value: ast[4] },
      'font-stretch': { value: ast[3] },
      'font-style':   [ { value: ast[0] } ],
      'font-variant': { value: ast[1] },
      'font-weight':  { value: ast[2] },
      'line-height':  { value: ast[6] },
    });
  });

  it('should open font shorthand without line-height', () => {
    const ast = createCssValueAST('italic small-caps bold condensed 10px "Font 1", fallback');

    expect(openFontAst(ast)).to.eql({
      'font-family':  [ { value: ast[5] }, { value: ast[6] }, { value: ast[7] } ],
      'font-size':    { value: ast[4] },
      'font-stretch': { value: ast[3] },
      'font-style':   [ { value: ast[0] } ],
      'font-variant': { value: ast[1] },
      'font-weight':  { value: ast[2] },
      'line-height': defaultNode(DEFAULT_LINE_HEIGHT),
    });
  });

  it('should open font shorthand prefix properties', () => {
    const ast = createCssValueAST('oblique 45deg small-caps 700 condensed 10px / 1.2 serif');

    expect(openFontAst(ast)).to.eql({
      'font-stretch': { value: ast[4] },
      'font-style':   [ { value: ast[0] }, { value: ast[1] } ],
      'font-variant': { value: ast[2] },
      'font-weight':  { value: ast[3] },

      'font-size':    { value: ast[5] },
      'line-height':  { value: ast[7] },
      'font-family':  [ { value: ast[8] } ],
    });
  });

  it('should open font shorthand prefix properties with common items', () => {
    const ast = createCssValueAST('normal italic normal bold 10px / 1.2 serif');

    expect(openFontAst(ast)).to.eql({
      'font-stretch': { value: ast[2] },
      'font-style':   [ { value: ast[1] } ],
      'font-variant': { value: ast[0] },
      'font-weight':  { value: ast[3] },

      'font-size':    { value: ast[4] },
      'line-height':  { value: ast[6] },
      'font-family':  [ { value: ast[7] } ],
    });
  });

  // TODO: More with defaults

  describe('errors', () => {
    it('should not open font shorthand for values without mandatory items', () => {
      const noSizeAst = createCssValueAST('italic small-caps bold condensed "Font 1", fallback');

      expect(() => openFontAst(noSizeAst)).to.throw(NoMandatoryPartMatchError, /\[font\].*font-size/);

      const noFamilyAst = createCssValueAST('italic small-caps bold condensed 10px / 1.2');

      expect(() => openFontAst(noFamilyAst)).to.throw(NoMandatoryPartMatchError, /\[font\].*font-family/);
    });
  });
});

// TODO: Tests with vars
describe('Flex Shorthand Parser', () => {
  const openFlexAst = createOpenPropAst('flex');
  
  describe('keyword values', () => {
    it('should open flex shorthand with "initial" keyword', () => {
      const ast = createCssValueAST('initial');

      expect(openFlexAst(ast)).to.eql({
        'flex-grow':   defaultNode(DEFAULT_FLEX_GROW),
        'flex-shrink': defaultNode(DEFAULT_FLEX_SHRINK),
        'flex-basis':  defaultNode(INITIAL_FLEX_BASIS),
      });
    });

    it('should open flex shorthand with "auto" keyword', () => {
      const ast = createCssValueAST('auto');

      expect(openFlexAst(ast)).to.eql({
        'flex-grow':   defaultNode(AUTO_FLEX_GROW),
        'flex-shrink': defaultNode(DEFAULT_FLEX_SHRINK),
        'flex-basis':  defaultNode(INITIAL_FLEX_BASIS),
      });
    });

    it('should open flex shorthand with "none" keyword', () => {
      const ast = createCssValueAST('none');

      expect(openFlexAst(ast)).to.eql({
        'flex-grow':   defaultNode(DEFAULT_FLEX_GROW),
        'flex-shrink': defaultNode(NONE_FLEX_SHRINK),
        'flex-basis':  defaultNode(INITIAL_FLEX_BASIS),
      });
    });

    UniversalKeywordTest('flex', [
      'flex-grow',
      'flex-shrink',
      'flex-basis',
    ]);
  });

  it('should open flex shorthand with 1-value syntax', () => {
    const ast = createCssValueAST('2');

    expect(openFlexAst(ast)).to.eql({
      'flex-grow':   { value: ast[0] },
      'flex-shrink': defaultNode(DEFAULT_FLEX_SHRINK),
      'flex-basis':  defaultNode(DEFAULT_FLEX_BASIS),
    });
  });

  it('should open flex shorthand with 2-value syntax', () => {
    const astWithShrink = createCssValueAST('2 3');

    expect(openFlexAst(astWithShrink)).to.eql({
      'flex-grow':   { value: astWithShrink[0] },
      'flex-shrink': { value: astWithShrink[1] },
      'flex-basis':  defaultNode(DEFAULT_FLEX_BASIS),
    });

    const astWithBasis = createCssValueAST('2 10px');

    expect(openFlexAst(astWithBasis)).to.eql({
      'flex-grow':   { value: astWithBasis[0] },
      'flex-shrink': defaultNode(DEFAULT_FLEX_SHRINK),
      'flex-basis':  { value: astWithBasis[1] },
    });
  });

  it('should open flex shorthand with 3-value syntax', () => {
    const ast = createCssValueAST('2 3 10px');

    expect(openFlexAst(ast)).to.eql({
      'flex-grow':   { value: ast[0] },
      'flex-shrink': { value: ast[1] },
      'flex-basis':  { value: ast[2] },
    });
  });

  describe('errors', () => {
    it('should not open flex shorthand with invalid 1-value syntax', () => {
      const ast = createCssValueAST('10px');

      expect(() => openFlexAst(ast)).to.throw(NoMandatoryPartMatchError, /\[flex\].*flex-grow/);
    });

    it('should not open flex shorthand with invalid 2-value syntax', () => {
      const invalidGrowAst = createCssValueAST('10px 3');

      expect(() => openFlexAst(invalidGrowAst)).to.throw(NoMandatoryPartMatchError, /\[flex\].*flex-grow/);
      
      const invalidShrinkBasisAst = createCssValueAST('2 italic');

      expect(() => openFlexAst(invalidShrinkBasisAst)).to.throw(NoMandatoryPartMatchError, /\[flex\].*flex-shrink, flex-basis/);

    });

    it('should not open flex shorthand with invalid 3-value syntax', () => {
      const invalidGrowAst = createCssValueAST('10px 3 auto');

      expect(() => openFlexAst(invalidGrowAst)).to.throw(NoMandatoryPartMatchError, /\[flex\].*flex-grow/);

      const invalidShrinkBasisAst = createCssValueAST('2 10px 3');

      expect(() => openFlexAst(invalidShrinkBasisAst)).to.throw(NoMandatoryPartMatchError, /\[flex\].*flex-shrink/);

      const invalidShrinkAst = createCssValueAST('2 italic auto');

      expect(() => openFlexAst(invalidShrinkAst)).to.throw(NoMandatoryPartMatchError, /\[flex\].*flex-shrink, flex-basis/);


      const invalidBasisAst = createCssValueAST('2 3 italic');

      expect(() => openFlexAst(invalidBasisAst)).to.throw(NoMandatoryPartMatchError, /\[flex\].*flex-basis/);
    });
  });
});

// TODO: Tests with vars
describe('Overflow Shorthand Parser', () => {
  const openOverflowAst = createOpenPropAst('overflow');

  UniversalKeywordTest('overflow', [
    'overflow-x',
    'overflow-y',
  ]);

  it('should open overflow shorthand with 1-value syntax', () => {
    const ast = createCssValueAST('scroll');

    expect(openOverflowAst(ast)).to.eql({
      'overflow-x': { value: ast[0] },
      'overflow-y': { value: ast[0] },
    });
  });

  it('should open overflow shorthand with 2-value syntax', () => {
    const ast = createCssValueAST('hidden visible');

    expect(openOverflowAst(ast)).to.eql({
      'overflow-x': { value: ast[0] },
      'overflow-y': { value: ast[1] },
    });
  });
});
