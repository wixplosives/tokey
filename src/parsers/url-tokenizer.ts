import { tokenize } from "../core";
import type { Token, Descriptors } from "../types";
import type { isStringDelimiter, isWhitespace, createToken } from "../helpers";

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
  const urls: CSSCodeToken[][] = [];
  let inUrl;
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (inUrl) {
      inUrl.push(token);
      if (token.type === ")") {
        urls.push(inUrl);
        inUrl = undefined;
      }
    } else if (
      token.type === "text" &&
      token.value === "url" &&
      tokens[i + 1]?.type === "("
    ) {
      inUrl = [token];
    }
  }
  return urls;
}
