import type {
  SelectorNode,
  SelectorList,
  Selector,
  FunctionalSelector,
  CompoundSelector,
  Comment,
  CommentWithNoSpacing,
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

export function groupCompoundSelectors<AST extends SelectorList | Selector>(
  input: AST,
  { splitPseudoElements = true }: { splitPseudoElements?: boolean } = {}
): AST extends SelectorList ? SelectorList : Selector {
  const output: SelectorList = [];
  let lastSelector: Selector;
  let lastCompound: CompoundSelector | undefined;
  // let lastTarget: Target;
  walk(input, (node, index, _nodes, parents) => {
    if (parents.length === 0) {
      // first level: create top level selector and initial grouped selector
      lastSelector = {
        type: `selector`,
        start: node.start,
        end: node.end,
        before: `before` in node ? node.before : ``,
        after: `after` in node ? node.after : ``,
        nodes: [],
      };
      output[index] = lastSelector;
      lastCompound = undefined;
    } else {
      // second level: (parents.length === 1)
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
        } else if (!lastCompound.invalid) {
          // validate selector
          lastCompound.invalid =
            node.type === `universal` || node.type === `type`;
        }
        lastCompound.nodes.push(node);
        lastCompound.end = node.end;
      } else if (
        // ToDo: spread
        node.type === `selector` ||
        node.type === `compound_selector` ||
        // ToDo: move out of compound
        node.type === `nth` ||
        node.type === `nth_step` ||
        node.type === `nth_dash` ||
        node.type === `nth_offset` ||
        node.type === `nth_of`
      ) {
        // ToDo: handle invalid nodes
      }
      // don't go deeper - shallow group
      return walk.skipNested;
    }
    return;
  });
  // ToDo: figure out type
  return `length` in input ? output : (output[0] as any);
}

function isCommentWithNoSpacing(node: Comment): node is CommentWithNoSpacing {
  return node.type === `comment` && node.before === `` && node.after === ``;
}
