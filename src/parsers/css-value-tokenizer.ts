import { tokenize } from "../core";
import {
  isStringDelimiter,
  isWhitespace,
  createToken,
  getText,
} from "../helpers";
import type { Token, Descriptors } from "../types";

type Delimiters = "(" | ")" | ",";
export type SeparatorTokens = "line-comment" | "multi-comment" | "," | "space";
export type CSSCodeToken = Token<Descriptors | Delimiters>;
export type CSSSeparatorTokens = Token<SeparatorTokens>;
export type CSSCodeAst = StringNode | MethodCall | TextNode;
export interface ASTNode<Types = Descriptors> {
  type: Types;
  text: string;
  start: number;
  end: number;
  before: CSSSeparatorTokens[];
  after: CSSSeparatorTokens[];
}

export interface MethodCall extends ASTNode<"call"> {
  name: string;
  args: CSSCodeAst[];
}
export interface StringNode extends ASTNode<"string"> {}
export interface TextNode extends ASTNode<"text"> {}

export const isSeparatorToken = (
  token: CSSCodeToken
): token is CSSSeparatorTokens => {
  const { type } = token;
  return (
    type === "line-comment" ||
    type === "multi-comment" ||
    type === "," ||
    type === "space"
  );
};

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
    } else if (isSeparatorToken(token)) {
      before.push(token);
    } else if (token.type === "text") {
      if (tokens[i + 1]?.type === "(") {
        const res = parseDeclValueTokens(tokens, i + 2);
        const methodText = getText(tokens, i, res.stoppedAtIdx + 1);
        i = res.stoppedAtIdx;
        ast.push({
          type: "call",
          text: methodText,
          start: token.start,
          end: token.start + methodText.length,
          before,
          after: [],
          name: token.value,
          args: res.ast,
        });
        before = [];
      } else {
        ast.push({
          type: token.type,
          text: token.value,
          start: token.start,
          end: token.end,
          before,
          after: [],
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
