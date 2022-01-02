import { parseCSSValue, background } from '@tokey/css-value-parser';
import { expect } from 'chai';

// ToDo: implementation
describe.skip(`value-parser/properties/background`, () => {
    it(`should resolve classification`, () => {
        const ast = parseCSSValue(
            //0  1                                       2   3  4  5      6         7      8          9
            `red linear-gradient(green 0%, yellow 100%) 40% 30% / auto border-box fixed padding-box repeat-x`
        );

        const classification = background.classify(ast);

        expect(classification).to.eql([
            {
                'background-color': { ref: [ast[0]], isProperty: true }, // red
                'background-image': { ref: [ast[1]], isProperty: true }, // linear-gradient
                'background-position': {
                    ref: [ast[2], ast[3]],
                    isProperty: true,
                }, // 40% 30%
                'background-size': { ref: [ast[5]], isProperty: true }, // auto
                'background-origin': { ref: [ast[6]], isProperty: true }, // border-box
                'background-attachment': { ref: [ast[7]], isProperty: true }, // fixed
                'background-clip': { ref: [ast[8]], isProperty: true }, // padding-box
                'background-repeat': { ref: [ast[9]], isProperty: true }, // repeat-x
            },
        ]);
    });
});
