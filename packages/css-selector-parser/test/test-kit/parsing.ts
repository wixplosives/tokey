import {
  parseCssSelector,
  stringifySelectorAst,
} from "@tokey/css-selector-parser";
import type {
  SelectorNode,
  Selector,
  Comment,
  Nth,
  NthStep,
  NthDash,
  NthOffset,
  NthOf,
  ParseConfig,
} from "@tokey/css-selector-parser";
import { createParseTester } from "@tokey/test-kit";

export const test = createParseTester({
  parse: (selector: string, config?: ParseConfig) => parseCssSelector(selector, config),
  stringify: stringifySelectorAst,
});

export function createNode<TYPE extends SelectorNode["type"]>(
  expected: Partial<SelectorNode> & { type: TYPE }
): TYPE extends "selector"
  ? Selector
  : TYPE extends "comment"
  ? Comment
  : TYPE extends "nth"
  ? Nth
  : TYPE extends "nth_step"
  ? NthStep
  : TYPE extends "nth_dash"
  ? NthDash
  : TYPE extends "nth_offset"
  ? NthOffset
  : TYPE extends "nth_of"
  ? NthOf
  : SelectorNode {
  const defaults: SelectorNode = {
    type: expected.type,
    start: 0,
    end: 0,
    // value: ``,
  } as any;
  // if (
  //   defaults.type === `attribute` ||
  //   defaults.type === `id` ||
  //   defaults.type === `class` ||
  //   defaults.type === `selector` ||
  //   defaults.type === `pseudo_class` ||
  //   defaults.type === `pseudo_element` ||
  //   defaults.type === `star`
  // ) {
  //   defaults.nodes = [];
  // }
  if (defaults.type === `class`) {
    defaults.dotComments = [];
  }
  if (defaults.type === `universal` || defaults.type === `type`) {
    // defaults.namespace = { value: ``, beforeComments: [], afterComments: [] };
  }
  if (defaults.type === `pseudo_class`) {
    defaults.colonComments = [];
  }
  if (defaults.type === `pseudo_element`) {
    defaults.colonComments = { first: [], second: [] };
  }
  if (
    defaults.type === `selector` ||
    defaults.type === `combinator` ||
    defaults.type === `comment` ||
    defaults.type === `nth` ||
    defaults.type === `nth_step` ||
    defaults.type === `nth_dash` ||
    defaults.type === `nth_offset` ||
    defaults.type === `nth_of`
  ) {
    defaults.before = ``;
    defaults.after = ``;
  }
  if (defaults.type === `combinator`) {
    defaults.invalid = false;
  }
  return {
    ...defaults,
    ...(expected as unknown as any),
  };
}
