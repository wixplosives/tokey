import { test } from "../test-kit/testing";
import {
  CSSCodeToken,
  CSSCodeTokenGroup,
  tokenizeCSSUrls,
} from "../src/parsers/url-tokenizer";

function createGroup(tokens: CSSCodeToken[]): CSSCodeTokenGroup {
  return {
    tokens: tokens,
    start: tokens[0].start,
    end: tokens[tokens.length - 1].end,
  };
}

test("url('x')", tokenizeCSSUrls, [
  createGroup([
    { value: "url", type: "text", start: 0, end: 3 },
    { value: "(", type: "(", start: 3, end: 4 },
    { value: "'x'", type: "string", start: 4, end: 7 },
    { value: ")", type: ")", start: 7, end: 8 },
  ]),
]);

test(`url("x")`, tokenizeCSSUrls, [
  createGroup([
    { value: "url", type: "text", start: 0, end: 3 },
    { value: "(", type: "(", start: 3, end: 4 },
    { value: `"x"`, type: "string", start: 4, end: 7 },
    { value: ")", type: ")", start: 7, end: 8 },
  ]),
]);

test(`url("x")url("y")url("z")`, tokenizeCSSUrls, [
  createGroup([
    { value: "url", type: "text", start: 0, end: 3 },
    { value: "(", type: "(", start: 3, end: 4 },
    { value: '"x"', type: "string", start: 4, end: 7 },
    { value: ")", type: ")", start: 7, end: 8 },
  ]),
  createGroup([
    { value: "url", type: "text", start: 8, end: 11 },
    { value: "(", type: "(", start: 11, end: 12 },
    { value: '"y"', type: "string", start: 12, end: 15 },
    { value: ")", type: ")", start: 15, end: 16 },
  ]),
  createGroup([
    { value: "url", type: "text", start: 16, end: 19 },
    { value: "(", type: "(", start: 19, end: 20 },
    { value: '"z"', type: "string", start: 20, end: 23 },
    { value: ")", type: ")", start: 23, end: 24 },
  ]),
]);

test("url('x' + $var)", tokenizeCSSUrls, [
  createGroup([
    { value: "url", type: "text", start: 0, end: 3 },
    { value: "(", type: "(", start: 3, end: 4 },
    { value: "'x'", type: "string", start: 4, end: 7 },
    { value: " ", type: "space", start: 7, end: 8 },
    { value: "+", type: "text", start: 8, end: 9 },
    { value: " ", type: "space", start: 9, end: 10 },
    { value: "$var", type: "text", start: 10, end: 14 },
    { value: ")", type: ")", start: 14, end: 15 },
  ]),
]);

test("url('x' + $var/*comment*/)", tokenizeCSSUrls, [
  createGroup([
    { value: "url", type: "text", start: 0, end: 3 },
    { value: "(", type: "(", start: 3, end: 4 },
    { value: "'x'", type: "string", start: 4, end: 7 },
    { value: " ", type: "space", start: 7, end: 8 },
    { value: "+", type: "text", start: 8, end: 9 },
    { value: " ", type: "space", start: 9, end: 10 },
    { value: "$var", type: "text", start: 10, end: 14 },
    { value: "/*comment*/", type: "multi-comment", start: 14, end: 25 },
    { value: ")", type: ")", start: 25, end: 26 },
  ]),
]);

// invalid comment
test("url(/*comment*/'x' + $var)", tokenizeCSSUrls, [
  createGroup([
    { value: "url", type: "text", start: 0, end: 3 },
    { value: "(", type: "(", start: 3, end: 4 },
    { value: "/*comment*/", type: "multi-comment", start: 4, end: 15 },
    { value: "'x'", type: "string", start: 15, end: 18 },
    { value: " ", type: "space", start: 18, end: 19 },
    { value: "+", type: "text", start: 19, end: 20 },
    { value: " ", type: "space", start: 20, end: 21 },
    { value: "$var", type: "text", start: 21, end: 25 },
    { value: ")", type: ")", start: 25, end: 26 },
  ]),
]);

// invalid url
test("url/*comment*/('x' + $var)", tokenizeCSSUrls, []);

// TODO: add test with more complex inputs (real world css)
