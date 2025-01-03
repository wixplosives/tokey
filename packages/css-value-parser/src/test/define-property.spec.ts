import { defineProperty, parseCSSValue } from '@tokey/css-value-parser';
import { expect } from 'chai';

// ToDo: implementation
describe.skip(`value-parser/define-property`, () => {
    describe(`validation`, () => {
        it(`should approve valid syntax`, () => {
            const p = defineProperty({
                name: `my-prop`,
                syntax: `<number>`,
            });

            expect(p.validate(parseCSSValue(`55`))).to.equal([]);
        });
        it(`should warn on unexpected type`, () => {
            const p = defineProperty({
                name: `my-prop`,
                syntax: `<number>`,
            });

            const ast = parseCSSValue(`abc`);
            const errors = p.validate(ast);

            expect(errors).to.equal([
                {
                    msg: defineProperty.errors.unexpectedType(ast[0], `<number>`),
                    ref: ast[0],
                },
            ]);
        });
        it(`should warn on top level comma`, () => {
            const p = defineProperty({
                name: `my-prop`,
                syntax: `<number>`,
            });

            const ast = parseCSSValue(`44,55`);
            const errors = p.validate(ast);

            expect(errors).to.equal([
                {
                    msg: defineProperty.errors.unexpectedComma(),
                    ref: ast[1],
                },
            ]);
        });
        it(`should NOT warn on expected top level comma`, () => {
            const p = defineProperty({
                name: `my-prop`,
                syntax: `<number>#`,
                topLevelCommaSeparation: true,
            });

            const ast = parseCSSValue(`44,55`);
            const errors = p.validate(ast);

            expect(errors).to.equal([]);
        });
    });
    describe(`format`, () => {
        it(`should match a defined format`, () => {
            const p = defineProperty({
                name: `my-prop`,
                syntax: `<number> | <string> | <boolean>`,
                formats: {
                    number: `<number>`,
                    string: `<string>`,
                    boolean: `<boolean>`,
                },
            });

            expect(p.getFormat(parseCSSValue(`55`)), `number`).to.eql(`number`);
            expect(p.getFormat(parseCSSValue(`xy`)), `string`).to.eql(`string`);
            expect(p.getFormat(parseCSSValue(`true`)), `boolean`).to.eql(`boolean`);
            expect(p.getFormat(parseCSSValue(`5px`)), `unknown`).to.eql(undefined);
        });
    });
    describe(`classification`, () => {
        it(`should classify inner parts`, () => {
            const p = defineProperty({
                name: `my-prop`,
                syntax: `<number> <string>`,
                classifications: {
                    amount: (node) => node.type === `<number>`,
                    name: (node) => node.type === `<string>`,
                },
            });

            const ast = parseCSSValue(`50 abc`);
            const classification = p.classify(ast);

            expect(classification.amount.value).to.equal(ast[0]);
            expect(classification.name.value).to.equal(ast[2]);
        });
    });
    describe(`vars`, () => {
        // ToDo: handle unknown var
        describe(`css properties`, () => {
            it(`should resolve origin`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<number>`,
                    classifications: {
                        amount: (node) => node.type === `<number>`,
                    },
                });

                const ast = parseCSSValue(`var(--x)`);
                const cssVars = {
                    x: parseCSSValue(`123`),
                };

                expect(p.classify(ast, { cssVars })).deep.include({
                    amount: {
                        value: [cssVars.x[0]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: cssVars.x, nodes: [0] }],
                            },
                        ],
                    },
                });
            });
            it(`should resolve origin deep`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<number>`,
                    classifications: {
                        amount: (node) => node.type === `<number>`,
                    },
                });

                const ast = parseCSSValue(`var(--x)`);
                const cssVars = {
                    x: parseCSSValue(`var(--y)`),
                    y: parseCSSValue(`123`),
                };

                expect(p.classify(ast, { cssVars })).deep.include({
                    amount: {
                        value: [cssVars.y[0]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [
                                    {
                                        origin: cssVars.x,
                                        nodes: [0],
                                        resolved: [{ origin: cssVars.y, nodes: [0] }],
                                    },
                                ],
                            },
                        ],
                    },
                });
            });
            it(`should resolve multiple parts from single origin`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<number> <number>`,
                    classifications: {
                        amountA: (node, { indexOfType }) =>
                            node.type === `<number>` && indexOfType === 0,
                        amountB: (node, { indexOfType }) =>
                            node.type === `<number>` && indexOfType === 1,
                    },
                });

                const ast = parseCSSValue(`var(--x)`);
                const cssVars = {
                    x: parseCSSValue(`123 789`),
                };

                expect(p.classify(ast, { cssVars })).deep.include({
                    amountA: {
                        value: [cssVars.x[0]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: cssVars.x, nodes: [0] }],
                            },
                        ],
                    },
                    amountB: {
                        value: [cssVars.x[2]],
                        resolved: [
                            [
                                {
                                    origin: ast,
                                    nodes: [0],
                                    resolved: [{ origin: cssVars.x, nodes: [2] }],
                                },
                            ],
                        ],
                    },
                });
            });
            it(`should resolve multiple parts from multiple origins`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<number> <number>`,
                    classifications: {
                        amountA: (node, { indexOfType }) =>
                            node.type === `<number>` && indexOfType === 0,
                        amountB: (node, { indexOfType }) =>
                            node.type === `<number>` && indexOfType === 1,
                    },
                });

                const ast = parseCSSValue(`var(--x) var(--y)`);
                const cssVars = {
                    x: parseCSSValue(`123`),
                    y: parseCSSValue(`789`),
                };

                expect(p.classify(ast, { cssVars })).deep.include({
                    amountA: {
                        value: [cssVars.x[0]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: cssVars.x, nodes: [0] }],
                            },
                        ],
                    },
                    amountB: {
                        value: [cssVars.y[0]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [2],
                                resolved: [{ origin: cssVars.y, nodes: [0] }],
                            },
                        ],
                    },
                });
            });
            it(`should resolve complex part from single origin`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<length> <length>`,
                    classifications: {
                        position: {
                            syntax: `<length> <length>`,
                        },
                    },
                });

                const ast = parseCSSValue(`var(--x)`);
                const cssVars = {
                    x: parseCSSValue(`1px 2px`),
                };

                expect(p.classify(ast, { cssVars })).deep.include({
                    position: {
                        value: [cssVars.x[0], cssVars.x[1], cssVars.x[2]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: cssVars.x, nodes: [0] }],
                            },
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: cssVars.x, nodes: [1] }],
                            },
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: cssVars.x, nodes: [2] }],
                            },
                        ],
                    },
                });
            });
            it(`should resolve complex part from multiple origins`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<length> <length>`,
                    classifications: {
                        position: {
                            syntax: `<length> <length>`,
                        },
                    },
                });

                const ast = parseCSSValue(`var(--x) var(--y)`);
                const cssVars = {
                    x: parseCSSValue(`1px`),
                    y: parseCSSValue(`2px`),
                };

                expect(p.classify(ast, { cssVars })).deep.include({
                    position: {
                        value: [cssVars.x[0], ast[1], cssVars.y[0]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: cssVars.x, nodes: [0] }],
                            },
                            { origin: ast, nodes: [1] },
                            {
                                origin: ast,
                                nodes: [2],
                                resolved: [{ origin: cssVars.y, nodes: [0] }],
                            },
                        ],
                    },
                });
            });
            it(`should NOT resolve concatenated values`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<length>`,
                    classifications: {
                        size: (node) => node.type === `<length>`,
                    },
                });

                const ast = parseCSSValue(`var(--x)px`);
                const cssVars = {
                    x: parseCSSValue(`5`),
                };

                // ToDo: maybe all methods should always output errors
                expect(p.classify(ast, { cssVars })).deep.include({
                    amount: {
                        ref: undefined,
                        resolved: [],
                    },
                });
            });
        });
        describe(`build vars`, () => {
            const $varParser = {} as any;
            it(`should resolve origin`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<number>`,
                    classifications: {
                        amount: (node) => node.type === `<number>`,
                    },
                });

                const ast = parseCSSValue(`$x`, { parseBuildVar: $varParser });
                const buildVars: Record<string, ReturnType<typeof parseCSSValue>> = {
                    $x: parseCSSValue(`123`),
                };

                expect(
                    p.classify(ast, { resolveBuildVar: ({ id }) => buildVars[id] }),
                ).deep.include({
                    amount: {
                        value: [buildVars.$x[0]],
                        resolved: [
                            {
                                origin: ast[0],
                                nodes: [0],
                                resolved: [{ origin: buildVars.$x, nodes: [0] }],
                            },
                        ],
                    },
                });
            });
            it(`should resolve concatenated origin`, () => {
                const p = defineProperty({
                    name: `my-prop`,
                    syntax: `<length>`,
                    classifications: {
                        amount: (node) => node.type === `<length>`,
                    },
                });

                const ast = parseCSSValue(`#($x)px`, { parseBuildVar: $varParser });
                const buildVars: Record<string, ReturnType<typeof parseCSSValue>> = {
                    $x: parseCSSValue(`123`),
                };

                expect(
                    p.classify(ast, { resolveBuildVar: ({ id }) => buildVars[id] }),
                ).deep.include({
                    amount: {
                        value: [buildVars.$x[0], ast[1]],
                        resolved: [
                            {
                                origin: ast,
                                nodes: [0],
                                resolved: [{ origin: buildVars.$x, nodes: [0] }],
                            },
                            { origin: ast, nodes: [ast[1]] },
                        ],
                    },
                });
            });
        });
    });
});
