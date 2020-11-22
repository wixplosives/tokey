import type { Token } from "./types";

/**
 * Checks if a token type is comment
 */
export function isComment(type: string) {
  return (
    type === "line-comment" ||
    type === "multi-comment" ||
    type === "unclosed-comment"
  );
}

/**
 * Checks for a set of JS strings
 */
export const isStringDelimiter = (char: string) =>
  char === `'` || char === `"` || char === "`";

/**
 * Checks for a set of Whitespace
 */
export const isWhitespace = (char: string) =>
  char === " " || char === `\t` || char === `\r` || char === "\n";

/**
 * Creates a basic token
 */
export const createToken = <Type extends string>(
  value: string,
  type: Type,
  start: number,
  end: number
) => {
  return {
    value,
    type,
    start,
    end,
  };
};

/**
 * Get the text between two token indexes
 * if source is provided it will slice the text from original source
 * otherwise the value of the tokens will be concatenated
 */
export function getText(
  tokens: Token<any>[],
  startIndex = 0,
  upToIndex = -1,
  source?: string
) {
  if (upToIndex === -1) {
    upToIndex = tokens.length;
  }

  if (source) {
    return source.slice(tokens[startIndex].start, tokens[upToIndex - 1].end);
  } else {
    let res = "";
    for (let i = startIndex; i < upToIndex; i++) {
      res += tokens[i].value;
    }
    return res;
  }
}

/**
 * Takes an array of tokens and group them into a single token.
 * If source is provided the value will contain the text between the tokens,
 * instead of the tokens concatenated text.
 */
export function groupTokens<
  Tokens extends Token<any>[],
  T extends string = "tokens"
>(tokens: Tokens, type: T = "tokens" as T, source?: string) {
  return {
    type,
    start: tokens[0].start,
    end: tokens[tokens.length - 1].end,
    value: getText(tokens, undefined, undefined, source),
    tokens,
  };
}

/**
 * Trim tokens from both ends with a matcher function
 */
export function trimTokens<Tokens extends Token<any>[]>(
  tokens: Tokens,
  shouldTrimToken: (token: Token<any>) => boolean
) {
  let start = 0;
  let end = tokens.length;
  for (let i = 0; i < tokens.length; i++) {
    if (shouldTrimToken(tokens[i])) {
      start = i + 1;
    } else {
      break;
    }
  }
  for (let i = tokens.length - 1; i > start; i--) {
    if (shouldTrimToken(tokens[i])) {
      end = i;
    } else {
      break;
    }
  }
  return tokens.slice(start, end);
}
