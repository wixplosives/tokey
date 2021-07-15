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
  SelectorNode,
  Star,
  Nesting,
  ImmutableSelectorNode,
  ImmutableSelectorList,
  ImmutableNthWithSelectorList,
} from "./ast-types";
import type {Immutable} from "./types";

export function stringifySelectorAst(
  value:
    | ImmutableSelectorNode
    | ImmutableSelectorList
    | ImmutableNthWithSelectorList
): string {
  return "length" in value ? stringifySelectors(value) : stringifyNode(value);
}

type Printers = {
  [K in SelectorNode as K["type"]]: (node: Immutable<K>) => string;
};

const printers: Printers = {
  id: (node: Immutable<Id>) => `#${node.value}${stringifyNested(node)}`,
  class: (node: Immutable<Class>) =>
    `.${node.dotComments.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  element: (node: Immutable<Element>) =>
    `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
  combinator: (node: Immutable<Combinator>) =>
    `${node.before}${node.value}${node.after}`,
  attribute: (node: Immutable<Attribute>) =>
    `[${node.value}]${stringifyNested(node)}`,
  pseudo_class: (node: Immutable<PseudoClass>) =>
    `:${node.colonComments.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  pseudo_element: (node: Immutable<PseudoElement>) =>
    `:${node.colonComments.first
      .map(stringifyNode)
      .join("")}:${node.colonComments.second.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  comment: ({ before, value, after }: Immutable<Comment>) =>
    `${before}${value}${after}`,
  star: (node: Immutable<Star>) =>
    `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
  nesting: (node: Immutable<Nesting>) =>
    `${node.value}${stringifyNested(node)}`,
  selector: (node: Immutable<Selector>) =>
    `${node.before}${node.nodes.map(stringifyNode).join("")}${node.after}`,
  invalid: (node: Immutable<Invalid>) => node.value,
  nth: (node: Immutable<Nth>) =>
    `${node.before}${node.nodes.map(stringifyNode).join("")}${node.after}`,
  nth_step: ({ before, value, after }: Immutable<NthStep>) =>
    `${before}${value}${after}`,
  nth_dash: ({ before, value, after }: Immutable<NthDash>) =>
    `${before}${value}${after}`,
  nth_offset: ({ before, value, after }: Immutable<NthOffset>) =>
    `${before}${value}${after}`,
  nth_of: ({ before, value, after }: Immutable<NthOf>) =>
    `${before}${value}${after}`,
};

function stringifyNode(node: ImmutableSelectorNode): string {
  return printers[node.type]?.(node as never) ?? "";
}

function stringifySelectors(
  selectors: ImmutableSelectorList | ImmutableNthWithSelectorList
) {
  const result: string[] = [];
  for (const node of selectors) {
    result.push(stringifyNode(node));
  }
  return result.join(`,`);
}

function stringifyNested(node: Immutable<Containers>): string {
  if ("nodes" in node) {
    if (node.nodes?.length) {
      if (
        node.type === `pseudo_class` &&
        NthParser.isNthPseudoClass(node.value)
      ) {
        const [nthNode, ...selectors] = node.nodes;
        return `(${stringifyNode(nthNode)}${stringifySelectors(selectors)})`;
      } else {
        return `(${stringifySelectors(node.nodes)})`;
      }
    } else {
      return `()`;
    }
  }
  return "";
}

function stringifyNamespace({
  namespace,
}: Immutable<NamespacedNodes>): string {
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
