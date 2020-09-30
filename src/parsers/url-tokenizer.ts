import { tokenize } from "../core";
import { isStringDelimiter, isWhitespace, createToken } from "../helpers";
import type { Token, Descriptors } from "../types";

type Delimiters = "(" | ")" | "," | ";" | ":";

export type CSSCodeToken = Token<Descriptors | Delimiters>;

export function tokenizeCSSUrls(source: string) {
  return getUrlTokens(
    tokenize<CSSCodeToken>(source, {
      isDelimiter,
      isStringDelimiter,
      isWhitespace,
      shouldAddToken,
      createToken,
    })
  );
}

const isDelimiter = (char: string) =>
  char === "(" || char === ")" || char === "," || char === ";" || char === ":";

const shouldAddToken = () => true;

function getUrlTokens(tokens: CSSCodeToken[]) {
  const urls: { start: number; end: number; tokens: CSSCodeToken[] }[] = [];
  let inUrl;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (inUrl) {
      inUrl.tokens.push(token);
      inUrl.end = token.end;
      if (token.type === ")") {
        urls.push(inUrl);
        inUrl = undefined;
      }
    } else if (
      token.type === "text" &&
      token.value === "url" &&
      tokens[i + 1]?.type === "("
    ) {
      inUrl = { tokens: [token], start: token.start, end: token.end };
    }
  }
  return urls;
}
