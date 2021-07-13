import {
  tokenize,
  isStringDelimiter,
  isWhitespace,
  createToken,
  getJSCommentStartType,
  getMultilineCommentStartType,
  isCommentEnd,
  getUnclosedComment,
} from "@tokey/core";
import type { Token, Descriptors } from "@tokey/core";

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
  | "}"
  | "&";

export type CSSSelectorToken = Token<Descriptors | Delimiters>;

export function tokenizeSelector(source: string) {
  const parseLineComments = false; // why would that be a choice?
  return tokenize<CSSSelectorToken>(source, {
    isDelimiter,
    isStringDelimiter(char: string, previousChar: string) {
      return previousChar !== `\\` && isStringDelimiter(char);
    },
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

const isDelimiter = (char: string, previousChar: string) =>
  previousChar !== "\\" &&
  (char === "[" ||
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
    char === "}" ||
    char === "&");
