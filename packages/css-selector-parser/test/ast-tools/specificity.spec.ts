import {
  calcSpecificity,
  groupCompoundSelectors,
  parseCssSelector,
} from "@tokey/css-selector-parser";
import { expect } from "chai";

describe(`ast-tools/specificity`, () => {
  describe(`basic selectors`, () => {
    [
      {
        selectorType: `universal`,
        selector: `*`,
        expected: [0, 0, 0, 0],
      },
      {
        selectorType: `type`,
        selector: `span`,
        expected: [0, 0, 0, 1],
      },
      {
        selectorType: `pseudo-element`,
        selector: `::before`,
        expected: [0, 0, 0, 1],
      },
      {
        selectorType: `class`,
        selector: `.a`,
        expected: [0, 0, 1, 0],
      },
      {
        selectorType: `attribute`,
        selector: `[attr]`,
        expected: [0, 0, 1, 0],
      },
      {
        selectorType: `pseudo-class`,
        selector: `:hover`,
        expected: [0, 0, 1, 0],
      },
      {
        selectorType: `id`,
        selector: `#a`,
        expected: [0, 1, 0, 0],
      },
      {
        selectorType: `nested`,
        selector: `&`,
        expected: [0, 0, 0, 0],
      },
    ].forEach(({ selectorType, selector, expected }) => {
      it(`should return correct specificity for ${selectorType} selector`, () => {
        const specificity = calcSpecificity(parseCssSelector(selector));
        expect(specificity).to.eql(expected);
      });
    });
  });
  describe(`special cases`, () => {
    it(`should only add the most specific inner selector for :not()`, () => {
      const specificity = calcSpecificity(parseCssSelector(`:not(.a, #b)`));
      expect(specificity).to.eql([0, 1, 0, 0]);
    });
    it(`should only add the most specific inner selector for :is()`, () => {
      const specificity = calcSpecificity(parseCssSelector(`:is(.a, #b)`));
      expect(specificity).to.eql([0, 1, 0, 0]);
    });
    it(`should only add the most specific inner selector for :has()`, () => {
      const specificity = calcSpecificity(parseCssSelector(`:has(.a, #b)`));
      expect(specificity).to.eql([0, 1, 0, 0]);
    });
    it(`should add zero specificity for :where()`, () => {
      const specificity = calcSpecificity(parseCssSelector(`:where(.a, #b)`));
      expect(specificity).to.eql([0, 0, 0, 0]);
    });
    it(`should add :nth-child pseudo-class plus the most specific inner selectors`, () => {
      const specificity = calcSpecificity(
        parseCssSelector(`:nth-child(5n - 4 of .a, #b)`)
      );
      expect(specificity).to.eql([0, 1, 1, 0]);
    });
    it(`should add :nth-last-child pseudo-class plus the most specific inner selectors`, () => {
      const specificity = calcSpecificity(
        parseCssSelector(`:nth-last-child(5n -4 of .a, #b)`)
      );
      expect(specificity).to.eql([0, 1, 1, 0]);
    });
    it(`should add :nth-of-type pseudo-class plus the most specific inner selectors`, () => {
      const specificity = calcSpecificity(
        parseCssSelector(`:nth-of-type(5n -4 of .a, #b)`)
      );
      expect(specificity).to.eql([0, 1, 1, 0]);
    });
    it(`should add :nth-last-of-type pseudo-class plus the most specific inner selectors`, () => {
      const specificity = calcSpecificity(
        parseCssSelector(`:nth-last-of-type(5n -4 of .a, #b)`)
      );
      expect(specificity).to.eql([0, 1, 1, 0]);
    });
  });
  describe(`complex selectors`, () => {
    it(`should not add specificity for combinators`, () => {
      const specificity = calcSpecificity(
        parseCssSelector(`.a + .b ~ .c > .d .e`)
      );
      expect(specificity).to.eql([0, 0, 5, 0]);
    });
    it(`should handle nested pseudo classes`, () => {
      const specificity = calcSpecificity(
        parseCssSelector(`:is(:where(#zero), :has(:not(span, #a), .a))`)
      );
      expect(specificity).to.eql([0, 1, 0, 0]);
    });
    it(`should not take non native functional selectors arguments into account`, () => {
      const specificity = calcSpecificity(
        parseCssSelector(
          `div(#a).x(#b)::y(#c)[attr](#d)&(#e)*(#f)#id(#g):unknown(#h)`
        )
      );
      expect(specificity).to.eql([0, 1, 3, 2]);
    });
    it(`should handle compound selector AST`, () => {
      const specificity = calcSpecificity(
        groupCompoundSelectors(parseCssSelector(`.a .b`))
      );
      expect(specificity).to.eql([0, 0, 2, 0]);
    });
  });
});
