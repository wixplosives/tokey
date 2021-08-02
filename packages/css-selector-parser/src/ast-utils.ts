import type {
  SelectorNode,
  SelectorList,
  Selector,
  FunctionalSelector,
  CompoundSelector,
  Comment,
  CommentWithNoSpacing,
  ImmutableSelector,
  ImmutableSelectorList,
} from "./ast-types";

export interface WalkOptions {
  visitList?: SelectorNode["type"][];
  ignoreList?: SelectorNode["type"][];
}
const nestEnd = Symbol(`nest-end`);

/**
 * traverse each node of the selector AST from start to end.
 * to control traversal return:
 *  walk.skipNested
 *  walk.skipCurrentSelector
 *  walk.stopAll
 *
 * @param topNode the top AST to traverse down from
 * @param visit function to call for each traversed element
 * @param options provide visitList/ignoreList for traversal
 */
export function walk(
  topNode: SelectorNode | SelectorList,
  visit: (
    node: SelectorNode,
    index: number,
    nodes: SelectorNode[],
    parents: SelectorNode[]
  ) => number | undefined | void,
  options: WalkOptions = {}
): void {
  // set initial top nodes to traverse
  const toVisit: Array<SelectorNode | typeof nestEnd> = Array.isArray(topNode)
    ? [...topNode]
    : [topNode];
  // initiate context
  const context = createWalkContext(topNode);
  // iterate nodes
  while (toVisit.length) {
    const current = toVisit.shift()!;
    if (current === nestEnd) {
      // end of nested level
      context.up();
      continue;
    } else if (
      (!options.ignoreList || !options.ignoreList.includes(current.type)) &&
      (!options.visitList || options.visitList.includes(current.type))
    ) {
      // visit node
      let skipAmount =
        (visit(
          current,
          context.indexInSelector,
          context.nodesInSelector,
          context.parents
        ) as number) ?? -1;
      // point to next selector node
      context.next();
      // check if to skip nested or current/following selectors
      if (skipAmount === Infinity) {
        // stop all: fast bail out
        return;
      } else if (skipAmount >= 0) {
        // skip levels
        while (skipAmount > 0 && toVisit.length) {
          const next = toVisit.shift()!;
          if (next === nestEnd) {
            skipAmount--;
            context.up();
          }
        }
        continue;
      }
    }
    // add nested nodes
    if (isWithNodes(current)) {
      context.insertNested(current);
      toVisit.unshift(...current.nodes, nestEnd);
    }
  }
}

interface WalkContext {
  parents: SelectorNode[];
  indexInSelector: number;
  nodesInSelector: SelectorNode[];
  up(): void;
  next(): void;
  insertNested(node: ContainerWithNodes): void;
}
function createWalkContext(topNode: SelectorNode | SelectorList) {
  const prevIndex: number[] = [];
  const prevParents: SelectorNode[][] = [[]];
  const context: WalkContext = {
    parents: [],
    indexInSelector: 0,
    nodesInSelector: Array.isArray(topNode)
      ? topNode
      : `nodes` in topNode
      ? topNode.nodes!
      : [topNode],
    up() {
      context.parents.pop();
      context.indexInSelector = prevIndex.shift()!;
      const currentParents = context.parents;
      const currentParent = currentParents[currentParents.length - 1];
      context.nodesInSelector = currentParent
        ? (currentParent as any).nodes
        : topNode;
    },
    next() {
      context.indexInSelector++;
    },
    insertNested(node) {
      context.parents = [...context.parents, node];
      prevParents.push(context.parents);
      prevIndex.unshift(context.indexInSelector);
      context.indexInSelector = 0;
      context.nodesInSelector = node.nodes;
    },
  };
  return context;
}

walk.skipNested = 0 as const;
walk.skipCurrentSelector = 1 as const;
walk.stopAll = Infinity;

type ContainerWithNodes = FunctionalSelector & { nodes: SelectorNode[] };
function isWithNodes(node: any): node is ContainerWithNodes {
  return node && `nodes` in node;
}

