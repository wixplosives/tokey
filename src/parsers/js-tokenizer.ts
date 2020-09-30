// import { Seeker } from "../seeker";
import { tokenize } from "../core";
import {
  isComment,
  isStringDelimiter,
  isWhitespace,
  createToken,
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

