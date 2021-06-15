import {
  tokenize,
  isStringDelimiter,
  isWhitespace,
  createToken,
  getJSCommentStartType,
  getMultilineCommentStartType,
  isCommentEnd,
  getUnclosedComment,
} from "toky";
import type { Token, Descriptors } from "toky";

type Delimiters =
  | "["
  | "]"
  | "("
  | ")"
  | ","
  | "*"
  | "|"
  | ":"
  | "."
  | "#"
  | ">"
  | "~"
  | "+"
  | "{"
  | "}";

export type CSSSelectorToken = Token<Descriptors | Delimiters>;

export function tokenizeSelector(source: string) {
  const parseLineComments = false; // why would that be a choice?
  return tokenize<CSSSelectorToken>(source, {
    isDelimiter,
    isStringDelimiter,
    isWhitespace,
    shouldAddToken: () => true,
    createToken,
    getCommentStartType: parseLineComments
      ? getJSCommentStartType
      : getMultilineCommentStartType,
    isCommentEnd,
    getUnclosedComment,
  });
}

const isDelimiter = (char: string) =>
  char === "[" ||
  char === "]" ||
  char === "(" ||
  char === ")" ||
  char === "," ||
  char === "*" ||
  char === "|" ||
  char === ":" ||
  char === "." ||
  char === "#" ||
  char === ">" ||
  char === "~" ||
  char === "+" ||
  char === "{" ||
  char === "}";
