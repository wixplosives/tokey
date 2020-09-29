import { test } from "../test-kit/testing";
import { tokenizeImports, ImportValue } from "../src/parsers/import-tokenizer";

const defaultTokenizer = <T extends string>(input: T) =>
  tokenizeImports(input, "{", "}");

const createImportValue = (value: ImportValue) => value;

test(`import "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
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
    from: "x",
    defaultName: "x",
    errors: ["Invalid named after *"],
    start: 0,
    end: 27,
  }),
]);
