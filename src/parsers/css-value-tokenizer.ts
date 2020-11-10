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
export type CSSCodeAst = StringNode | MethodCall | TextNode;
export interface ASTNode<Types = Descriptors> extends Token<Types> {
  beforeText: string;
  afterText?: string;
}

export interface MethodCall extends ASTNode<"call"> {
  name: string;
  args: CSSCodeAst[];
}
export interface StringNode extends ASTNode<"string"> {}
export interface TextNode extends ASTNode<"text"> {}

export function createCssValueAST(source: string): CSSCodeAst[] {
  return getDeclValueTokens(
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

function getDeclValueTokens(
  tokens: CSSCodeToken[],
  startAtIdx = 0
): { ast: CSSCodeAst[]; stoppedAtIdx: number } {
  const ast: CSSCodeAst[] = [];
  let beforeText = "";
  for (let i = startAtIdx; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === ")") {
      const lastAst = ast[ast.length - 1];
      if (lastAst && beforeText) {
        lastAst.afterText = beforeText;
      }
      return {
        ast,
        stoppedAtIdx: i,
      };
    } else if (token.type === "space") {
      beforeText += tokens[i].value;
    } else if (token.type === "text") {
      if (tokens[i + 1]?.type === "(") {
        const res = getDeclValueTokens(tokens, i + 2);
        const methodText = getText(tokens, i, res.stoppedAtIdx + 1);
        i = res.stoppedAtIdx;
        ast.push({
          type: "call",
          beforeText,
          name: token.value,
          args: res.ast,
          start: token.start,
          value: methodText,
          end: token.start + methodText.length,
        });
        beforeText = "";
      } else {
        ast.push({
          type: token.type,
          start: token.start,
          beforeText,
          end: token.end,
          value: token.value,
        });
        beforeText = "";
      }
    }
  }
  return {
    ast,
    stoppedAtIdx: tokens.length,
  };
}
