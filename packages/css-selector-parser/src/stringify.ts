import { NthParser } from "./nth-parser";
import type {
  Id,
  Attribute,
  Class,
  Combinator,
  Comment,
  Containers,
  Element,
  Invalid,
  NamespacedNodes,
  Nth,
  NthDash,
  NthOf,
  NthOffset,
  NthStep,
  PseudoClass,
  PseudoElement,
  Selector,
  SelectorList,
  SelectorNode,
  Star,
  Nesting,
} from "./ast-types";

export function stringifySelectorAst(
  value: SelectorNode | SelectorList | [Nth, ...SelectorList]
): string {
  return Array.isArray(value)
    ? stringifySelectors(value)
    : stringifyNode(value);
}

type R = { [K in SelectorNode as K["type"]]: (node: K) => string };

const printers: R = {
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
  nesting: (node: Nesting) => `${node.value}${stringifyNested(node)}`,
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

function stringifyNode(node: SelectorNode): string {
  return printers[node.type]?.(node as never) ?? "";
}

function stringifySelectors(selectors: SelectorList | [Nth, ...SelectorList]) {
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
        node.type === `pseudo_class` && NthParser.isNthPseudoClass(node.value);
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
