import type {
  SelectorNode,
  SelectorList,
  Selector,
  CompoundSelector,
  Comment,
  CommentWithNoSpacing,
  ImmutableSelector,
  ImmutableSelectorList,
} from "../ast-types";
import { walk } from "./walk";

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
    } else {
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

export function splitCompoundSelectors<AST extends Selector>(
  input: AST
): Selector;
export function splitCompoundSelectors<AST extends ImmutableSelector>(
  input: AST
): ImmutableSelector;
export function splitCompoundSelectors<AST extends SelectorList>(
  input: AST
): SelectorList;
export function splitCompoundSelectors<AST extends ImmutableSelectorList>(
  input: AST
): ImmutableSelectorList;
export function splitCompoundSelectors<AST extends SelectorList | Selector>(
  input: AST
): SelectorList | Selector | ImmutableSelector | ImmutableSelectorList {
  const inputSelectors: SelectorList = Array.isArray(input) ? input : [input];
  const output: SelectorList = [];
  for (const inputSelector of inputSelectors) {
    const outputSelector: Selector = {
      ...inputSelector,
      nodes: [],
    };
    for (const node of inputSelector.nodes) {
      if (node.type === `compound_selector`) {
        outputSelector.nodes.push(...node.nodes);
      } else {
        outputSelector.nodes.push(node);
      }
    }
    output.push(outputSelector);
  }
  return `length` in input ? output : output[0];
}

function isCommentWithNoSpacing(node: Comment): node is CommentWithNoSpacing {
  return node.type === `comment` && node.before === `` && node.after === ``;
}
