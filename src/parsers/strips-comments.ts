import { tokenize } from "../core";
import {
  isStringDelimiter,
  isWhitespace,
  createToken,
  getText,
} from "../helpers";
import type { Token, Descriptors } from "../types";

const isDelimiter = () => false;
const shouldAddToken = (type: Descriptors) =>
  type !== "line-comment" &&
  type !== "multi-comment" &&
  type !== "unclosed-comment";

export function stripComments(source: string) {
  const tokens = tokenize<Token<Descriptors>>(source, {
    isDelimiter,
    isStringDelimiter,
    isWhitespace,
    shouldAddToken,
    createToken,
  });

  return getText(tokens);
}
