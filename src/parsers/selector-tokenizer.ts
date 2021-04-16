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

export type CSSSelectorToken = Token<Descriptors | Delimiters>;

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

export interface Selector extends Omit<Token<"selector">, "value"> {
  nodes: SelectorNodes;
  before: string;
  after: string;
}

export interface PseudoClass extends Token<"pseudo-class"> {
  nodes?: SelectorNodes;
}

export interface PseudoElement extends Token<"pseudo-element"> {
  nodes?: SelectorNodes;
}

export interface Class extends Token<"class"> {
  nodes?: SelectorNodes;
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

export type NamespacedNodes = Element | Star;

export type Containers =
  | NamespacedNodes
  | Attribute
  | Id
  | Class
  | PseudoClass
  | PseudoElement;

export type SelectorNode = Containers | Combinator | Invalid;
export type SelectorNodes = SelectorNode[];
export type SelectorList = Selector[];

function parseTokens(source: string, tokens: CSSSelectorToken[]): SelectorList {
  let nodes: SelectorNodes = [];
  return new Seeker(tokens).run<SelectorList>(
    (token, selectors, source, s) => {
      if (token.type === ",") {
        selectors.push(createSelector(nodes, s.peekBack()));
        nodes = [];
      } else {
        handleToken(token, nodes, source, s);
      }
      if (s.done()) {
        selectors.push(createSelector(nodes, s.peek(0)));
      }
    },
    [],
    source
  );
}

function handleToken(
  token: CSSSelectorToken,
  ast: SelectorNodes,
  source: string,
  s: Seeker<CSSSelectorToken>
): void {
  let t;
  if (token.type === ".") {
    t = s.take("text");
    ast.push({
      type: "class",
      value: t?.value ?? "",
      start: token.start,
      end: t?.end ?? token.end,
    });
  } else if (token.type === ":") {
    let name;
    let type = [token];

    t = s.next();
    if (t.type === ":") {
      type.push(t);
      t = s.next();
    }

    if (t.type === "text") {
      name = t;
    } else {
      s.back();
    }

    ast.push({
      type: type.length === 1 ? "pseudo-class" : "pseudo-element",
      value: name?.value ?? "",
      start: type[0].start,
      end: name?.end ?? last(type).end,
    });
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
    // TODO: handle two combinator one after the other

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
    const res = s.run<SelectorNodes>(
      (token, ast) => {
        if (token.type === ")") {
          return false;
        }
        return handleToken(token, ast, source, s);
      },
      [],
      source
    );

    //TODO: if last or first is space combinator remove and add before and after

    const prev = last(ast);
    const ended = s.peek(0);
    if (
      !prev ||
      "nodes" in prev ||
      prev.type === "invalid" ||
      prev.type === "combinator" ||
      s.peek(0).type !== ")"
    ) {
      ast.push({
        type: "invalid",
        value: getText([token, ended], undefined, undefined, source),
        start: token.start,
        end: ended?.end ?? s.peekBack().end,
      });
    } else {
      prev.nodes = res;
      prev.end = ended.end;
    }
  } else if (isComment(token.type)) {
  } else if (token.type === ",") {
  } else {
    ast.push({
      type: "invalid",
      value: token.value,
      start: token.start,
      end: token.end,
    });
  }
}

function createSelector(
  initialNodes: SelectorNodes,
  endToken: CSSSelectorToken
): Selector {
  const { before, after, nodes } = trimCombs(initialNodes);
  return {
    type: "selector",
    start: initialNodes[0]?.start ?? endToken.end,
    end: last(initialNodes)?.end ?? endToken.end,
    before,
    after,
    nodes: nodes,
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
