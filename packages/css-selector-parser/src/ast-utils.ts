import type { SelectorNode, SelectorList } from "./ast-types";

export interface WalkOptions {
  visitList?: SelectorNode["type"][];
  ignoreList?: SelectorNode["type"][];
}
export function walk(
  current: SelectorNode | SelectorList,
  visit: (node: SelectorNode) => number | undefined,
  options: WalkOptions = {}
): number | undefined {
  // visit only allowed nodes (also skip selector list)
  if (
    !Array.isArray(current) &&
    (!options.ignoreList || !options.ignoreList.includes(current.type)) &&
    (!options.visitList || options.visitList.includes(current.type))
  ) {
    const skipAmount = visit(current);
    if (skipAmount !== undefined) {
      // stop
      return skipAmount > 0 ? skipAmount - 1 : undefined;
    }
  }
  // iterate nested nodes
  const nodes = Array.isArray(current)
    ? current
    : isWithNodes(current)
    ? current.nodes
    : null;
  if (nodes) {
    for (const node of nodes) {
      const skipAmount = walk(node, visit, options);
      if (skipAmount !== undefined) {
        // stop
        return skipAmount > 0 ? skipAmount - 1 : undefined;
      }
    }
  }
  return;
}

walk.skipNested = 0 as const;
walk.skipCurrentSelector = 1 as const;
walk.stopAll = Infinity;

function isWithNodes(node: any): node is { nodes: SelectorNode[] } {
  return node && `nodes` in node;
}
