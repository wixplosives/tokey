import { tokenize } from "../core";
import {
  isStringDelimiter,
  isWhitespace,
  createToken,
  getText,
} from "../helpers";
import type { Token, Descriptors } from "../types";

type Delimiters = "(" | ")" | ",";

export type CSSCodeToken = Token<Descriptors | Delimiters>;
export const separatorTokens = ["line-comment", "multi-comment", ",", "space"];
export type SeparatorTokens = typeof separatorTokens extends Array<infer U>
  ? U
  : never;
export type CSSSeparatorTokens = Token<SeparatorTokens>;
export type CSSCodeAst = StringNode | MethodCall | TextNode;
export interface ASTNode<Types = Descriptors> {
  type: Types;
  start: number;
  end: number;
  text: string;
  before: CSSSeparatorTokens[];
  after?: CSSSeparatorTokens[];
}

export interface MethodCall extends ASTNode<"call"> {
  name: string;
  args: CSSCodeAst[];
}
export interface StringNode extends ASTNode<"string"> {}
export interface TextNode extends ASTNode<"text"> {}

export function createCssValueAST(source: string): CSSCodeAst[] {
  return parseDeclValueTokens(
    tokenize<CSSCodeToken>(source, {
      isDelimiter,
      isStringDelimiter,
      isWhitespace,
      shouldAddToken,
      createToken,
    })
  ).ast;
}

const isDelimiter = (char: string) =>
  char === "(" || char === ")" || char === ",";

const shouldAddToken = () => true;

function parseDeclValueTokens(
  tokens: CSSCodeToken[],
  startAtIdx = 0
): { ast: CSSCodeAst[]; stoppedAtIdx: number } {
  const ast: CSSCodeAst[] = [];
  let before: CSSSeparatorTokens[] = [];
  for (let i = startAtIdx; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === ")") {
      const lastAst = ast[ast.length - 1];
      if (lastAst && before.length) {
        lastAst.after = before;
        before = [];
      }
      return {
        ast,
        stoppedAtIdx: i,
      };
    } else if (separatorTokens.includes(token.type)) {
      before.push(token);
    } else if (token.type === "text") {
      if (tokens[i + 1]?.type === "(") {
        const res = parseDeclValueTokens(tokens, i + 2);
        const methodText = getText(tokens, i, res.stoppedAtIdx + 1);
        i = res.stoppedAtIdx;
        ast.push({
          type: "call",
          before,
          name: token.value,
          args: res.ast,
          start: token.start,
          text: methodText,
          end: token.start + methodText.length,
        });
        before = [];
      } else {
        ast.push({
          type: token.type,
          start: token.start,
          before,
          end: token.end,
          text: token.value,
        });
        before = [];
      }
    }
  }
  return {
    ast,
    stoppedAtIdx: tokens.length,
  };
}
