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
