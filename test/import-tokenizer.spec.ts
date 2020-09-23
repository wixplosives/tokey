import { test } from "../test-kit/testing";
import { tokenizeImports, ImportValue } from "../src/parsers/import-tokenizer";

const defaultTokenizer = <T extends string>(input: T) =>
  tokenizeImports(input, "{", "}");

const createImportValue = (v: ImportValue) => v;

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
