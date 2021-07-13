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
  DeepReadonlySelectorNode,
  DeepReadonlySelectorList,
  DeepReadonlyNthWithSelectorList,
  DeepReadonly,
} from "./ast-types";

export function stringifySelectorAst(
  value:
    | DeepReadonlySelectorNode
    | DeepReadonlySelectorList
    | DeepReadonlyNthWithSelectorList
): string {
  return "length" in value ? stringifySelectors(value) : stringifyNode(value);
}

type Printers = {
  [K in SelectorNode as K["type"]]: (node: DeepReadonly<K>) => string;
};

const printers: Printers = {
  id: (node: DeepReadonly<Id>) => `#${node.value}${stringifyNested(node)}`,
  class: (node: DeepReadonly<Class>) =>
    `.${node.dotComments.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  element: (node: DeepReadonly<Element>) =>
    `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
  combinator: (node: DeepReadonly<Combinator>) =>
    `${node.before}${node.value}${node.after}`,
  attribute: (node: DeepReadonly<Attribute>) =>
    `[${node.value}]${stringifyNested(node)}`,
  pseudo_class: (node: DeepReadonly<PseudoClass>) =>
    `:${node.colonComments.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  pseudo_element: (node: DeepReadonly<PseudoElement>) =>
    `:${node.colonComments.first
      .map(stringifyNode)
      .join("")}:${node.colonComments.second.map(stringifyNode).join("")}${
      node.value
    }${stringifyNested(node)}`,
  comment: ({ before, value, after }: DeepReadonly<Comment>) =>
    `${before}${value}${after}`,
  star: (node: DeepReadonly<Star>) =>
    `${stringifyNamespace(node)}${node.value}${stringifyNested(node)}`,
  nesting: (node: DeepReadonly<Nesting>) =>
    `${node.value}${stringifyNested(node)}`,
  selector: (node: DeepReadonly<Selector>) =>
    `${node.before}${node.nodes.map(stringifyNode).join("")}${node.after}`,
  invalid: (node: DeepReadonly<Invalid>) => node.value,
  nth: (node: DeepReadonly<Nth>) =>
    `${node.before}${node.nodes.map(stringifyNode).join("")}${node.after}`,
  nth_step: ({ before, value, after }: DeepReadonly<NthStep>) =>
    `${before}${value}${after}`,
  nth_dash: ({ before, value, after }: DeepReadonly<NthDash>) =>
    `${before}${value}${after}`,
  nth_offset: ({ before, value, after }: DeepReadonly<NthOffset>) =>
    `${before}${value}${after}`,
  nth_of: ({ before, value, after }: DeepReadonly<NthOf>) =>
    `${before}${value}${after}`,
};

function stringifyNode(node: DeepReadonlySelectorNode): string {
  return printers[node.type]?.(node as never) ?? "";
}

function stringifySelectors(
  selectors: DeepReadonlySelectorList | DeepReadonlyNthWithSelectorList
) {
  const result: string[] = [];
  for (const node of selectors) {
    result.push(stringifyNode(node));
  }
  return result.join(`,`);
}

function stringifyNested(node: DeepReadonly<Containers>): string {
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
}: DeepReadonly<NamespacedNodes>): string {
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
