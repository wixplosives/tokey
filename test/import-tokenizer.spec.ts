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
  }),
]);

test(`import name from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    from: "x",
    defaultName: "name",
    errors: [],
  }),
]);

test(`import {named} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "named" },
    from: "x",
    defaultName: undefined,
    errors: [],
  }),
]);

test(`import {named as renamed} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "renamed" },
    from: "x",
    defaultName: undefined,
    errors: [],
  }),
]);

test(`import name, {named} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "named" },
    from: "x",
    defaultName: "name",
    errors: [],
  }),
]);

test(`import * as name from "x"`, defaultTokenizer, [
  createImportValue({
    star: true,
    named: undefined,
    from: "x",
    defaultName: "name",
    errors: [],
  }),
]);

test(`import {named1, named2} from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named1: "named1", named2: "named2" },
    from: "x",
    defaultName: undefined,
    errors: [],
  }),
]);

test(`import {named}from"x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: { named: "named" },
    from: "x",
    defaultName: undefined,
    errors: [],
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
  }),
]);

test(`import * "x"`, defaultTokenizer, [
  createImportValue({
    star: true,
    named: undefined,
    from: "x",
    defaultName: undefined,
    errors: ["expected as after *", "invalid missing from"],
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
  }),
]);

test(`import from "x"`, defaultTokenizer, [
  createImportValue({
    star: false,
    named: undefined,
    from: "x",
    defaultName: undefined,
    errors: ["missing name"],
  }),
]);

test(`import * as x, {a} from "x"`, defaultTokenizer, [
  createImportValue({
    star: true,
    named: { a: "a" },
    from: "x",
    defaultName: "x",
    errors: ["Invalid named after *"],
  }),
]);
