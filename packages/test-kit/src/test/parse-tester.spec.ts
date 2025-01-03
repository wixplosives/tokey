import { createParseTester } from '@tokey/test-kit';
import { expect } from 'chai';

describe(`createParseTester`, () => {
    it(`should create a tester function that test parsed input against expectation`, () => {
        const testReverser = createParseTester({
            parse: (value: string) => value.split(``).reverse().join(``),
        });

        expect(() => {
            testReverser(`123`, {
                expectedAst: `321`,
            });
        }, `valid expectation`).to.not.throw();
        expect(() => {
            testReverser(`123`, {
                expectedAst: `abc`,
            });
        }, `invalid expectation`).to.throw(createParseTester.errors.mismatchAst(`"321"`, `"abc"`));
    });
    it(`should throw error that take place during parse `, () => {
        const testReverser = createParseTester({
            parse: (_value: string): string => {
                throw new Error(`parse error`);
            },
        });

        expect(() => {
            testReverser(`123`, { expectedAst: `` });
        }, `invalid expectation`).to.throw(`parse error`);
    });
    it(`should test stringify when supplied (test against initial input)`, () => {
        const testReverser = createParseTester({
            parse: (value: string) => value.split(``).reverse().join(``),
            stringify: (value: string) => value.split(``).reverse().join(``),
        });
        const testReverserWithBrokenStringifier = createParseTester({
            parse: (value: string) => value.split(``).reverse().join(``),
            stringify: (_value: string) => `wrong value`,
        });

        expect(() => {
            testReverser(`123`, {
                expectedAst: `321`,
            });
        }, `valid expectation`).to.not.throw();
        expect(() => {
            testReverserWithBrokenStringifier(`123`, {
                expectedAst: `321`,
            });
        }, `invalid stringify`).to.throw(
            createParseTester.errors.mismatchStringify(`wrong value`, `123`),
        );
    });
    it(`should test stringify when supplied (test against custom value)`, () => {
        const testReverser = createParseTester({
            parse: (value: string) => value.split(``).reverse().join(``),
            stringify: (_value: string) => `stringified`,
        });

        expect(() => {
            testReverser(`123`, {
                expectedAst: `321`,
                expectedString: `stringified`,
            });
        }, `match custom`).to.not.throw();
        expect(() => {
            testReverser(`123`, {
                expectedAst: `321`,
                expectedString: `custom`,
            });
        }, `mismatch stringify`).to.throw(
            createParseTester.errors.mismatchStringify(`stringified`, `custom`),
        );
    });
    it(`should add label prefix to failed error`, () => {
        const testReverser = createParseTester({
            parse: (value: string) => value.split(``).reverse().join(``),
            stringify: (_value: string) => `stringified`,
        });

        expect(() => {
            testReverser(`123`, {
                expectedAst: `xxx`,
                label: `test message`,
            });
        }, `ast check`).to.throw(
            createParseTester.errors.mismatchAst(`"321"`, `"xxx"`, `test message`),
        );
        expect(() => {
            testReverser(`123`, {
                expectedAst: `321`,
                label: `test message`,
            });
        }, `stringify check`).to.throw(
            createParseTester.errors.mismatchStringify(`stringified`, `123`, `test message`),
        );
    });
});
