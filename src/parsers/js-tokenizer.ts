import { Seeker } from "../seeker";
import { tokenize } from "../core";
import {
  isComment,
  isStringDelimiter,
  isWhitespace,
  createToken,
  getJSCommentStartType,
  isCommentEnd,
  getUnclosedComment,
} from "../helpers";
import type { Token, Descriptors } from "../types";

type Delimiters =
  | ":"
  | ";"
  | "*"
  | "/"
  | "."
  | ","
  | "("
  | ")"
  | "{"
  | "}"
  | ">"
  | "="
  | "<"
  | "|"
  | "?"
  | "["
  | "]"
  | "+"
  | "-"
  | "~"
  | "^"
  | "&"
  | "%"
  | "!";

export type JSCodeToken = Token<Descriptors | Delimiters>;

export function tokenizeJS(source: string) {
  return tokenize<JSCodeToken>(source, {
    isDelimiter,
    isStringDelimiter,
    isWhitespace,
    shouldAddToken,
    createToken,
    getCommentStartType: getJSCommentStartType,
    isCommentEnd,
    getUnclosedComment,
  });
}

const isDelimiter = (char: string) =>
  char === ":" ||
  char === ";" ||
  char === "*" ||
  char === "/" ||
  char === "." ||
  char === "," ||
  char === "(" ||
  char === ")" ||
  char === "{" ||
  char === "}" ||
  char === ">" ||
  char === "=" ||
  char === "<" ||
  char === "|" ||
  char === "?" ||
  char === "[" ||
  char === "]" ||
  char === "+" ||
  char === "-" ||
  char === "~" ||
  char === "^" ||
  char === "&" ||
  char === "%" ||
  char === "!";

const shouldAddToken = (type: JSCodeToken["type"]) =>
  isComment(type) || type === "space" ? false : true;

interface ParedFunction {
  init: JSCodeToken;
  name: JSCodeToken | undefined;
  args: JSCodeToken[] | undefined;
  generator: JSCodeToken | undefined;
  body: (JSCodeToken | ParedFunction)[] | undefined;
  start: number;
  end: number;
}

export function findTopLevelFunctions(tokens: JSCodeToken[]) {
  const s = new Seeker(tokens);
  let t;
  const functions: ParedFunction[] = [];
  while ((t = s.next())) {
    if (!t.type) {
      break;
    }
    if (t.value === "function") {
      let functionTokens: ParedFunction = {
        init: t,
        name: undefined,
        generator: undefined,
        args: undefined,
        body: undefined,
        start: t.start,
        end: t.end, // temp
      };

      t = s.peek();
      if (t.type === "*") {
        t = s.next();
        functionTokens.generator = t;
        t = s.peek();
      }
      if (t.type === "text") {
        t = s.next();
        functionTokens.name = t;
      }
      const args = getBlock(s, "(", ")");
      if (args) {
        functionTokens.args = args;
      } else {
        // error missing args
      }
      t = s.peek();
      if (t.type === "{") {
        functionTokens.body = getBlock(s, "{", "}");
      } else {
        // error no block
      }
      functionTokens.end = t.end;
      functions.push(functionTokens);
    }
  }

  return functions;
}

function getBlock(
  s: Seeker<JSCodeToken>,
  blockStart: string,
  blockEnd: string
) {
  let t = s.next();
  if (t.type !== blockStart) {
    return;
  }
  let block = [t];
  let blockLevel = 1;
  while ((t = s.next())) {
    if (!t.type) {
      if (blockLevel !== 0) {
        // unclosed block
      }
      break;
    }
    block.push(t);
    if (t.type === blockEnd) {
      blockLevel--;
      if (blockLevel === 0) {
        break;
      }
    } else if (t.type === blockStart) {
      blockLevel++;
    }
  }
  return block;
}
