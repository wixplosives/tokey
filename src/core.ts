import type { Token } from "./types";

export interface TokyOptions<T extends Token<unknown>> {
  shouldAddToken(type: T["type"], value: string): boolean;
  isStringDelimiter(char: string): boolean;
  isDelimiter(char: string): boolean;
  isWhitespace(char: string): boolean;
  createToken(value: string, type: T["type"], start: number, end: number): T;
  parseLineComments: boolean;
}

export function tokenize<T extends Token<unknown>>(
  source: string,
  {
    isDelimiter,
    isStringDelimiter,
    isWhitespace,
    shouldAddToken,
    createToken,
    parseLineComments,
  }: TokyOptions<T>
): T[] {
  const tokens: T[] = [];
  let previousChar = "";
  let buffer = "";
  let inComment = "";
  let inString = "";
  let start = 0;
  let nextCharIndex = 0;
  for (const ch of source) {
    nextCharIndex += ch.length;
    if (inString) {
      buffer += ch;
      if (ch === inString && previousChar !== "\\") {
        inString = "";
        pushBuffer("string");
      }
    } else if (inComment) {
      buffer += ch;
      if (inComment === "line-comment" && ch === "\n") {
        inComment = "";
        pushBuffer("line-comment");
      } else if (
        inComment === "multi-comment" &&
        ch === "/" &&
        previousChar === "*"
      ) {
        inComment = "";
        pushBuffer("multi-comment");
      }
    } else if (
      parseLineComments &&
      ch === "/" &&
      source[nextCharIndex] === "/"
    ) {
      pushBuffer();
      buffer += ch;
      inComment = "line-comment";
    } else if (ch === "/" && source[nextCharIndex] === "*") {
      pushBuffer();
      buffer += ch;
      inComment = "multi-comment";
    } else if (isStringDelimiter(ch)) {
      pushBuffer();
      buffer += ch;
      inString = ch;
    } else if (isDelimiter(ch)) {
      pushBuffer();
      buffer += ch;
      pushBuffer(ch);
    } else if (isWhitespace(ch) && !isWhitespace(previousChar)) {
      pushBuffer();
      buffer += ch;
    } else if (!isWhitespace(ch) && isWhitespace(previousChar)) {
      pushBuffer();
      buffer += ch;
    } else {
      buffer += ch;
    }
    previousChar = ch;
  }
  if (buffer.length) {
    if (inComment) {
      if (inComment === "line-comment") {
        pushBuffer("line-comment");
      } else {
        pushBuffer("unclosed-comment");
      }
    } else if (inString) {
      pushBuffer("unclosed-string");
    } else {
      pushBuffer();
    }
  }
  function pushBuffer(type?: T["type"]) {
    if (buffer.length === 0) {
      return;
    }
    const end = start + buffer.length;
    type = type ?? (buffer.trim().length ? "text" : "space");
    if (shouldAddToken(type, buffer)) {
      tokens.push(createToken(buffer, type, start, end));
    }
    start = end;
    buffer = "";
  }
  return tokens;
}
