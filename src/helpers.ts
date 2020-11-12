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
