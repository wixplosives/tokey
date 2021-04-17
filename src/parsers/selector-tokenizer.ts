import { tokenize } from "../core";
import {
  isStringDelimiter,
  isWhitespace,
  createToken,
  getJSCommentStartType,
  getMultilineCommentStartType,
  isCommentEnd,
  getUnclosedComment,
  isComment,
  getText,
  last,
} from "../helpers";
import { Seeker } from "../seeker";
import type { Token, Descriptors } from "../types";

type Delimiters =
  | "["
  | "]"
  | "("
  | ")"
  | ","
  | "*"
  | "|"
  | ":"
  | "."
  | "#"
  | ">"
  | "~"
  | "+"
  | "{"
  | "}";

export type CSSSelectorToken = Token<Descriptors | Delimiters>;

export interface Selector extends Omit<Token<"selector">, "value"> {
  nodes: SelectorNodes;
  before: string;
  after: string;
}

export interface PseudoClass extends Token<"pseudo-class"> {
  nodes?: SelectorNodes;
  colonComments: Comment[];
}

export interface PseudoElement extends Token<"pseudo-element"> {
  nodes?: SelectorNodes;
  colonComments: { first: Comment[]; second: Comment[] };
}

export interface Class extends Token<"class"> {
  nodes?: SelectorNodes;
  dotComments: SelectorNodes;
}

export interface Id extends Token<"id"> {
  nodes?: SelectorNodes;
}

export interface Attribute extends Token<"attribute"> {
  value: string;
  // left: string;
  // right: string;
  // op: "" | "=" | "~=" | "|=" | "^=" | "$=" | "*=";
  // quotes: "'" | '"' | "";
  nodes?: SelectorNodes;
}
export interface Element extends Token<"element"> {
  namespace?: string;
  nodes?: SelectorNodes;
}

export interface Star extends Token<"star"> {
  namespace?: string;
  nodes?: SelectorNodes;
}

export interface Combinator extends Token<"combinator"> {
  combinator: "space" | "+" | "~" | ">";
  before: string;
  after: string;
}

export interface Invalid extends Token<"invalid"> {}
export interface Comment extends Token<"comment"> {}

export type NamespacedNodes = Element | Star;

export type Containers =
  | NamespacedNodes
  | Selector
  | Attribute
  | Id
  | Class
  | PseudoClass
  | PseudoElement;

export type SelectorNode = Containers | Combinator | Comment | Invalid;
export type SelectorNodes = SelectorNode[];
export type SelectorList = Selector[];

export function tokenizeSelector(source: string, parseLineComments = false) {
  return parseTokens(
    source,
    tokenize<CSSSelectorToken>(source, {
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
    })
  );
}

function parseTokens(source: string, tokens: CSSSelectorToken[]): SelectorList {
  return new Seeker(tokens).run<SelectorList>(handleToken, [], source);
}

const isDelimiter = (char: string) =>
  char === "[" ||
  char === "]" ||
  char === "(" ||
  char === ")" ||
  char === "," ||
  char === "*" ||
  char === "|" ||
  char === ":" ||
  char === "." ||
  char === "#" ||
  char === ">" ||
  char === "~" ||
  char === "+" ||
  char === "{" ||
  char === "}";

// TODO: handle more comments!

