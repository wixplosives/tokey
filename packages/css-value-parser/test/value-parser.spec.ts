import {
    parseCSSValue,
    stringifyCSSValue,
    customIdent,
    dashedIdent,
    literal,
    cssWideKeyword,
    space,
    invalid,
    comment,
    string,
    integer,
    number,
    length,
    percentage,
    angle,
    time,
    flex,
    call,
    unknownUnit,
    frequency,
    resolution,
    color,
} from '@tokey/css-value-parser';
import { expect } from 'chai';

describe(`value-parser`, () => {
    interface TestDef {
        type: string;
        desc?: string;
        source: string;
        expected: ReturnType<typeof parseCSSValue>;
    }
    const test = ({ source, expected }: Pick<TestDef, `source` | `expected`>) => {
        const ast = parseCSSValue(source);
        expect(ast, `parse`).to.eql(expected);
        expect(stringifyCSSValue(ast), `stringify`).to.equal(source);
    };
    const createTest = ({ type, source, expected, desc }: TestDef) => {
        desc = desc ? ` (${desc})` : ``;
        it(`should parse "${type}" type${desc}`, () => {
            test({ source, expected });
        });
    };
    describe(`space`, () => {
        [
            {
                type: `space`,
                source: ` `,
                expected: [space({ value: ` `, start: 0, end: 1 })],
            },
            {
                type: `space`,
                desc: `with before&after`,
                source: `\t   \n`,
                expected: [
                    space({
                        value: ` `,
                        before: `\t`,
                        after: `  \n`,
                        start: 0,
                        end: 5,
                    }),
                ],
            },
        ].forEach(createTest);
    });
    describe(`literals`, () => {
        [
            {
                type: `comma`,
                source: `,`,
                expected: [literal({ value: `,`, start: 0, end: 1 })],
            },
            {
                type: `slash`,
                source: `/`,
                expected: [literal({ value: `/`, start: 0, end: 1 })],
            },
            {
                type: `+`,
                source: `+`,
                expected: [literal({ value: `+`, start: 0, end: 1 })],
            },
            {
                type: `-`,
                source: `-`,
                expected: [literal({ value: `-`, start: 0, end: 1 })],
            },
            {
                type: `(`,
                source: `(`,
                expected: [literal({ value: `(`, start: 0, end: 1 })],
            },
            {
                type: `.`,
                source: `.`,
                expected: [literal({ value: `.`, start: 0, end: 1 })],
            },
            {
                type: `literals`,
                source: `()[]<>{}@|:;~&,/+-*.`,
                expected: [
                    literal({ value: `(`, start: 0, end: 1 }),
                    literal({ value: `)`, start: 1, end: 2 }),
                    literal({ value: `[`, start: 2, end: 3 }),
                    literal({ value: `]`, start: 3, end: 4 }),
                    literal({ value: `<`, start: 4, end: 5 }),
                    literal({ value: `>`, start: 5, end: 6 }),
                    literal({ value: `{`, start: 6, end: 7 }),
                    literal({ value: `}`, start: 7, end: 8 }),
                    literal({ value: `@`, start: 8, end: 9 }),
                    literal({ value: `|`, start: 9, end: 10 }),
                    literal({ value: `:`, start: 10, end: 11 }),
                    literal({ value: `;`, start: 11, end: 12 }),
                    literal({ value: `~`, start: 12, end: 13 }),
                    literal({ value: `&`, start: 13, end: 14 }),
                    literal({ value: `,`, start: 14, end: 15 }),
                    literal({ value: `/`, start: 15, end: 16 }),
                    literal({ value: `+`, start: 16, end: 17 }),
                    literal({ value: `-`, start: 17, end: 18 }),
                    literal({ value: `*`, start: 18, end: 19 }),
                    literal({ value: `.`, start: 19, end: 20 }),
                ],
            },
        ].forEach(createTest);
    });
    describe(`css-wide-keyword`, () => {
        [
            {
                type: `inherit`,
                source: `inherit`,
                expected: [cssWideKeyword({ value: `inherit`, start: 0, end: 7 })],
            },
            {
                type: `unset`,
                source: `unset`,
                expected: [cssWideKeyword({ value: `unset`, start: 0, end: 5 })],
            },
            {
                type: `initial`,
                source: `initial`,
                expected: [cssWideKeyword({ value: `initial`, start: 0, end: 7 })],
            },
            {
                type: `inherit`,
                desc: `case-insensitive`,
                source: `iNhErIt`,
                expected: [cssWideKeyword({ value: `iNhErIt`, start: 0, end: 7 })],
            },
            {
                type: `unset`,
                desc: `case-insensitive`,
                source: `uNsEt`,
                expected: [cssWideKeyword({ value: `uNsEt`, start: 0, end: 5 })],
            },
            {
                type: `initial`,
                desc: `case-insensitive`,
                source: `InItIaL`,
                expected: [cssWideKeyword({ value: `InItIaL`, start: 0, end: 7 })],
            },
        ].forEach(createTest);
    });
    describe(`ident`, () => {
        describe(`custom-ident`, () => {
            [
                {
                    type: `<custom-ident>`,
                    source: `abc`,
                    expected: [
                        customIdent({
                            value: `abc`,
                            start: 0,
                            end: 3,
                        }),
                    ],
                },
                {
                    type: `<custom-ident>`,
                    desc: `with dashes`,
                    source: `-a-b-c-`,
                    expected: [
                        customIdent({
                            value: `-a-b-c-`,
                            start: 0,
                            end: 7,
                        }),
                    ],
                },
                {
                    type: `<custom-ident>`,
                    desc: `with all possible non escape chars`,
                    source: `azAZ09_-🥸`,
                    expected: [
                        customIdent({
                            value: `azAZ09_-🥸`,
                            start: 0,
                            end: 10,
                        }),
                    ],
                },
                {
                    type: `<custom-ident>`,
                    desc: `end with number`,
                    source: `abc5`,
                    expected: [
                        customIdent({
                            value: `abc5`,
                            start: 0,
                            end: 4,
                        }),
                    ],
                },
                {
                    type: `<custom-ident>`,
                    desc: `separated by dots`,
                    source: `abc.xyz`,
                    expected: [
                        customIdent({
                            value: `abc`,
                            start: 0,
                            end: 3,
                        }),
                        literal({ value: `.`, start: 3, end: 4 }),
                        customIdent({
                            value: `xyz`,
                            start: 4,
                            end: 7,
                        }),
                    ],
                },
                {
                    type: `<custom-ident>`,
                    desc: `wrapped in brackets`,
                    source: `[abc]`,
                    expected: [
                        literal({ value: `[`, start: 0, end: 1 }),
                        customIdent({
                            value: `abc`,
                            start: 1,
                            end: 4,
                        }),
                        literal({ value: `]`, start: 4, end: 5 }),
                    ],
                },
                {
                    type: `<custom-ident>`,
                    desc: `split custom ident`,
                    source: `abc==efg`,
                    expected: [
                        customIdent({
                            value: `abc`,
                            start: 0,
                            end: 3,
                        }),
                        literal({ value: `=`, start: 3, end: 4 }),
                        literal({ value: `=`, start: 4, end: 5 }),
                        customIdent({
                            value: `efg`,
                            start: 5,
                            end: 8,
                        }),
                    ],
                },
            ].forEach(createTest);
        });
        describe(`dashed-ident`, () => {
            [
                {
                    type: `<dashed-ident>`,
                    source: `--abc`,
                    expected: [
                        dashedIdent({
                            value: `--abc`,
                            start: 0,
                            end: 5,
                        }),
                    ],
                },
            ].forEach(createTest);
        });
    });
    describe(`textual`, () => {
        [
            {
                type: `<string>`,
                desc: `double quotes`,
                source: `"abc"`,
                expected: [string({ value: `"abc"`, start: 0, end: 5 })],
            },
            {
                type: `<string>`,
                desc: `single quotes`,
                source: `'abc'`,
                expected: [string({ value: `'abc'`, start: 0, end: 5 })],
            },
            {
                type: `<string>`,
                desc: `escaped in double quotes`,
                source: `"ab\\"c'd'"`,
                expected: [string({ value: `"ab\\"c'd'"`, start: 0, end: 10 })],
            },
            {
                type: `<string>`,
                desc: `escaped in single quotes`,
                source: `'ab\\'c"d"'`,
                expected: [string({ value: `'ab\\'c"d"'`, start: 0, end: 10 })],
            },
            {
                type: `<string>`,
                desc: `escaped newline`,
                source: `"abc\\\n"`,
                expected: [string({ value: `"abc\\\n"`, start: 0, end: 7 })],
            },
        ].forEach(createTest);
    });
    describe(`functions`, () => {
        [
            {
                type: `call`,
                source: `custom-call()`,
                expected: [
                    call({
                        value: `custom-call`,
                        args: [],
                        start: 0,
                        end: 13,
                    }),
                ],
            },
            {
                type: `call`,
                desc: `with argument`,
                source: `custom-call(abc)`,
                expected: [
                    call({
                        value: `custom-call`,
                        args: [customIdent({ value: `abc`, start: 12, end: 15 })],
                        start: 0,
                        end: 16,
                    }),
                ],
            },
            {
                type: `call`,
                desc: `space before & after args`,
                source: `custom-call(   abc  )`,
                expected: [
                    call({
                        value: `custom-call`,
                        args: [customIdent({ value: `abc`, start: 15, end: 18 })],
                        before: `   `,
                        after: `  `,
                        start: 0,
                        end: 21,
                    }),
                ],
            },
            {
                type: `call`,
                desc: `url`,
                source: `url()`,
                expected: [
                    call({
                        value: `url`,
                        args: [],
                        start: 0,
                        end: 5,
                    }),
                ],
            },
            // ToDo: figure out how to provide build-in/custom function parser or maybe just validators
            // {type: `<url>`, source: `url("http://www.site.com")`, expected: [{type: `<url>`, value: `"http://www.site.com"`}]},
            // // ToDo: add url/src cases: https://www.w3.org/TR/css-values-4/#urls
        ].forEach(createTest);
    });
    describe(`numeric`, () => {
        describe(`integer`, () => {
            [
                {
                    type: `<integer>`,
                    source: `123`,
                    expected: [integer({ value: `123`, start: 0, end: 3 })],
                },
                {
                    /*note: type <zero> is parsed as an integer: https://www.w3.org/TR/css-values-4/#zero-value */
                    type: `<integer>`,
                    desc: `zero`,
                    source: `0`,
                    expected: [integer({ value: `0`, start: 0, end: 1 })],
                },
                {
                    type: `<integer>`,
                    desc: `sign +`,
                    source: `+5`,
                    expected: [integer({ value: `+5`, start: 0, end: 2 })],
                },
                {
                    type: `<integer>`,
                    desc: `sign -`,
                    source: `-5`,
                    expected: [integer({ value: `-5`, start: 0, end: 2 })],
                },
            ].forEach(createTest);
        });
        describe(`number`, () => {
            [
                {
                    type: `<number>`,
                    desc: `fractions`,
                    source: `1.5`,
                    expected: [number({ value: `1.5`, start: 0, end: 3 })],
                },
                {
                    type: `<number>`,
                    desc: `start with dot`,
                    source: `.5`,
                    expected: [number({ value: `.5`, start: 0, end: 2 })],
                },
                {
                    type: `<number>`,
                    desc: `sign +`,
                    source: `+5.5`,
                    expected: [number({ value: `+5.5`, start: 0, end: 4 })],
                },
                {
                    type: `<number>`,
                    desc: `sign -`,
                    source: `-5.5`,
                    expected: [number({ value: `-5.5`, start: 0, end: 4 })],
                },
                {
                    type: `<number>`,
                    desc: `exponential`,
                    source: `1.5e55`,
                    expected: [number({ value: `1.5e55`, start: 0, end: 6 })],
                },
                {
                    // ToDo: make sure +- exponential works in CSS
                    type: `<number>`,
                    desc: `sign,`,
                    source: `-55.55E-55`,
                    expected: [number({ value: `-55.55E-55`, start: 0, end: 10 })],
                },
            ].forEach(createTest);
        });
    });
    describe(`units`, () => {
        describe(`length`, () => {
            [
                ...[
                    `em`,
                    `ex`,
                    `cap`,
                    `ch`,
                    `ic`,
                    `rem`,
                    `lh`,
                    `rlh`,
                    `vw`,
                    `vh`,
                    `vi`,
                    `vb`,
                    `vmin`,
                    `vmax`,
                    `cm`,
                    `mm`,
                    `Q`,
                    `in`,
                    `pt`,
                    `pc`,
                ].map((unit: any) => ({
                    type: `<length>`,
                    desc: unit + ` integer`,
                    source: `5` + unit,
                    expected: [
                        length({
                            value: `5`,
                            unit,
                            integer: true,
                            start: 0,
                            end: 1 + unit.length,
                        }),
                    ],
                })),
            ].forEach(createTest);
        });
        describe(`percentage`, () => {
            [
                {
                    type: `<percentage>`,
                    source: `5%`,
                    expected: [
                        percentage({
                            value: `5`,
                            unit: `%`,
                            integer: true,
                            start: 0,
                            end: 2,
                        }),
                    ],
                },
            ].forEach(createTest);
        });
        describe(`angle`, () => {
            [
                ...[`deg`, `grad`, `rad`, `turn`].map((unit: any) => ({
                    type: `<angle>`,
                    desc: unit,
                    source: `5` + unit,
                    expected: [
                        angle({
                            value: `5`,
                            unit,
                            integer: true,
                            start: 0,
                            end: 1 + unit.length,
                        }),
                    ],
                })),
            ].forEach(createTest);
        });
        describe(`time`, () => {
            [
                ...[`s`, `ms`].map((unit: any) => ({
                    type: `<time>`,
                    desc: unit,
                    source: `5` + unit,
                    expected: [
                        time({
                            value: `5`,
                            unit,
                            integer: true,
                            start: 0,
                            end: 1 + unit.length,
                        }),
                    ],
                })),
            ].forEach(createTest);
        });
        describe(`frequency`, () => {
            [
                ...[`Hz`, `KHz`].map((unit: any) => ({
                    type: `<frequency>`,
                    desc: unit,
                    source: `5` + unit,
                    expected: [
                        frequency({
                            value: `5`,
                            unit,
                            integer: true,
                            start: 0,
                            end: 1 + unit.length,
                        }),
                    ],
                })),
            ].forEach(createTest);
        });
        describe(`resolution`, () => {
            [
                ...[`dpi`, `dpcm`, `dppx`].map((unit: any) => ({
                    type: `<resolution>`,
                    desc: unit,
                    source: `5` + unit,
                    expected: [
                        resolution({
                            value: `5`,
                            unit,
                            integer: true,
                            start: 0,
                            end: 1 + unit.length,
                        }),
                    ],
                })),
            ].forEach(createTest);
        });
        describe(`flex`, () => {
            [
                {
                    type: `<flex>`,
                    source: `5fr`,
                    expected: [
                        flex({
                            value: `5`,
                            unit: `fr`,
                            integer: true,
                            start: 0,
                            end: 3,
                        }),
                    ],
                },
            ].forEach(createTest);
        });
        describe(`unknown`, () => {
            [
                {
                    type: `unknown-unit`,
                    source: `5unknown`,
                    expected: [
                        unknownUnit({
                            value: `5`,
                            unit: `unknown`,
                            integer: true,
                            start: 0,
                            end: 8,
                        }),
                    ],
                },
            ].forEach(createTest);
        });
        it(`should flag non integer amount`, () => {
            test({
                source: `5.5em`,
                expected: [
                    length({
                        value: `5.5`,
                        unit: `em`,
                        integer: false,
                        start: 0,
                        end: 5,
                    }),
                ],
            });
        });
    });
    describe(`color`, () => {
        describe(`RGB hexadecimal`, () => {
            [
                {
                    type: `<color>`,
                    desc: `6 digits hex`,
                    source: `#0F1e3D`,
                    expected: [color({ value: `#0F1e3D`, start: 0, end: 7 })],
                },
                {
                    type: `<color>`,
                    desc: `3 digits hex`,
                    source: `#012`,
                    expected: [color({ value: `#012`, start: 0, end: 4 })],
                },
                {
                    type: `<color>`,
                    desc: `4 digits hex`,
                    source: `#0123`,
                    expected: [color({ value: `#0123`, start: 0, end: 5 })],
                },
                {
                    type: `<color>`,
                    desc: `8 digits hex`,
                    source: `#01234567`,
                    expected: [color({ value: `#01234567`, start: 0, end: 9 })],
                },
            ].forEach(createTest);
        });
    });
    describe(`comment`, () => {
        [
            {
                type: `comment`,
                source: `/*123*/`,
                expected: [comment({ value: `/*123*/`, start: 0, end: 7 })],
            },
            {
                type: `comment`,
                desc: `special chars`,
                source: `/*'"/ +-#,\n\t\r\f()[]{}\\*\\/*/`,
                expected: [
                    comment({
                        value: `/*'"/ +-#,\n\t\r\f()[]{}\\*\\/*/`,
                        start: 0,
                        end: 26,
                    }),
                ],
            },
        ].forEach(createTest);
    });
    describe(`invalid`, () => {
        [
            {
                type: `invalid`,
                desc: `standalone hash`,
                source: `#`,
                expected: [invalid({ value: `#`, start: 0, end: 1 })],
            },
            {
                type: `invalid`,
                desc: `unknown hex length`,
                source: `#1 #12 #12345 #1234567 #123456789`,
                expected: [
                    invalid({ value: `#`, start: 0, end: 1 }),
                    integer({ value: `1`, start: 1, end: 2 }),
                    space({ value: ` `, start: 2, end: 3 }),
                    invalid({ value: `#`, start: 3, end: 4 }),
                    integer({ value: `12`, start: 4, end: 6 }),
                    space({ value: ` `, start: 6, end: 7 }),
                    invalid({ value: `#`, start: 7, end: 8 }),
                    integer({ value: `12345`, start: 8, end: 13 }),
                    space({ value: ` `, start: 13, end: 14 }),
                    invalid({ value: `#`, start: 14, end: 15 }),
                    integer({ value: `1234567`, start: 15, end: 22 }),
                    space({ value: ` `, start: 22, end: 23 }),
                    invalid({ value: `#`, start: 23, end: 24 }),
                    integer({ value: `123456789`, start: 24, end: 33 }),
                ],
            },
        ].forEach(createTest);
    });
    // ToDo: add case insensitive tests
    /**
   some components cannot be parsed directly without a syntax context
   - <ratio>: https://www.w3.org/TR/css-values-4/#ratios
   - <image>: https://www.w3.org/TR/css-values-4/#images
   - <position>: https://www.w3.org/TR/css-values-4/#position
   */
    it(`should parse flat ast nodes`, () => {
        test({
            source: `1px 2px,3px`,
            expected: [
                length({
                    value: `1`,
                    unit: `px`,
                    integer: true,
                    start: 0,
                    end: 3,
                }),
                space({
                    value: ` `,
                    start: 3,
                    end: 4,
                }),
                length({
                    value: `2`,
                    unit: `px`,
                    integer: true,
                    start: 4,
                    end: 7,
                }),
                literal({
                    value: `,`,
                    start: 7,
                    end: 8,
                }),
                length({
                    value: `3`,
                    unit: `px`,
                    integer: true,
                    start: 8,
                    end: 11,
                }),
            ],
        });
    });
});
