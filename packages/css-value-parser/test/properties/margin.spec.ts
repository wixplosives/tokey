import { parseCssValue, margin } from "@tokey/css-value-parser";
import { expect } from "chai";
/*
- parse unknown syntax (property)
- toShorthand
- toLonghand
- optimize
- vars - handle build concatenation (buildvars/placeholders)
- vars - handle runtime vars
*/
describe(`value-parser/properties/margin`, () => {
  it(`should parse unknown syntax`, () => {
    const twoValues = parseCssValue(`1px`);
    expect(twoValues).to.eql([
      {
        type: `<length>`,
        value: `1px`,
      },
      {
        type: `<SEP>`,
        value: ` `,
      },
      {
        type: `<length>`,
        value: `2px`,
      },
    ]);
  });
  it(`should resolve format`, () => {
    const oneValue = parseCssValue(`1px`);
    expect(margin.getFormat(oneValue)).to.eql(`all`);

    const twoValues = parseCssValue(`1px 2px`);
    expect(margin.getFormat(twoValues)).to.eql(`horizontal-vertical`);

    const threeValues = parseCssValue(`1px 2px 3px`);
    expect(margin.getFormat(threeValues)).to.eql(`top-horizontal-bottom`);

    const fourValues = parseCssValue(`1px 2px 3px 4px`);
    expect(margin.getFormat(fourValues)).to.eql(`top-right-bottom-left`);

    const invalid = parseCssValue(`1px 2px 3px 4px 5px`);
    expect(margin.getFormat(invalid)).to.eql(`invalid`);
  });
  describe(`classification`, () => {
    it(`should resolve all formats`, () => {
      const singleValue = parseCssValue(`1px`);
      expect(margin.classify(singleValue), `single value`).to.eql({
        "margin-top": { value: [singleValue[0]] },
        "margin-right": { value: [singleValue[0]] },
        "margin-bottom": { value: [singleValue[0]] },
        "margin-left": { value: [singleValue[0]] },
      });

      const twoValues = parseCssValue(`1px 2px`);
      expect(margin.classify(twoValues), `two values`).to.eql({
        "margin-top": { value: [twoValues[2]] },
        "margin-right": { value: [twoValues[0]] },
        "margin-bottom": { value: [twoValues[2]] },
        "margin-left": { value: [twoValues[0]] },
      });

      const threeValues = parseCssValue(`1px 2px 3px`);
      expect(margin.classify(threeValues), `three values`).to.eql({
        "margin-top": { value: [threeValues[0]] },
        "margin-right": { value: [threeValues[2]] },
        "margin-bottom": { value: [threeValues[4]] },
        "margin-left": { value: [threeValues[2]] },
      });

      const fourValues = parseCssValue(`1px 2px 3px 4px`);
      expect(margin.classify(threeValues), `four values`).to.eql({
        "margin-top": { value: [fourValues[0]] },
        "margin-right": { value: [fourValues[2]] },
        "margin-bottom": { value: [fourValues[4]] },
        "margin-left": { value: [fourValues[2]] },
      });
    });
    it(`should resolve params`, () => {
      const ast = parseCssValue(`var(--size)`);
      const sizeParam = parseCssValue(`5px`);
      const cssVars = {
        size: sizeParam,
      };

      expect(margin.classify(ast, { cssVars }), `single value`).to.eql({
        "margin-top": {
          value: [cssVars.size[0]],
          resolved: [
            [
              { origin: ast, nodes: [ast[0]] },
              { origin: cssVars.size, nodes: [cssVars.size[0]] },
            ],
          ],
        },
        "margin-right": {
          value: [cssVars.size[0]],
          resolved: [
            [
              { origin: ast, nodes: [ast[0]] },
              { origin: cssVars.size, nodes: [cssVars.size[0]] },
            ],
          ],
        },
        "margin-bottom": {
          value: [cssVars.size[0]],
          resolved: [
            [
              { origin: ast, nodes: [ast[0]] },
              { origin: cssVars.size, nodes: [cssVars.size[0]] },
            ],
          ],
        },
        "margin-left": {
          value: [cssVars.size[0]],
          resolved: [
            [
              { origin: ast, nodes: [ast[0]] },
              { origin: cssVars.size, nodes: [cssVars.size[0]] },
            ],
          ],
        },
      });
    });
  });
});