function handleToken(
  token: CSSSelectorToken,
  selectors: SelectorList,
  source: string,
  s: Seeker<CSSSelectorToken>
): void {
  let t;
  const currentSelector = ensureSelector(selectors, token);
  const ast = currentSelector.nodes;
  if (token.type === ".") {
    const comments = s.takeMany("multi-comment").map(toComment);
    const name = s.take("text");
    ast.push({
      type: "class",
      value: name?.value ?? "",
      start: token.start,
      end: name?.end ?? last(comments)?.end ?? token.end,
      dotComments: comments,
    });
  } else if (token.type === ":") {
    const firstComments = s.takeMany("multi-comment").map(toComment);
    const type = s.take(":") || token;
    const isClass = token === type;

    if (isClass) {
      const name = s.take("text");
      const endToken = name || last(firstComments) || type;
      ast.push({
        type: "pseudo-class",
        value: name?.value ?? "",
        start: token.start,
        end: name?.end ?? endToken.end,
        colonComments: firstComments,
      });
    } else {
      const secondComments = s.takeMany("multi-comment").map(toComment);
      const name = s.take("text");
      const endToken = name || last(secondComments) || type;

      ast.push({
        type: "pseudo-element",
        value: name?.value ?? "",
        start: token.start,
        end: name?.end ?? endToken.end,
        colonComments: { first: firstComments, second: secondComments },
      });
    }
  } else if (token.type === "[") {
    const block = s.run(
      (token, ast) => {
        ast.push(token);
        return token.type !== "]";
      },
      [token],
      source
    );

    ast.push({
      type: "attribute",
      value: getText(block, undefined, undefined, source),
      start: token.start,
      end: last(block)?.end ?? token.end,
      // left: "TODO",
      // right: "TODO",
      // op: "",
      // quotes: "'",
    });
  } else if (isCombinatorToken(token)) {
    // TODO: handle comments here!
    t = s.next();
    let before;
    let after;
    let current = token;
    if (current.type === "space" && isCombinatorToken(t)) {
      before = current;
      current = t;
      t = s.next();
      if (t.type === "space") {
        after = t;
      } else {
        s.back();
      }
    } else {
      s.back();
    }

    ast.push({
      type: "combinator",
      combinator: current.type,
      value: current.type === "space" ? current.value.slice(-1) : current.value,
      start: before?.start ?? current.start,
      end: after?.end ?? current.end,
      before:
        (before?.value ?? "") + current.type === "space"
          ? current.value.slice(0, -1)
          : "",
      after: after?.value ?? "",
    });
  } else if (token.type === "text") {
    ast.push({
      type: "element",
      value: token.value,
      start: token.start,
      end: token.end,
    });
  } else if (token.type === "#") {
    t = s.take("text");
    ast.push({
      type: "id",
      value: t?.value ?? "",
      start: token.start,
      end: t?.end ?? token.end,
    });
  } else if (token.type === "*") {
    ast.push({
      type: "star",
      value: "*",
      start: token.start,
      end: token.end,
    });
  } else if (token.type === "|") {
    let name;
    const prev = last(ast);
    t = s.next();
    if (t.type === "text") {
      name = t;
    } else {
      s.back();
    }
    if (name && (prev?.type === "element" || prev?.type === "star")) {
      prev.namespace = name.value;
      prev.end = name.end;
    } else {
      ast.push({
        type: "invalid",
        value: token.value + (name?.value ?? ""),
        start: token.start,
        end: name?.end ?? token.end,
      });
    }
  } else if (token.type === "(") {
    const res = s.run<SelectorList>(
      (token, selectors) => {
        if (token.type === ")") {
          const currentSelector = last(selectors);
          if (currentSelector) {
            currentSelector.end =
              last(currentSelector.nodes)?.end ?? currentSelector.start;
          }
          return false;
        }
        return handleToken(token, selectors, source, s);
      },
      [],
      source
    );

    const prev = last(ast);
    const ended = s.peek(0);
    if (
      !prev ||
      "nodes" in prev ||
      prev.type === "invalid" ||
      prev.type === "combinator" ||
      prev.type === "comment" ||
      ended.type !== ")"
    ) {
      ast.push({
        type: "invalid",
        value: getText([token, ended], undefined, undefined, source),
        start: token.start,
        end: ended?.end ?? s.peekBack().end,
      });
    } else {
      prev.nodes = res.map((s) => Object.assign(s, trimCombs(s.nodes)));
      prev.end = ended.end;
    }
  } else if (isComment(token.type)) {
    ast.push({
      type: "comment",
      value: token.value,
      start: token.start,
      end: token.end,
    });
  } else if (token.type === ",") {
    const selector = last(selectors);
    selector.end = token.start;
    Object.assign(selector, trimCombs(selector.nodes));
    const newSelector = createEmptySelector();
    if (s.done()) {
      newSelector.start = token.end;
      newSelector.end = token.end;
    } else {
      newSelector.start = s.peek().start;
    }
    selectors.push(newSelector);
  } else {
    ast.push({
      type: "invalid",
      value: token.value,
      start: token.start,
      end: token.end,
    });
  }
  if (s.done()) {
    currentSelector.end =
      last(currentSelector.nodes)?.end ?? currentSelector.start;
    Object.assign(currentSelector, trimCombs(currentSelector.nodes));
  }
}

function ensureSelector(selectors: SelectorList, startToken: CSSSelectorToken) {
  let lastSelector = last(selectors);
  if (!lastSelector) {
    lastSelector = createEmptySelector();
    lastSelector.start = startToken.start;
    selectors.push(lastSelector);
  }
  return lastSelector;
}

function toComment(token: CSSSelectorToken) {
  return { ...token, type: "comment" as const };
}
function createEmptySelector(): Selector {
  return {
    type: "selector",
    start: -1,
    end: -1,
    before: "",
    after: "",
    nodes: [],
  };
}

function trimCombs(nodes: SelectorNodes) {
  // costly way to turn combinators to before and after.
  // this can be inlined in the handle token process
  const firstNode = nodes[0];
  const lastNode = last(nodes);
  let before = "";
  let after = "";
  let start = 0;
  let end = nodes.length;
  if (firstNode?.type === "combinator" && firstNode.combinator === "space") {
    start = 1;
    before = firstNode.before + firstNode.value + firstNode.after;
  }
  if (
    lastNode !== firstNode &&
    lastNode?.type === "combinator" &&
    lastNode.combinator === "space"
  ) {
    end = -1;
    after = lastNode.before + lastNode.value + lastNode.after;
  }
  return {
    nodes:
      start === 0 && end === nodes.length ? nodes : nodes.slice(start, end),
    before,
    after,
  };
}

const shouldAddToken = () => true;

function isCombinatorToken(
  token: CSSSelectorToken
): token is Token<"space" | "+" | ">" | "~"> {
  return (
    token.type === "space" ||
    token.type === "+" ||
    token.type === ">" ||
    token.type === "~"
  );
}

interface TraverseContext {}

export function traverse(
  node: SelectorNode,
  visit: (node: SelectorNode, ctx: TraverseContext) => boolean | void,
  ctx?: TraverseContext
) {
  ctx = ctx || {};
  const r = visit(node, ctx) ?? 3;
  if (r !== false && "nodes" in node && node.nodes) {
    for (const child of node.nodes) {
      traverse(child, visit, ctx);
    }
  }
}

export function stringify(node: SelectorNode) {
  /* TODO */ node;
}
