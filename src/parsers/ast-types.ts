import type { Token } from "../types";

export interface ASTNode<TYPES, SEPARATORS extends string> {
  type: TYPES;
  text: string;
  start: number;
  end: number;
  before: Array<Token<SEPARATORS>>;
  after: Array<Token<SEPARATORS>>;
}
