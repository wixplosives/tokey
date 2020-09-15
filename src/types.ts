export type Descriptors =
  | "string"
  | "text"
  | "line-comment"
  | "multi-comment"
  | "unclosed-string"
  | "unclosed-comment"
  | "space";

export interface Token<Types = Descriptors> {
  type: Types;
  start: number;
  end: number;
  value: string;
}
