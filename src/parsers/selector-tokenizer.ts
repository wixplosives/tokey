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

export interface SelectorNode
  extends Token<
    | "class"
    | "id"
    | "combinator"
    | "element"
    | "attribute"
    | "pseudo-class"
    | "pseudo-element"
    | "star"
    | "invalid"
  > {}

export interface Invalid extends SelectorNode {
  type: "invalid";
}

export interface PseudoClass extends SelectorNode {
  type: "pseudo-class";
  subTree?: SelectorAst;
}

export interface PseudoElement extends SelectorNode {
  type: "pseudo-element";
  subTree?: SelectorAst;
}

export interface Class extends SelectorNode {
  type: "class";
  subTree?: SelectorAst;
}

export interface Id extends SelectorNode {
  type: "id";
  subTree?: SelectorAst;
}

export interface Combinator extends SelectorNode {
  type: "combinator";
  combinator: "space" | "+" | "~" | ">";
  before: string;
  after: string;
}

export interface Element extends SelectorNode {
  type: "element";
  namespace?: string;
  subTree?: SelectorAst;
}

export interface Star extends SelectorNode {
  type: "star";
  namespace?: string;
  subTree?: SelectorAst;
}

export interface Attribute extends SelectorNode {
  type: "attribute";
  value: string;
  // left: string;
  // right: string;
  // op: "" | "=" | "~=" | "|=" | "^=" | "$=" | "*=";
  // quotes: "'" | '"';
  subTree?: SelectorAst;
}

type AnySelectorNode =
  | Combinator
  | Attribute
  | Element
  | Star
  | Id
  | Class
  | PseudoClass
  | PseudoElement
  | Invalid;

type SelectorAst = AnySelectorNode[];

function parseTokens(source: string, tokens: CSSSelectorToken[]): SelectorAst {
  return new Seeker(tokens).run<SelectorAst>(handleToken, [], source);
}

function handleToken(
  token: CSSSelectorToken,
  ast: SelectorAst,
  source: string,
  s: Seeker<CSSSelectorToken>
) {
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
      end: name?.end ?? type[type.length - 1].end,
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
      end: block[block.length - 1]?.end ?? token.end,
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
    const prev = ast[ast.length - 1];
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
    const res = s.run<SelectorAst>(
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

    const prev = ast[ast.length - 1];
    const ended = s.peek(0);
    if (
      !prev ||
      "subTree" in prev ||
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
      prev.subTree = res;
      prev.end = ended.end;
    }
  } else if (isComment(token.type)) {
  } else {
    ast.push({
      type: "invalid",
      value: token.value,
      start: token.start,
      end: token.end,
    });
  }
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
