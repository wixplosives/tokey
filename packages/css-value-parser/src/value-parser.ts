import type { BaseAstNode, RawComma, RawSpace } from "./ast-types";
import { tokenizeValue } from "./tokenizer";
import { Seeker } from "@tokey/core";

export type ParseResults = Array<BaseAstNode | RawComma | RawSpace>;
interface ParsingContext {
  ast: ParseResults;
  buffer: ParseResults;
}
export function parseCssValue(source: string, _options?: {parseBuildVar?: () => {id: string, subType: string}}): ParseResults {
  const tokens = tokenizeValue(source);
  return new Seeker(tokens).run<ParsingContext>(
    () => {
      /**/
    },
    { ast: [], buffer: [] },
    source
  ).ast;
}
