import { parseCssValue } from "@tokey/css-value-parser";
import { expect } from "chai";
/*
- parse unknown syntax (property)
- toShorthand
- toLonghand
- optimize
*/
describe(`value-parser`, () => {
  describe(`base types`, () => {
    [
      {type: `comma`, source: `,`, expected: [{type: `sep`, value: `,`}]},
      {type: `space`, source: ` `, expected: [{type: `sep`, value: ` `}]},
      {type: `<custom-ident>`, source: `abc`, expected: [{type: `<custom-ident>`, value: `abc`}]},
      {type: `<dashed-ident>`, source: `ab-c`, expected: [{type: `<dashed-ident>`, value: `ab-c`}]},
      {type: `<string>`, source: `"abc"`, expected: [{type: `<string>`, value: `"abc"`}]},
      // ToDo: add escaping cases to string
      {type: `<url>`, source: `url("http://www.site.com")`, expected: [{type: `<url>`, value: `"http://www.site.com"`}]},
      // ToDo: add url/src cases: https://www.w3.org/TR/css-values-4/#urls
      {type: `<number>`, source: `1.5`, expected: [{type: `<number>`, value: `1.5`}]},
      {type: `<percentage>`, source: `5%`, expected: [{type: `<percentage>`, value: `5`}]},
      // ToDo: add cases to number / percentage
      {type: `<length>`, source: `5px`, expected: [{type: `<length>`, value: `5`, unit: `px`}]},
      // ToDo: add cases for: em, ex, cap, ch, ic, rem, lh, rlh, vw, vh, vi, vb, vmin, vmax, cm, mm, Q, in, pt, pc
      {type: `<angle>`, source: `36deg`, expected: [{type: `<angle>`, value: `36`, unit: `deg`}]},
      // ToDo: add cases for:  grad, rad, turn
      {type: `<time>`, source: `88s`, expected: [{type: `<time>`, value: `88`, unit: `s`}]},
      {type: `<time>`, source: `10ms`, expected: [{type: `<time>`, value: `10`, unit: `ms`}]},
      {type: `<frequency>`, source: `2Hz`, expected: [{type: `<frequency>`, value: `2`, unit: `Hz`}]},
      {type: `<frequency>`, source: `5kHz`, expected: [{type: `<frequency>`, value: `5`, unit: `kHz`}]},
      {type: `<resolution>`, source: `100dpi`, expected: [{type: `<resolution>`, value: `100`, unit: `dpi`}]},
      {type: `<resolution>`, source: `100dpcm`, expected: [{type: `<resolution>`, value: `100`, unit: `dpcm`}]},
      {type: `<resolution>`, source: `100dppx`, expected: [{type: `<resolution>`, value: `100`, unit: `dppx`}]},
      {type: `<color>`, source: `#000000`, expected: [{type: `<color>`, value: `#000000`}]},
      // ToDo: figure out how to keep different color functions
    ].forEach(({type, source, expected}) => {
      it(`should parse "${type}" type`, () => {
        expect(parseCssValue(source)).to.eql(expected)
      });
    });
  });
  // ToDo: add case insensitive tests
  /**
   some components cannot be parsed directly without a syntax context
   - <ratio>: https://www.w3.org/TR/css-values-4/#ratios
   - <integer>: https://www.w3.org/TR/css-values-4/#integers
   - <image>: https://www.w3.org/TR/css-values-4/#images
   - <position>: https://www.w3.org/TR/css-values-4/#position
   */
  it(`should parse flat ast nodes`, () => {
    const ast = parseCssValue(`1px 2px,3px`);

    expect(ast).to.eql([
      {
        type: `<length>`,
        value: `1px`,
      },
      {
        type: `sep`,
        value: ` `,
      },
      {
        type: `<length>`,
        value: `2px`,
      },
      {
        type: `sep`,
        value: `,`,
      },
      {
        type: `<length>`,
        value: `3px`,
      },
    ]);
  });
});
