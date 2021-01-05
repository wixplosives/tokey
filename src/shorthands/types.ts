import type { CSSAstNode, CSSCodeAst } from "../parsers/css-value-tokenizer";

export interface ParseShorthandAPI {
  isExpression(node: CSSCodeAst): boolean;
  getValue(node: CSSCodeAst): CSSCodeAst[];
}

export type ShorthandPropertyOpener<T extends string> = (
  shortHand: CSSCodeAst[],
  api: ParseShorthandAPI
) => Record<T, {value: CSSCodeAst, origin?: CSSCodeAst}>;
