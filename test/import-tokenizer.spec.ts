import { test } from "../test-kit/testing";
import { tokenizeImports, ImportValue } from "../src/parsers/import-tokenizer";

const defaultTokenizer = <T extends string>(input: T) =>
  tokenizeImports(input, "{", "}");

const taggedTokenizer = <T extends string>(input: T) =>
  tokenizeImports(input, "{", "}", true);

const createImportValue = (value: ImportValue) => value;

test(`import "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 10,
  }),
]);

test(`import "x";`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 11,
  }),
]);

test(`import name from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: "name",
    errors: [],
    start: 0,
    end: 20,
  }),
]);

test(`import {named} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "named" },
    tagged: {},
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 23,
  }),
]);

test(`import {named as renamed} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "renamed" },
    tagged: {},
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 34,
  }),
]);

test(`import name, {named} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "named" },
    tagged: {},
    from: "x",
    defaultName: "name",
    errors: [],
    start: 0,
    end: 29,
  }),
]);

test(`import * as name from "x"`, defaultTokenizer, [
  createImportValue({
    star: true,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: "name",
    errors: [],
    start: 0,
    end: 25,
  }),
]);

test(`import {named1, named2} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named1: "named1", named2: "named2" },
    tagged: {},
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 32,
  }),
]);

test(`import {named}from"x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "named" },
    tagged: {},
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 21,
  }),
]);

// Broken inputs

test(`import * from "x"`, defaultTokenizer, [
  createImportValue({
    star: true,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: undefined,
    errors: ["expected as after *"],
    start: 0,
    end: 17,
  }),
]);

test(`import * "x"`, defaultTokenizer, [
  createImportValue({
    star: true,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: undefined,
    errors: ["expected as after *", "invalid missing from"],
    start: 0,
    end: 12,
  }),
]);

// this case can be better by reporting missing name after as
test(`import {a as, b} "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { b: "b" },
    tagged: {},
    from: "x",
    defaultName: undefined,
    errors: ["invalid missing from"],
    start: 0,
    end: 20,
  }),
]);

// this can be better by adding the `a` as named
test(`import {a from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: undefined,
    errors: ["unclosed block"],
    start: 0,
    end: 18,
  }),
]);

test(`import {a ; import "y"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    tagged: undefined,
    from: undefined,
    defaultName: undefined,
    errors: [
      "unclosed block",
      "invalid missing from",
      "invalid missing source",
    ],
    start: 0,
    end: 11,
  }),
  createImportValue({
    star: false,
    named: undefined,
    tagged: undefined,
    from: "y",
    defaultName: undefined,
    errors: [],
    start: 12,
    end: 22,
  }),
]);

test(`import from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    tagged: undefined,
    from: "x",
    defaultName: undefined,
    errors: ["missing name"],
    start: 0,
    end: 15,
  }),
]);

test(`import * as x, {a} from "x"`, defaultTokenizer, [
  createImportValue({
    star: true,
    named: { a: "a" },
    tagged: {},
    from: "x",
    defaultName: "x",
    errors: ["Invalid named after *"],
    start: 0,
    end: 27,
  }),
]);

// Tagged imports Extensions

test(`import {named(a as b, c)} from "x"`, taggedTokenizer, [
  createImportValue({
    star: false,
    named: {},
    tagged: { named: { a: "b", c: "c" } },
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 34,
  }),
]);

test(`import {,(a as b, c)} from "x"`, taggedTokenizer, [
  createImportValue({
    star: false,
    named: {},
    tagged: { ",": { a: "b", c: "c" } },
    from: "x",
    defaultName: undefined,
    errors: ["invalid tag name: ,"],
    start: 0,
    end: 30,
  }),
]);

test(`import {named(a as b, c} from "x"`, taggedTokenizer, [
  createImportValue({
    star: false,
    named: {},
    tagged: { named: { a: "b", c: "c" } },
    from: "x",
    defaultName: undefined,
    errors: ['unclosed tagged import "named"'],
    start: 0,
    end: 33,
  }),
]);

test(`import {tag1(a), tag2(b), c} from "x"`, taggedTokenizer, [
  createImportValue({
    star: false,
    named: {
      c: "c",
    },
    tagged: { tag1: { a: "a" }, tag2: { b: "b" } },
    from: "x",
    defaultName: undefined,
    errors: [],
    start: 0,
    end: 37,
  }),
]);
