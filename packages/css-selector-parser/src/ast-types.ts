import type { Token } from "@tokey/core";

export interface Selector extends Omit<Token<"selector">, "value"> {
  nodes: SelectorNodes;
  before: string;
  after: string;
}

export type NthWithSelectorList = [Nth, ...SelectorList];

export interface PseudoClass extends Token<"pseudo_class"> {
  nodes?: SelectorList | NthWithSelectorList;
  colonComments: Comment[];
}

export interface PseudoElement extends Token<"pseudo_element"> {
  nodes?: SelectorList;
  colonComments: { first: Comment[]; second: Comment[] };
}

export interface Class extends Token<"class"> {
  nodes?: SelectorList;
  dotComments: SelectorNodes;
}

export interface Id extends Token<"id"> {
  nodes?: SelectorList;
}

export interface Attribute extends Token<"attribute"> {
  // left: string;
  // right: string;
  // op: "" | "=" | "~=" | "|=" | "^=" | "$=" | "*=";
  // quotes: "'" | '"' | "";
  nodes?: SelectorList;
}

export interface Namespace {
  value: string;
  beforeComments: Comment[];
  afterComments: Comment[];
  invalid?: "namespace" | "target" | "namespace,target" | "";
}

export interface Element extends Token<"element"> {
  namespace?: Namespace;
  nodes?: SelectorList;
}

export interface Star extends Token<"star"> {
  namespace?: Namespace;
  nodes?: SelectorList;
}

export interface Combinator extends Token<"combinator"> {
  combinator: "space" | "+" | "~" | ">";
  before: string;
  after: string;
  invalid: boolean;
}

export interface Nesting extends Token<"nesting"> {
  value: "&";
  nodes?: SelectorList;
}

export type Invalid = Token<"invalid">;
export interface Comment extends Token<"comment"> {
  before: string;
  after: string;
}

export interface NthBase<PART extends string> extends Token<PART> {
  before: string;
  after: string;
  invalid?: boolean;
}
export type NthStep = NthBase<"nth_step">;
export type NthOffset = NthBase<"nth_offset">;
export type NthDash = NthBase<"nth_dash">;
export type NthOf = NthBase<"nth_of">;
export type NthNode = NthStep | NthOffset | NthDash | NthOf | Comment;
export interface Nth extends Omit<Token<"nth">, "value"> {
  nodes: Array<NthNode>;
  before: string;
  after: string;
  // invalid?: boolean;
}

export type NamespacedNodes = Element | Star;

export type Containers =
  | NamespacedNodes
  | Attribute
  | Id
  | Class
  | PseudoClass
  | PseudoElement
  | Nesting;

export type SelectorNode =
  | Containers
  | Selector
  | Combinator
  | Comment
  | Invalid
  | Nth
  | NthStep
  | NthDash
  | NthOffset
  | NthOf;
export type SelectorNodes = SelectorNode[];
export type SelectorList = Selector[];

export type DeepReadonlySelectorList = DeepReadonly<SelectorList>;
export type DeepReadonlySelectorNode = DeepReadonly<SelectorNode>;
export type DeepReadonlyNthWithSelectorList = DeepReadonly<NthWithSelectorList>;

export type DeepReadonly<T> = T extends (infer R)[]
  ? ReadonlyArray<DeepReadonly<R>>
  : T extends Function
  ? T
  : T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;