export interface GroupCompoundOptions {
  splitPseudoElements?: boolean;
}
export function groupCompoundSelectors<AST extends Selector>(
  input: AST,
  options?: GroupCompoundOptions
): Selector;
export function groupCompoundSelectors<AST extends ImmutableSelector>(
  input: AST,
  options?: GroupCompoundOptions
): ImmutableSelector;
export function groupCompoundSelectors<AST extends SelectorList>(
  input: AST,
  options?: GroupCompoundOptions
): SelectorList;
export function groupCompoundSelectors<AST extends ImmutableSelectorList>(
  input: AST,
  options?: GroupCompoundOptions
): ImmutableSelectorList;
export function groupCompoundSelectors<AST>(
  input: AST,
  options?: GroupCompoundOptions
): Selector | SelectorList | ImmutableSelector | ImmutableSelectorList {
  const context = createCompoundContext(options);
  // ToDo: remove type as selector when walk add readonly support
  walk(input as any as Selector, (node, _index, _nodes, parents) => {
    if (parents.length === 0 && node.type === `selector`) {
      // first level: create top level selector and initial grouped selector
      context.addSelector(node);
    } else {
      // second level: (parents.length === 1)
      context.handleNode(node);
      // don't go deeper - shallow group
      return walk.skipNested;
    }
    return;
  });
  return `length` in input ? context.output : context.output[0];
}
function createCompoundContext({
  splitPseudoElements = true,
}: GroupCompoundOptions = {}) {
  const output: SelectorList = [];
  let lastSelector: Selector;
  let lastCompound: CompoundSelector | undefined;
  let lastCompoundInitialPart: CompoundSelector["nodes"][number] | undefined;
  const handleNode = (node: SelectorNode) => {
    if (node.type === `pseudo_element` && splitPseudoElements === true) {
      lastCompound = undefined;
    }
    if (node.type === `combinator`) {
      lastSelector.nodes.push(node);
      lastCompound = undefined;
    } else if (node.type === `comment` && !isCommentWithNoSpacing(node)) {
      // comments that break compound
      lastSelector.nodes.push(node);
      lastCompound = undefined;
    } else if (
      node.type === `type` ||
      node.type === `universal` ||
      node.type === `class` ||
      node.type === `id` ||
      node.type === `attribute` ||
      node.type === `nesting` ||
      node.type === `pseudo_class` ||
      node.type === `pseudo_element` ||
      node.type === `invalid` ||
      node.type === `comment` /*no spacing*/
    ) {
      // part of compound
      if (!lastCompound) {
        // add new compound selector
        lastCompoundInitialPart = undefined;
        lastCompound = {
          type: `compound_selector`,
          start: node.start,
          end: node.end,
          before: ``,
          after: ``,
          nodes: [],
          invalid: false,
        };
        lastSelector.nodes.push(lastCompound);
      }
      if (!lastCompound.invalid && node.type !== `comment`) {
        // validate compound parts after initial
        if (lastCompoundInitialPart) {
          lastCompound.invalid =
            node.type === `universal` || node.type === `type`;
        }
        lastCompoundInitialPart = node;
      }
      lastCompound.nodes.push(node);
      lastCompound.end = node.end;
    } else if (node.type === `selector` || node.type === `compound_selector`) {
      // spread
      for (const innerNode of node.nodes) {
        handleNode(innerNode);
      }
    } else if (
      node.type === `nth` ||
      node.type === `nth_step` ||
      node.type === `nth_dash` ||
      node.type === `nth_offset` ||
      node.type === `nth_of`
    ) {
      // handle out of context nodes
      lastSelector.nodes.push(node);
      lastCompound = undefined;
    }
  };
  return {
    addSelector(node: Selector) {
      lastSelector = {
        type: `selector`,
        start: node.start,
        end: node.end,
        before: `before` in node ? node.before : ``,
        after: `after` in node ? node.after : ``,
        nodes: [],
      };
      output.push(lastSelector);
      lastCompound = undefined;
    },
    handleNode,
    output,
  };
}

function isCommentWithNoSpacing(node: Comment): node is CommentWithNoSpacing {
  return node.type === `comment` && node.before === `` && node.after === ``;
}
