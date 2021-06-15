import {
  tokenize,
  isStringDelimiter,
  isWhitespace,
  createToken,
  getJSCommentStartType,
  getMultilineCommentStartType,
  isCommentEnd,
  getUnclosedComment,
  isComment,
  getText,
  Seeker,
  last,
} from "toky";
import type { Token, Descriptors } from "toky";

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

export interface PseudoClass extends Token<"pseudo_class"> {
  nodes?: Selector[] | [Nth, ...SelectorList];
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

interface Namespace {
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
  | PseudoElement;

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
    const comments = s.takeMany("multi-comment").map(createCommentAst);
    const name = s.take("text");
    ast.push({
      type: "class",
      value: name?.value ?? "",
      start: token.start,
      end: name?.end ?? last(comments)?.end ?? token.end,
      dotComments: comments,
    });
  } else if (token.type === ":") {
    const firstComments = s.takeMany("multi-comment").map(createCommentAst);
    const type = s.take(":") || token;
    const isClass = token === type;

    if (isClass) {
      const name = s.take("text");
      const endToken = name || last(firstComments) || type;
      ast.push({
        type: "pseudo_class",
        value: name?.value ?? "",
        start: token.start,
        end: name?.end ?? endToken.end,
        colonComments: firstComments,
      });
    } else {
      const secondComments = s.takeMany("multi-comment").map(createCommentAst);
      const name = s.take("text");
      const endToken = name || last(secondComments) || type;

      ast.push({
        type: "pseudo_element",
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
    const closed = last(block)?.type === "]";
    if (closed) {
      ast.push({
        type: "attribute",
        value:
          block.length > 2 ? getText(block, 1, block.length - 1, source) : "",
        start: token.start,
        end: last(block)?.end ?? token.end,
      });
    } else {
      ast.push({
        type: "invalid",
        value: getText(block, undefined, undefined, source),
        start: token.start,
        end: last(block)?.end ?? token.end,
      });
    }
  } else if (isCombinatorToken(token)) {
    let lastCombinatorAst = createCombinatorAst(token);
    let lastAst: Combinator | Comment = lastCombinatorAst;
    // insert token as a combinator
    ast.push(lastCombinatorAst);
    // save the insertion point of the first combinator in case it's a space
    // that might be considered a normal space later and will need to be changed.
    let initialSpaceCombIndex: number =
      lastCombinatorAst.combinator === `space` ? ast.length - 1 : -1;
    /**
     * take next spaces/combinators/comments:
     * - combinator/space token:
     *  - spaces: merge to previous ast node before them
     *  - previous ast equal to space combinator
     *    - turn previous ast to the next combinator type
     *    - merge spaces between them
     *  - initial ast is space (must be comments following it)
     *    - initial space is first in selector: merge initial ast into the selector before
     *    - otherwise merge initial ast the comment following it
     *  - insert an invalid combinator
     * - comment token: insert to ast
     */
    //
    let next = s.next();
    while (next) {
      if (isCombinatorToken(next)) {
        if (next.type === `space`) {
          // add space to the last ast node
          lastAst.after += next.value;
          lastAst.end = next.end;
        } else if (
          lastAst === lastCombinatorAst &&
          lastAst.combinator === "space"
        ) {
          // combine next combinator into previous (space)
          const nextCombinator = createCombinatorAst(next);
          lastCombinatorAst.combinator = nextCombinator.combinator;
          lastCombinatorAst.before +=
            lastCombinatorAst.after +
            lastCombinatorAst.value +
            nextCombinator.before;
          lastCombinatorAst.after = nextCombinator.after;
          lastCombinatorAst.value = nextCombinator.value;
          lastCombinatorAst.end = nextCombinator.end;
        } else if (initialSpaceCombIndex !== -1) {
          // merge initial space combinator (classified as combinator before a comment)
          const initialSpace = ast[initialSpaceCombIndex] as Combinator;
          const spaceValue =
            initialSpace.before + initialSpace.value + initialSpace.after;
          if (initialSpaceCombIndex === 0) {
            // merge to beginning of selector
            currentSelector.before += spaceValue;
          } else {
            // merge to the next comment
            const nodeAfterInitial = ast[initialSpaceCombIndex + 1];
            if (nodeAfterInitial?.type === `comment`) {
              nodeAfterInitial.before += spaceValue;
              nodeAfterInitial.start = initialSpace.start;
            } else {
              // shouldn't happen as initial space is considered as a combinator
              // only when a comment is following it and before
            }
          }
          ast.splice(initialSpaceCombIndex, 1);
          initialSpaceCombIndex = -1;
          // add combinator
          lastCombinatorAst = createCombinatorAst(next);
          lastAst = lastCombinatorAst;
          ast.push(lastCombinatorAst);
        } else {
          // add invalid combinator
          lastCombinatorAst = createCombinatorAst(next);
          lastCombinatorAst.invalid = true;
          lastAst = lastCombinatorAst;
          ast.push(lastCombinatorAst);
        }
      } else if (isComment(next.type)) {
        lastAst = createCommentAst(next);
        ast.push(lastAst);
      } else {
        break;
      }
      next = s.next();
    }
    // put back any unrelated token
    if (next && !isCombinatorToken(next)) {
      s.back();
    }
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
    // search backwards compatible namespace in ast
    let prevAst: NamespacedNodes | undefined;
    let prevInvalidAst: SelectorNode | undefined;
    const beforeComments: Comment[] = [];
    for (let i = ast.length - 1; i >= 0; --i) {
      const current = ast[i];
      if (isNamespacedAst(current)) {
        if (current.namespace) {
          // already namespaced
          prevInvalidAst = current;
        } else {
          // merge with previous
          prevAst = current;
        }
        break;
      } else if (
        current.type === `comment` &&
        current.before === `` &&
        current.after === ``
      ) {
        beforeComments.unshift(current);
      } else {
        prevInvalidAst = current;
        break;
      }
    }
    // search forward target token
    let target: CSSSelectorToken | undefined;
    let searchIndex = 1;
    const potentialAfterComments: CSSSelectorToken[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const nextToken = s.peek(searchIndex);
      if (isComment(nextToken.type)) {
        potentialAfterComments.push(nextToken);
      } else if (isNamespacedToken(nextToken)) {
        target = nextToken;
        break;
      } else {
        // space or end of tokens
        break;
      }
      searchIndex++;
    }
    // create/update ast
    const validNamespace = !prevInvalidAst;
    const validTarget = !!target;
    const type = target?.type === `*` ? `star` : `element`;
    let invalid: NonNullable<Namespace["invalid"]> = ``;
    // remove before/after pipe comments
    if (validNamespace) {
      ast.splice(ast.length - beforeComments.length, beforeComments.length);
    } else {
      invalid = `namespace`;
    }
    if (validTarget) {
      potentialAfterComments.forEach(() => s.next());
      s.next();
    } else {
      invalid = invalid ? `namespace,target` : `target`;
    }
    // create new ast or modify the prev
    const nsAst: NamespacedNodes =
      prevAst ||
      ({
        type,
        value: ``,
        start: token.start,
        end: target?.end || token.end,
      } as NamespacedNodes);
    nsAst.type = type;
    nsAst.namespace = {
      value: prevAst?.value || ``,
      beforeComments: validNamespace ? beforeComments : [],
      afterComments: validTarget
        ? potentialAfterComments.map(createCommentAst)
        : [],
    };
    nsAst.value = target?.value || ``;
    nsAst.end = target?.end || token.end;
    // set invalid
    if (invalid) {
      nsAst.namespace.invalid = invalid;
    }
    // add ast if not modified
    if (!prevAst) {
      ast.push(nsAst);
    }
  } else if (token.type === "(") {
    const prev = last(ast);
    const res: SelectorList = [];
    // handle nth selector
    if (
      prev &&
      prev.type === `pseudo_class` &&
      NthHandler.isNthPseudoClass(prev.value) &&
      s.peek().type !== `)`
    ) {
      // collect "An+B of" expression
      const nthSelector = createEmptyNth();
      nthSelector.start = s.peek().start;
      res.push(nthSelector as unknown as Selector);
      const nthParser = new NthHandler(nthSelector, s);
      s.run(
        (token) => {
          if (nthParser.state === `selector`) {
            // got to selector, push back and stop
            s.back();
            return false;
          }
          return nthParser.handleToken(token);
        },
        nthSelector,
        source
      );
      // setup next selector
      if (s.peek().type !== `)`) {
        nthSelector.end = last(nthSelector.nodes)?.end || nthSelector.start;
        // add "of" selector
        const newSelector = createEmptySelector();
        newSelector.start = nthSelector.end;
        res.push(newSelector);
      }
    }
    // get all tokens until closed
    s.run(
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
      res,
      source
    );

    const ended = s.peek(0);
    if (
      !prev ||
      "nodes" in prev ||
      prev.type === "invalid" ||
      prev.type === "combinator" ||
      prev.type === "comment" ||
      prev.type === "nth_step" ||
      prev.type === "nth_dash" ||
      prev.type === "nth_offset" ||
      prev.type === "nth_of" ||
      ended.type !== ")"
    ) {
      ast.push({
        type: "invalid",
        value: getText([token, ended], undefined, undefined, source),
        start: token.start,
        end: ended?.end ?? s.peekBack().end,
      });
    } else {
      if (res.length) {
        const lastSelector = last(res);
        trimCombs(lastSelector);
      }
      prev.nodes = res;
      prev.end = ended.end;
    }
  } else if (isComment(token.type)) {
    ast.push(createCommentAst(token));
  } else if (token.type === ",") {
    const selector = last(selectors);
    selector.end = token.start;
    trimCombs(selector);
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
    trimCombs(currentSelector);
  }
}

class NthHandler {
  static isNthPseudoClass(name: string): boolean {
    return (
      name === `nth-child` ||
      name === `nth-last-child` ||
      name === `nth-of-type` ||
      name === `nth-last-of-type`
    );
  }
  /**
   * check (case insensitive) and returns 2 groups:
   * 1. plus/minus sign (invalid step value)
   * 2. odd/even string
   * [
   *  `+`|`-`|undefined,
   *  `odd`|`even`
   * ]
   */
  static oddEvenStep = /([-+]?)(odd|even)/i;
  /**
   * check for valid step
   * starts with optional minus or plus,
   * ends with 0 or more digits following a `n`/`N` character
   */
  static validStep = /^[-+]?\d*n$/i;
  /**
   * check for valid offset
   * starts with optional minus or plus,
   * ends with 1 or more digits
   */
  static validOffset = /^[-+]?\d+$/;
  /**
   * check for valid start of nth expression
   * and returns 2 groups:
   * 1. An: optional minus or plus, 0 or more digits, `n`/`N` character
   * 2. anything after that
   */
  static nthStartExp = /([-+]?\d*[nN]?)(.*)/;

  public state: "step" | `dash` | `offset` | `of` | `selector` = `step`;
  private standaloneDash = false;
  private ast: Nth["nodes"];
  constructor(private selectorNode: Nth, private s: Seeker<CSSSelectorToken>) {
    this.ast = selectorNode.nodes;
  }
  public handleToken(token: CSSSelectorToken): boolean {
    const type = token.type;
    if (type === `text` || type === `+`) {
      switch (this.state) {
        case `step`: {
          // pickup 1 or more tokens for `5n` / `+5n` / `+5n-4` / `5`
          const nextToken =
            type === `+` && this.s.peek().type === `text`
              ? this.s.next()
              : undefined;
          this.breakFirstChunk({
            type: `text`,
            value: token.value + (nextToken?.value || ``),
            start: token.start,
            end: nextToken?.end || token.end,
          });
          return true;
        }
        case `dash`: {
          const nextToken =
            type === `+` && this.s.peek().type === `text`
              ? this.s.next()
              : undefined;
          this.pushDash({
            type: `text`,
            value: token.value + (nextToken?.value || ``),
            start: token.start,
            end: nextToken?.end || token.end,
          });
          return true;
        }
        case `offset`: {
          const nextToken =
            type === `+` && this.s.peek().type === `text`
              ? this.s.next()
              : undefined;
          this.pushOffset({
            type: `text`,
            value: token.value + (nextToken?.value || ``),
            start: token.start,
            end: nextToken?.end || token.end,
          });
          return true;
        }
        case `of`: {
          this.pushOf(token);
          return false;
        }
      }
    } else if (type === `space`) {
      // improve typing
      const lastNode = last(this.ast);
      if (lastNode) {
        lastNode.after += token.value;
        lastNode.end += token.value.length;
      } else {
        // add initial space to top selector
        this.selectorNode.before += token.value;
      }
      return true;
    } else if (isComment(type)) {
      this.ast.push(createCommentAst(token));
      return true;
    }
    // not part of `An+b of`: bail out
    this.s.back();
    return false;
  }
  /**
   * first token can only be (minus contained in text):
   * step: `5n`/`+5n`/`-5n`
   * step & offset: `5n`/`5n-5
   */
  private breakFirstChunk(token: CSSSelectorToken) {
    const value = token.value;
    // find odd/even
    const oddEventMatch = value.match(NthHandler.oddEvenStep);
    if (oddEventMatch) {
      const isInvalid = !!oddEventMatch[1];
      this.pushStep(token, isInvalid);
      return;
    }
    // separate valid step start from rest: `-5n-4` / `-5n` / `-4` / `5n-4`
    const matchValidStart = value.match(NthHandler.nthStartExp);
    if (!matchValidStart) {
      // invalid step
      this.pushStep(token);
    } else {
      const step = matchValidStart[1];
      const offset = matchValidStart[2];
      if (
        !offset &&
        !step.match(/[nN]+$/) &&
        step.match(NthHandler.validOffset)
      ) {
        // no `n` - just offset
        this.pushOffset(token);
      } else if (offset === `-`) {
        // connected dash: `5n-`
        this.pushStep({
          type: `text`,
          value: step,
          start: token.start,
          end: token.start + step.length,
        });
        this.pushDash({
          type: `text`,
          value: `-`,
          start: token.end - 1,
          end: token.end,
        });
      } else if (offset && !offset.match(/-\d+/)) {
        // invalid step: `-3x`
        this.pushStep(token);
      } else {
        // step with potential minus offset: `5n-4`
        this.pushStep({
          type: `text`,
          value: step,
          start: token.start,
          end: token.start + step.length,
        });
        if (offset) {
          this.pushOffset({
            type: `text`,
            value: offset,
            start: token.end - offset.length,
            end: token.end,
          });
        }
      }
    }
  }
  private pushStep(token: CSSSelectorToken, isInvalid?: boolean) {
    const value = token.value;
    const stepNode: NthStep = {
      type: `nth_step`,
      value,
      before: ``,
      after: ``,
      start: token.start,
      end: token.end,
    };
    isInvalid =
      isInvalid !== undefined ? isInvalid : !value.match(NthHandler.validStep);
    if (isInvalid) {
      stepNode.invalid = true;
    }
    this.state = `dash`;
    this.ast.push(stepNode);
  }
  private pushDash(token: CSSSelectorToken) {
    const value = token.value;
    if (value === `+` || value === `-`) {
      this.ast.push({
        type: `nth_dash`,
        value: token.value,
        start: token.start,
        end: token.end,
        before: ``,
        after: ``,
      });
      this.standaloneDash = true;
      this.state = `offset`;
    } else {
      this.pushOffset(token);
    }
  }
  private pushOffset(token: CSSSelectorToken) {
    if (token.value === `of`) {
      this.pushOf(token);
    } else {
      const value = token.value;
      const offsetNode: NthOffset = {
        type: `nth_offset`,
        value,
        before: ``,
        after: ``,
        start: token.start,
        end: token.end,
      };
      if (
        !value.match(NthHandler.validOffset) ||
        (this.standaloneDash && value.match(/^[-+]/))
      ) {
        offsetNode.invalid = true;
      }
      this.state = `of`;
      this.ast.push(offsetNode);
    }
  }
  private pushOf(token: CSSSelectorToken) {
    const ofNode: NthOf = {
      type: `nth_of`,
      value: token.value,
      before: ``,
      after: ``,
      start: token.start,
      end: token.end,
    };
    if (token.value !== `of`) {
      ofNode.invalid = true;
    }
    this.ast.push(ofNode);
    this.state = `selector`;
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
function createEmptyNth(): Nth {
  return {
    type: "nth",
    start: -1,
    end: -1,
    before: "",
    after: "",
    nodes: [],
  };
}
function createCombinatorAst({
  value,
  type,
  start,
  end,
}: CSSSelectorToken & Token<"space" | "+" | ">" | "~">): Combinator {
  return {
    type: `combinator`,
    combinator: type,
    value: type === `space` ? ` ` : value,
    start,
    end,
    before: ``,
    after: type === `space` ? value.slice(1) : ``,
    invalid: false,
  };
}
function createCommentAst({ value, start, end }: CSSSelectorToken): Comment {
  return {
    type: `comment`,
    value,
    start,
    end,
    before: ``,
    after: ``,
  };
}

function trimCombs(selector: Selector) {
  // costly way to turn combinators to before and after.
  // this can be inlined in the handle token process
  const nodes = selector.nodes;
  const firstNode = nodes[0];
  const lastNode = last(nodes);
  // remove first space combinator and add to selector before
  // (going between comment is not required for the start becuase they are taken care
  // of during parsing)
  if (firstNode?.type === "combinator" && firstNode.combinator === "space") {
    selector.nodes.shift();
    selector.before += firstNode.before + firstNode.value + firstNode.after;
  }
  // remove any edge space combinators (last and between comments)
  if (lastNode !== firstNode) {
    let index = nodes.length - 1;
    let current = lastNode;
    let lastComment: Comment | undefined;
    while (
      (current && current.type === `comment`) ||
      (current.type === `combinator` && current.combinator === `space`)
    ) {
      if (current.type === `combinator`) {
        if (!lastComment) {
          // attach space to end of selector
          selector.nodes.pop();
          selector.after += current.before + current.value + current.after;
        } else {
          // attach space to start of comment
          selector.nodes.splice(index, 1);
          lastComment.before += current.before + current.value + current.after;
          lastComment.start = current.start;
        }
      } else {
        lastComment = current;
      }
      current = nodes[--index];
    }
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

function isNamespacedToken(
  token: CSSSelectorToken
): token is Token<"text" | "*"> {
  return token.type === `*` || token.type === `text`;
}
function isNamespacedAst(token: SelectorNode): token is NamespacedNodes {
  return token.type === `star` || token.type === `element`;
}

export function traverse(
  node: SelectorNode,
  visit: (node: SelectorNode, ctx: {}) => boolean | void,
  ctx?: {}
) {
  ctx = ctx || {};
  const r = visit(node, ctx) ?? 3;
  if (r !== false && "nodes" in node && node.nodes) {
    for (const child of node.nodes) {
      traverse(child, visit, ctx);
    }
  }
}

type R = { [K in SelectorNode as K["type"]]: (node: K) => string };

export const printers: R = {
  id: (node: Id) => `#${node.value}${stringifyNested(node)}`,
  class: (node: Class) =>
    `.${node.dotComments.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  element: (node: Element) =>
    `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
  combinator: (node: Combinator) => `${node.before}${node.value}${node.after}`,
  attribute: (node: Attribute) => `[${node.value}]${stringifyNested(node)}`,
  pseudo_class: (node: PseudoClass) =>
    `:${node.colonComments.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  pseudo_element: (node: PseudoElement) =>
    `:${node.colonComments.first
      .map(stringifyNode)
      .join("")}:${node.colonComments.second.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  comment: ({ before, value, after }: Comment) => `${before}${value}${after}`,
  star: (node: Star) =>
    `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
  selector: (node: Selector) =>
    `${node.before}${node.nodes.map(stringifyNode).join("")}${node.after}`,
  invalid: (node: Invalid) => node.value,
  nth: (node: Nth) =>
    `${node.before}${node.nodes.map(stringifyNode).join("")}${node.after}`,
  nth_step: ({ before, value, after }: NthStep) => `${before}${value}${after}`,
  nth_dash: ({ before, value, after }: NthDash) => `${before}${value}${after}`,
  nth_offset: ({ before, value, after }: NthOffset) =>
    `${before}${value}${after}`,
  nth_of: ({ before, value, after }: NthOf) => `${before}${value}${after}`,
};

export function stringifyNode(node: SelectorNode): string {
  return printers[node.type]?.(node as never) ?? "";
}

export function stringifySelectors(
  selectors: SelectorList | [Nth, ...SelectorList]
) {
  const result: string[] = [];
  for (const node of selectors) {
    result.push(stringifyNode(node));
  }
  return result.join(`,`);
}

function stringifyNested(node: Containers): string {
  if ("nodes" in node) {
    if (node.nodes?.length) {
      const isNth =
        node.type === `pseudo_class` && NthHandler.isNthPseudoClass(node.value);
      const nthExpr = isNth ? stringifyNode(node.nodes.shift()!) : ``;
      return `(${nthExpr}${stringifySelectors(node.nodes)})`;
    } else {
      return `()`;
    }
  }
  return "";
}
function stringifyNamespace({ namespace }: NamespacedNodes): string {
  let ns = ``;
  if (namespace) {
    ns += namespace.value;
    for (const comment of namespace.beforeComments) {
      ns += printers.comment(comment);
    }
    ns += `|`;
    for (const comment of namespace.afterComments) {
      ns += printers.comment(comment);
    }
  }
  return ns;
}

// import { tokenize as ptokenize } from "https://projects.verou.me/parsel/parsel.js";
// setTimeout(() => {
//   const inp = `#foo > .bar + div.k1.k2 [id='baz']:hello(2):not(:where(#yolo))::before`;

//   var i = 10000;
//   console.time("S1");
//   while (i--) {
//     ptokenize(inp);
//   }
//   console.timeEnd("S1");

//   var i = 10000;
//   console.time("S0");
//   while (i--) {
//     tokenizeSelector(inp);
//   }
//   console.timeEnd("S0");
// }, 1000);

// setTimeout(() => {
//   const inp = `#foo > .bar + div.k1.k2 [id='baz']:hello(2):not(:where(#yolo))::before`;
//   const s = tokenizeSelector(inp)[0];
//   var i = 10000;
//   console.time("S0");
//   while (i--) {
//     stringifyNode(s);
//   }
//   console.timeEnd("S0");
//   var i = 10000;
//   console.time("S1");
//   while (i--) {
//     stringifyNode2(s);
//   }
//   console.timeEnd("S1");
// }, 1000);

// const s = r[0];
// console.time("1");
// stringifyNode(s);
// stringifyNode(s);
// stringifyNode(s);
// stringifyNode(s);
// const rx1 = stringifyNode(s);
// console.timeEnd("1");
// console.time("2");
// stringifyNode2(s);
// stringifyNode2(s);
// stringifyNode2(s);
// stringifyNode2(s);
// const rx2 = stringifyNode2(s);
// console.timeEnd("2");

// console.log("match", rx1 === inp && rx2 === inp);
// console.log("rx1", rx1);
// console.log("rx2", rx2);
