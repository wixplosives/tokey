import {
  createCssValueAST,
  CSSCodeAst,
} from "../src/parsers/css-value-tokenizer";
import { expect } from "chai";
import { describe, it } from "mocha";
import { openMarginShorthand } from "../src/shorthands/parsers";
import type { ParseShorthandAPI } from "../src/shorthands/types";
describe("margin shorthand parser", () => {
  const createSimApi: (
    map: Map<CSSCodeAst, CSSCodeAst[]>
  ) => ParseShorthandAPI = (map) => ({
    isExpression: (node) => map.has(node),
    getValue: (node) => map.get(node) || [],
  });
  it("should parse one val shorthand", () => {
    const colorAndUrl = "10px";
    const ast = createCssValueAST(colorAndUrl);
    const res = openMarginShorthand(ast, createSimApi(new Map()));
    expect(res).to.eql({
      "margin-left": {
        value: ast[0],
      },
      "margin-right": {
        value: ast[0],
      },
      "margin-top": {
        value: ast[0],
      },
      "margin-bottom": {
        value: ast[0],
      },
    });
  });
  it("should parse two val shorthand", () => {
    const colorAndUrl = "10px 12px";
    const ast = createCssValueAST(colorAndUrl);
    const res = openMarginShorthand(ast, createSimApi(new Map()));
    expect(res).to.eql({
      "margin-left": {
        value: ast[1],
      },
      "margin-right": {
        value: ast[1],
      },
      "margin-top": {
        value: ast[0],
      },
      "margin-bottom": {
        value: ast[0],
      },
    });
  });
  it("should parse three val shorthand", () => {
    const colorAndUrl = "10px 12px 13px";
    const ast = createCssValueAST(colorAndUrl);
    const res = openMarginShorthand(ast, createSimApi(new Map()));
    expect(res).to.eql({
      "margin-left": {
        value: ast[1],
      },
      "margin-right": {
        value: ast[1],
      },
      "margin-top": {
        value: ast[0],
      },
      "margin-bottom": {
        value: ast[2],
      },
    });
  });
  it("should parse four val shorthand", () => {
    const colorAndUrl = "10px 11px 12px 13px";
    const ast = createCssValueAST(colorAndUrl);
    const res = openMarginShorthand(ast, createSimApi(new Map()));
    expect(res).to.eql({
      "margin-left": {
        value: ast[3],
      },
      "margin-right": {
        value: ast[1],
      },
      "margin-top": {
        value: ast[0],
      },
      "margin-bottom": {
        value: ast[2],
      },
    });
  });
  it("should include usageas for variable", () => {
    const colorAndUrl = "10px $var 13px";
    const ast = createCssValueAST(colorAndUrl);
    const varVal = createCssValueAST("11px");
    const varsMap = new Map([[ast[1], varVal]]);
    const res = openMarginShorthand(ast, createSimApi(varsMap));
    expect(res).to.eql({
      "margin-left": {
        value: varVal[0],
        origin: ast[1],
      },
      "margin-right": {
        value: varVal[0],
        origin: ast[1],
      },
      "margin-top": {
        value: ast[0],
      },
      "margin-bottom": {
        value: ast[2],
      },
    });
  });
  it("should include usages for variable with 2 units", () => {
    const colorAndUrl = "10px $var 13px";
    const ast = createCssValueAST(colorAndUrl);
    const varVal = createCssValueAST("11px 12px");
    const varsMap = new Map([[ast[1], varVal]]);
    const res = openMarginShorthand(ast, createSimApi(varsMap));
    expect(res).to.eql({
      "margin-left": {
        value: ast[2],
      },
      "margin-right": {
        value: varVal[0],
        origin: ast[1],
      },
      "margin-top": {
        value: ast[0],
      },
      "margin-bottom": {
        value: varVal[1],
        origin: ast[1],
      },
    });
  });
});
