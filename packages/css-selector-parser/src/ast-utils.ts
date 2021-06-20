import type { SelectorNode, SelectorList } from "./ast-types";

export interface WalkOptions {
  visitList?: SelectorNode["type"][];
  ignoreList?: SelectorNode["type"][];
}
const nestEnd = Symbol(`nest-end`);
export function walk(
  current: SelectorNode | SelectorList,
  visit: (node: SelectorNode, parents: SelectorNode[]) => number | undefined,
  options: WalkOptions = {}
): void {
  const parents: SelectorNode[] = [];
  const toVisit: Array<SelectorNode | SelectorList | typeof nestEnd> = [
    current,
  ];
  let skipAmount = -1;
  while (toVisit.length) {
    const current = toVisit.shift()!;
    // visit only allowed nodes (also skip selector list)
    if (current === nestEnd) {
      parents.pop();
      continue;
    } else if (
      !Array.isArray(current) &&
      (!options.ignoreList || !options.ignoreList.includes(current.type)) &&
      (!options.visitList || options.visitList.includes(current.type))
    ) {
      skipAmount = visit(current, parents) ?? -1;
    }
    if (skipAmount === Infinity) {
      // stop all: fast bail out
      return;
    } else if (skipAmount >= 0) {
      // skip next levels
      while (skipAmount > 0 && toVisit.length) {
        const next = toVisit.shift()!;
        if (next === nestEnd) {
          skipAmount--;
        }
      }
    } else {
      // add nested
      if (Array.isArray(current)) {
        // add sub selectors
        toVisit.push(...current);
      } else if (isWithNodes(current)) {
        // add nested nodes
        parents.push(current);
        toVisit.unshift(...current.nodes, nestEnd);
      }
    }
  }
}

walk.skipNested = 0 as const;
walk.skipCurrentSelector = 1 as const;
walk.stopAll = Infinity;

function isWithNodes(node: any): node is { nodes: SelectorNode[] } {
  return node && `nodes` in node;
}
