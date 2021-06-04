import { tokenize } from "../core";
import {
  isStringDelimiter,
  isWhitespace,
  getJSCommentStartType,
  getMultilineCommentStartType,
  isCommentEnd,
  createToken,
  getText,
  getUnclosedComment,
} from "../helpers";
import type { Token, Descriptors } from "../types";

export type Delimiters = "(" | ")" | "," | "/";
export type SeparatorTokens = "line-comment" | "multi-comment" | "space";
export type CSSValueCodeToken = Token<Descriptors | Delimiters>;
export type CSSSeparatorTokens = Token<SeparatorTokens>;
export type CSSCodeAst =
  | StringNode
  | MethodCall
  | TextNode
  | CommaNode
  | SlashNode;
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
export interface CommaNode extends ASTNode<","> {}
export interface SlashNode extends ASTNode<"/"> {}

export const URL_CALL_TOKEN = "url";

export const isSeparatorToken = (
  token: CSSValueCodeToken
): token is CSSSeparatorTokens => {
  const { type } = token;
  return (
    type === "line-comment" || type === "multi-comment" || type === "space"
  );
};

export function createCssValueAST(
  source: string,
  parseLineComments = false
): CSSCodeAst[] {
  return parseDeclValueTokens(
    source,
    tokenize<CSSValueCodeToken>(source, {
      isDelimiter,
      isStringDelimiter,
      isWhitespace,
      shouldAddToken,
      createToken,
      getCommentStartType: parseLineComments
        ? getJSCommentStartType
        : getMultilineCommentStartType,
      isCommentEnd,
      getUnclosedComment,
    })
  ).ast;
}

const isDelimiter = (char: string) =>
  char === "(" || char === ")" || char === "," || char === "/";

const shouldAddToken = () => true;

function parseDeclValueTokens(
  source: string,
  tokens: CSSValueCodeToken[],
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
    } else if (token.type === "text" && tokens[i + 1]?.type === "(") {
      const res = parseDeclValueTokens(source, tokens, i + 2);
      const methodText = getText(tokens, i, res.stoppedAtIdx + 1, source);
      i = res.stoppedAtIdx;
      res.ast = getUrlTokensAst(token, res.ast);
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
        type: token.type as any,
        text: token.value,
        start: token.start,
        end: token.end,
        before,
        after: [],
      });
      before = [];
    }
  }

  return {
    ast,
    stoppedAtIdx: tokens.length,
  };
}

function getUrlTokensAst(
  token: CSSValueCodeToken,
  ast: CSSCodeAst[]
): CSSCodeAst[] {
  if (token.value !== URL_CALL_TOKEN || ast.length === 0) {
    return ast;
  }

  const pushFixedTextNodeToFixedAst = () => {
    if (fixedTextNode) {
      fixedTextNode.end = fixedTextNode.start + fixedTextNode.text.length;
      fixedAst.push(fixedTextNode);
      fixedTextNode = null;
    }
  };

  let fixedTextNode: TextNode | null = null;
  const fixedAst: CSSCodeAst[] = [];
  for (const node of ast) {
    if (node.type === "/" || node.type === "text") {
      if (!fixedTextNode) {
        fixedTextNode = {
          type: "text",
          text: "",
          before: node.before,
          after: [],
          start: node.start,
          end: -1,
        };
      }
      fixedTextNode.text += node.text;
    } else {
      pushFixedTextNodeToFixedAst();
      fixedAst.push(node);
    }
  }

  pushFixedTextNodeToFixedAst();

  return fixedAst;
}
