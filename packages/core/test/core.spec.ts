import { testTokenizer as test } from "@tokey/test-kit";
import { tokenize, TokyOptions } from "@tokey/core";
import {
  createToken,
  isWhitespace,
  isStringDelimiter,
  getJSCommentStartType,
  isCommentEnd,
  getUnclosedComment,
} from "@tokey/core/dist/helpers";
import type { Token } from "@tokey/core";

const options: TokyOptions<Token> = {
  isDelimiter(char: string) {
    return (
      char === "(" ||
      char === ")" ||
      char === "{" ||
      char === "}" ||
      char === "[" ||
      char === "]"
    );
  },
  shouldAddToken() {
    return true;
  },
  isStringDelimiter: isStringDelimiter,
  isWhitespace: isWhitespace,
  createToken: createToken,
  getCommentStartType: getJSCommentStartType,
  isCommentEnd: isCommentEnd,
  getUnclosedComment: getUnclosedComment,
};

const defaultTokenizer = <T extends string>(input: T) =>
  tokenize(input, options);

const ignoreSpaceTokenizer = <T extends string>(input: T) =>
  tokenize(input, {
    ...options,
    shouldAddToken(type) {
      return type !== "space";
    },
  });

describe("core - tokenize", () => {
  it("1", () => {
    test("1", defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
    ]);
  });

  it("1'23'", () => {
    test("1'23'", defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: "'23'", type: "string", start: 1, end: 5 },
    ]);
  });

  it("1`23`", () => {
    test("1`23`", defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: "`23`", type: "string", start: 1, end: 5 },
    ]);
  });

  it(`1"23"`, () => {
    test(`1"23"`, defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: '"23"', type: "string", start: 1, end: 5 },
    ]);
  });

  it(`1/*"23"*/`, () => {
    test(`1/*"23"*/`, defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: '/*"23"*/', type: "multi-comment", start: 1, end: 9 },
    ]);
  });

  it(`1/*"23"`, () => {
    test(`1/*"23"`, defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: '/*"23"', type: "unclosed-comment", start: 1, end: 7 },
    ]);
  });

  it(`1//"23"`, () => {
    test(`1//"23"`, defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: '//"23"', type: "line-comment", start: 1, end: 7 },
    ]);
  });

  it(`1//"23"\n4`, () => {
    test(`1//"23"\n4`, defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: '//"23"\n', type: "line-comment", start: 1, end: 8 },
      { value: "4", type: "text", start: 8, end: 9 },
    ]);
  });

  it(`(1)`, () => {
    test(`(1)`, defaultTokenizer, [
      { value: "(", type: "(", start: 0, end: 1 },
      { value: "1", type: "text", start: 1, end: 2 },
      { value: ")", type: ")", start: 2, end: 3 },
    ]);
  });

  it(`{1}`, () => {
    test(`{1}`, defaultTokenizer, [
      { value: "{", type: "{", start: 0, end: 1 },
      { value: "1", type: "text", start: 1, end: 2 },
      { value: "}", type: "}", start: 2, end: 3 },
    ]);
  });

  it(`[1]`, () => {
    test(`[1]`, defaultTokenizer, [
      { value: "[", type: "[", start: 0, end: 1 },
      { value: "1", type: "text", start: 1, end: 2 },
      { value: "]", type: "]", start: 2, end: 3 },
    ]);
  });

  it(` `, () => {
    test(` `, defaultTokenizer, [
      { value: " ", type: "space", start: 0, end: 1 },
    ]);
  });

  it(`  `, () => {
    test(`  `, defaultTokenizer, [
      { value: "  ", type: "space", start: 0, end: 2 },
    ]);
  });

  it(`\t`, () => {
    test(`\t`, defaultTokenizer, [
      { value: "\t", type: "space", start: 0, end: 1 },
    ]);
  });

  it(`1 2`, () => {
    test(`1 2`, defaultTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: " ", type: "space", start: 1, end: 2 },
      { value: "2", type: "text", start: 2, end: 3 },
    ]);
  });

  it(`1 2`, () => {
    test(`1 2`, ignoreSpaceTokenizer, [
      { value: "1", type: "text", start: 0, end: 1 },
      { value: "2", type: "text", start: 2, end: 3 },
    ]);
  });
});
