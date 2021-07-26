import { stringifySelectorAst, parseCssSelector } from '@tokey/css-selector-parser';
import type {
    ImmutableSelectorList,
    ImmutableSelector,
    ImmutableCompoundSelector,
    ImmutableNthSelectorList,
    ImmutableUniversal,
    ImmutableClass,
    ImmutableId,
    ImmutableType,
    ImmutableCombinator,
    ImmutableAttribute,
    ImmutablePseudoClass,
    ImmutablePseudoElement,
    ImmutableComment,
    ImmutableNesting,
    ImmutableInvalid,
    ImmutableNth,
    ImmutableNthStep,
    ImmutableNthDash,
    ImmutableNthOffset,
    ImmutableNthOf,
} from '@tokey/css-selector-parser';
import { expect } from 'chai';

describe(`stringifySelectorAst`, () => {
    it(`should convert ast back to string`, () => {
        const ast = parseCssSelector(`.a`);

        const selector = stringifySelectorAst(ast);

        expect(selector).to.equal(`.a`);
    });
    describe(`immutable`, () => {
        // test types
        [
            { src: `*` } as any as ImmutableUniversal,
            { src: `.a` } as any as ImmutableClass,
            { src: `#id` } as any as ImmutableId,
            { src: `el` } as any as ImmutableType,
            { src: `+` } as any as ImmutableCombinator,
            { src: `[attr]` } as any as ImmutableAttribute,
            { src: `:p-class` } as any as ImmutablePseudoClass,
            { src: `::p-el` } as any as ImmutablePseudoElement,
            { src: `/*comment*/` } as any as ImmutableComment,
            { src: `&` } as any as ImmutableNesting,
            { src: `.a` } as any as ImmutableSelector,
            { src: `{` } as any as ImmutableInvalid,
            { src: `:nth-child(5n)` } as any as ImmutableNth,
            { src: `:nth-child(5n)` } as any as ImmutableNthStep,
            { src: `:nth-child(5n-)` } as any as ImmutableNthDash,
            { src: `:nth-child(5n-4)` } as any as ImmutableNthOffset,
            { src: `:nth-child(5n of)` } as any as ImmutableNthOf,
            { src: `.a, .b` } as any as ImmutableSelectorList,
            { src: `.a.b` } as any as ImmutableSelector,
            { src: `.a.b` } as any as ImmutableCompoundSelector,
            { src: `:nth-child(5n of div)` } as any as ImmutableNthSelectorList,
        ].forEach((ast) => {
            stringifySelectorAst(ast); // expect no type error
        });
        
    });
});
