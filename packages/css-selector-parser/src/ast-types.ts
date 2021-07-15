import type { Immutable } from "./types";
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

// immutable ast
export type ImmutableSelectorList = Immutable<SelectorList>;
export type ImmutableSelectorNode = Immutable<SelectorNode>;
export type ImmutableNthWithSelectorList = Immutable<NthWithSelectorList>;

export type ImmutableStar = Immutable<Star>;
export type ImmutableClass = Immutable<Class>;
export type ImmutableId = Immutable<Id>;
export type ImmutableElement = Immutable<Element>;
export type ImmutableCombinator = Immutable<Combinator>;
export type ImmutableAttribute = Immutable<Attribute>;
export type ImmutablePseudoClass = Immutable<PseudoClass>;
export type ImmutablePseudoElement = Immutable<PseudoElement>;
export type ImmutableComment = Immutable<Comment>;
export type ImmutableNesting = Immutable<Nesting>;
export type ImmutableSelector = Immutable<Selector>;
export type ImmutableInvalid = Immutable<Invalid>;
export type ImmutableNth = Immutable<Nth>;
export type ImmutableNthStep = Immutable<NthStep>;
export type ImmutableNthDash = Immutable<NthDash>;
export type ImmutableNthOffset = Immutable<NthOffset>;
export type ImmutableNthOf = Immutable<NthOf>;
