import { tokenize } from "../core";
import {
  isStringDelimiter,
  isWhitespace,
  createToken,
  getText,
  isComment,
  getJSCommentStartType,
  getMultilineCommentStartType,
  isCommentEnd,
  getUnclosedComment,
} from "../helpers";
import type { Token, Descriptors } from "../types";

const isDelimiter = () => false;
const shouldAddToken = (type: Descriptors) => !isComment(type);

export function stripComments(source: string, parseLineComments = true) {
  const tokens = tokenize<Token<Descriptors>>(source, {
    isDelimiter,
    isStringDelimiter,
    isWhitespace,
    shouldAddToken,
    createToken,
    getCommentStartType: parseLineComments
      ? getJSCommentStartType
      : getMultilineCommentStartType,
    isCommentEnd,
    getUnclosedComment,
  });

  return getText(tokens);
}
