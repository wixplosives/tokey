import { test as baseTest } from "../test-kit/testing";
import {
  tokenizeSelector,
  stringifySelectors,
} from "../src/parsers/selector-tokenizer";
import type {
  SelectorNode,
  Selector,
  SelectorList,
} from "../src/parsers/selector-tokenizer";

function createNode<TYPE extends SelectorNode["type"]>(
  expected: Partial<SelectorNode> & { type: TYPE }
): TYPE extends "selector" ? Selector : SelectorNode {
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
  if (defaults.type === `star`) {
    // defaults.namespace = ``;
  }
  if (defaults.type === `pseudo_class`) {
    defaults.colonComments = [];
  }
  if (defaults.type === `pseudo_element`) {
    defaults.colonComments = { first: [], second: [] };
  }
  if (defaults.type === `selector` || defaults.type === `combinator`) {
    defaults.before = ``;
    defaults.after = ``;
  }
  if (defaults.type === `combinator`) {
    defaults.invalid = false;
  }
  return {
    ...defaults,
    ...(expected as any),
  };
}

function test<T extends string, U extends SelectorList>(
  input: T,
  aFn: (input: T) => U,
  expected: U
) {
  let log = ``;
  const actualAst = baseTest(input, aFn, expected, (msg) => (log += msg));
  const stringify = stringifySelectors(actualAst);
  if (stringify !== input) {
    throw new Error(
      `expected stringify value "${stringify}" to equal input "${input}"`
    );
  } else {
    console.log(log);
  }
}

// selector types

test(`*`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 1,
    nodes: [
      createNode({
        type: `star`,
        value: `*`, // is this necessary?
        start: 0,
        end: 1,
      }),
    ],
  }),
]);

test(`ns|div`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 6,
    nodes: [
      createNode({
        type: `element`,
        value: `div`,
        start: 0,
        end: 6,
        namespace: `ns`,
      }),
    ],
  }),
]);

test(`*|div`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 5,
    nodes: [
      createNode({
        type: `element`,
        value: `div`,
        start: 0,
        end: 5,
        namespace: `*`,
      }),
    ],
  }),
]);

test(`some-element`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 12,
    nodes: [
      createNode({
        type: `element`,
        value: `some-element`,
        start: 0,
        end: 12,
      }),
    ],
  }),
]);

test(`someelement`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 11,
    nodes: [
      createNode({
        type: `element`,
        value: `someelement`,
        start: 0,
        end: 11,
      }),
    ],
  }),
]);

test(`.classX`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 7,
    nodes: [
      createNode({
        type: `class`,
        value: `classX`,
        start: 0,
        end: 7,
      }),
    ],
  }),
]);

test(`#x-id`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 5,
    nodes: [
      createNode({
        type: `id`,
        value: `x-id`,
        start: 0,
        end: 5,
      }),
    ],
  }),
]);

test(`:pseudo-class-x`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 15,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `pseudo-class-x`,
        start: 0,
        end: 15,
      }),
    ],
  }),
]);

test(`:nested-pseudo-class-x()`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 24,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `nested-pseudo-class-x`,
        start: 0,
        end: 24,
        nodes: [],
      }),
    ],
  }),
]);

test(`:nested-pseudo-class-x(.a)`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 26,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `nested-pseudo-class-x`,
        start: 0,
        end: 26,
        nodes: [
          createNode({
            type: `selector`,
            start: 23,
            end: 25,
            nodes: [
              createNode({
                type: `class`,
                value: `a`,
                start: 23,
                end: 25,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]);

test(`:nested-pseudo-class-x(.a, .b)`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 30,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `nested-pseudo-class-x`,
        start: 0,
        end: 30,
        nodes: [
          createNode({
            type: `selector`,
            start: 23,
            end: 25,
            nodes: [
              createNode({
                type: `class`,
                value: `a`,
                start: 23,
                end: 25,
              }),
            ],
          }),
          createNode({
            type: `selector`,
            start: 26,
            end: 29,
            before: ` `,
            nodes: [
              createNode({
                type: `class`,
                value: `b`,
                start: 27,
                end: 29,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]);

test(`::pseudo-element-x`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 18,
    nodes: [
      createNode({
        type: `pseudo_element`,
        value: `pseudo-element-x`,
        start: 0,
        end: 18,
      }),
    ],
  }),
]);

test(`::pseudo-element-x()`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 20,
    nodes: [
      createNode({
        type: `pseudo_element`,
        value: `pseudo-element-x`,
        start: 0,
        end: 20,
        nodes: [],
      }),
    ],
  }),
]);

test(`::pseudo-element-x(.a)`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 22,
    nodes: [
      createNode({
        type: `pseudo_element`,
        value: `pseudo-element-x`,
        start: 0,
        end: 22,
        nodes: [
          createNode({
            type: `selector`,
            start: 19,
            end: 21,
            nodes: [
              createNode({
                type: `class`,
                value: `a`,
                start: 19,
                end: 21,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]);

test(`::pseudo-element-x(.a, .b)`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 26,
    nodes: [
      createNode({
        type: `pseudo_element`,
        value: `pseudo-element-x`,
        start: 0,
        end: 26,
        nodes: [
          createNode({
            type: `selector`,
            start: 19,
            end: 21,
            nodes: [
              createNode({
                type: `class`,
                value: `a`,
                start: 19,
                end: 21,
              }),
            ],
          }),
          createNode({
            type: `selector`,
            start: 22,
            end: 25,
            before: ` `,
            nodes: [
              createNode({
                type: `class`,
                value: `b`,
                start: 23,
                end: 25,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]);

test(`[attr-x]`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 8,
    nodes: [
      createNode({
        type: `attribute`,
        value: `attr-x`,
        start: 0,
        end: 8,
      }),
    ],
  }),
]);

test(`[attr-x="attr-value"]`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 21,
    nodes: [
      createNode({
        type: `attribute`,
        value: `attr-x="attr-value"`,
        start: 0,
        end: 21,
      }),
    ],
  }),
]);

// comments

test(`/* comment  */`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 14,
    nodes: [
      createNode({
        type: `comment`,
        value: `/* comment  */`,
        start: 0,
        end: 14,
      }),
    ],
  }),
]);

test(`./*comment1???*//*???comment2*/classX`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 37,
    nodes: [
      createNode({
        type: `class`,
        value: `classX`,
        start: 0,
        end: 37,
        dotComments: [
          {
            type: `comment`,
            value: `/*comment1???*/`,
            start: 1,
            end: 16,
          },
          {
            type: `comment`,
            value: `/*???comment2*/`,
            start: 16,
            end: 31,
          },
        ],
      }),
    ],
  }),
]);

test(`:/*comment1???*//*???comment2*/pseudo-class`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 43,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `pseudo-class`,
        start: 0,
        end: 43,
        colonComments: [
          {
            type: `comment`,
            value: `/*comment1???*/`,
            start: 1,
            end: 16,
          },
          {
            type: `comment`,
            value: `/*???comment2*/`,
            start: 16,
            end: 31,
          },
        ],
      }),
    ],
  }),
]);

test(`:/*c1*//*c2*/:/*c3*//*c4*/pseudo-element`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 40,
    nodes: [
      createNode({
        type: `pseudo_element`,
        value: `pseudo-element`,
        start: 0,
        end: 40,
        colonComments: {
          first: [
            {
              type: `comment`,
              value: `/*c1*/`,
              start: 1,
              end: 7,
            },
            {
              type: `comment`,
              value: `/*c2*/`,
              start: 7,
              end: 13,
            },
          ],
          second: [
            {
              type: `comment`,
              value: `/*c3*/`,
              start: 14,
              end: 20,
            },
            {
              type: `comment`,
              value: `/*c4*/`,
              start: 20,
              end: 26,
            },
          ],
        },
      }),
    ],
  }),
]);

// combinators

test(`* .nested-class`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 15,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `space`,
        value: ` `,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `class`,
        value: `nested-class`,
        start: 2,
        end: 15,
      }),
    ],
  }),
]);

test(`*+.adjacent-class`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 17,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `class`,
        value: `adjacent-class`,
        start: 2,
        end: 17,
      }),
    ],
  }),
]);

test(`*~.proceeding-sibling-class`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 27,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `~`,
        value: `~`,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `class`,
        value: `proceeding-sibling-class`,
        start: 2,
        end: 27,
      }),
    ],
  }),
]);

test(`*>.direct-child-class`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 21,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `>`,
        value: `>`,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `class`,
        value: `direct-child-class`,
        start: 2,
        end: 21,
      }),
    ],
  }),
]);

test(`*++*`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 4,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 2,
        end: 3,
        invalid: true,
      }),
      createNode({
        type: `star`,
        value: `*`,
        start: 3,
        end: 4,
      }),
    ],
  }),
]);

test(`*+*+*`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 5,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `star`,
        value: `*`,
        start: 2,
        end: 3,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 3,
        end: 4,
      }),
      createNode({
        type: `star`,
        value: `*`,
        start: 4,
        end: 5,
      }),
    ],
  }),
]);

test(`*   *`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 5,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `space`,
        value: ` `,
        start: 1,
        end: 4,
        after: `  `,
      }),
      createNode({
        type: `star`,
        value: `*`,
        start: 4,
        end: 5,
      }),
    ],
  }),
]);

test(`* + *`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 5,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 1,
        end: 4,
        before: ` `,
        after: ` `,
      }),
      createNode({
        type: `star`,
        value: `*`,
        start: 4,
        end: 5,
      }),
    ],
  }),
]);

test(`*+~> *`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 6,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `combinator`,
        combinator: `~`,
        value: `~`,
        start: 2,
        end: 3,
        invalid: true,
      }),
      createNode({
        type: `combinator`,
        combinator: `>`,
        value: `>`,
        start: 3,
        end: 5,
        after: ` `,
        invalid: true,
      }),
      createNode({
        type: `star`,
        value: `*`,
        start: 5,
        end: 6,
      }),
    ],
  }),
]);

// invalid

test(`:pseudo(`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 8,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `pseudo`,
        start: 0,
        end: 7,
      }),
      createNode({
        type: `invalid`,
        value: `(`,
        start: 7,
        end: 8,
      }),
    ],
  }),
]);

test(`::pseudo(`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 9,
    nodes: [
      createNode({
        type: `pseudo_element`,
        value: `pseudo`,
        start: 0,
        end: 8,
      }),
      createNode({
        type: `invalid`,
        value: `(`,
        start: 8,
        end: 9,
      }),
    ],
  }),
]);

// spaces

test(`:p(  .a  ,   .b  )`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 18,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `p`,
        start: 0,
        end: 18,
        nodes: [
          createNode({
            type: `selector`,
            start: 3,
            end: 9,
            before: `  `,
            after: `  `,
            nodes: [
              createNode({
                type: `class`,
                value: `a`,
                start: 5,
                end: 7,
              }),
            ],
          }),
          createNode({
            type: `selector`,
            start: 10,
            end: 17,
            before: `   `,
            after: `  `,
            nodes: [
              createNode({
                type: `class`,
                value: `b`,
                start: 13,
                end: 15,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]);

test(`::p(  .a  ,   .b  )`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 19,
    nodes: [
      createNode({
        type: `pseudo_element`,
        value: `p`,
        start: 0,
        end: 19,
        nodes: [
          createNode({
            type: `selector`,
            start: 4,
            end: 10,
            before: `  `,
            after: `  `,
            nodes: [
              createNode({
                type: `class`,
                value: `a`,
                start: 6,
                end: 8,
              }),
            ],
          }),
          createNode({
            type: `selector`,
            start: 11,
            end: 18,
            before: `   `,
            after: `  `,
            nodes: [
              createNode({
                type: `class`,
                value: `b`,
                start: 14,
                end: 16,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]);

test(`*    .a  + .b`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 13,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `space`,
        value: ` `,
        after: `   `,
        start: 1,
        end: 5,
      }),
      createNode({
        type: `class`,
        value: `a`,
        start: 5,
        end: 7,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        before: `  `,
        after: ` `,
        start: 7,
        end: 11,
      }),
      createNode({
        type: `class`,
        value: `b`,
        start: 11,
        end: 13,
      }),
    ],
  }),
]);

// combinations

test(`:a(.b,::d(.e,.f))`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 17,
    nodes: [
      createNode({
        type: `pseudo_class`,
        value: `a`,
        start: 0,
        end: 17,
        nodes: [
          createNode({
            type: `selector`,
            start: 3,
            end: 5,
            nodes: [
              createNode({
                type: `class`,
                value: `b`,
                start: 3,
                end: 5,
              }),
            ],
          }),
          createNode({
            type: `selector`,
            start: 6,
            end: 16,
            nodes: [
              createNode({
                type: `pseudo_element`,
                value: `d`,
                start: 6,
                end: 16,
                nodes: [
                  createNode({
                    type: `selector`,
                    start: 10,
                    end: 12,
                    nodes: [
                      createNode({
                        type: `class`,
                        value: `e`,
                        start: 10,
                        end: 12,
                      }),
                    ],
                  }),
                  createNode({
                    type: `selector`,
                    start: 13,
                    end: 15,
                    nodes: [
                      createNode({
                        type: `class`,
                        value: `f`,
                        start: 13,
                        end: 15,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]);

test(`* .a+.b`, tokenizeSelector, [
  createNode({
    type: `selector`,
    start: 0,
    end: 7,
    nodes: [
      createNode({
        type: `star`,
        value: `*`,
        start: 0,
        end: 1,
      }),
      createNode({
        type: `combinator`,
        combinator: `space`,
        value: ` `,
        start: 1,
        end: 2,
      }),
      createNode({
        type: `class`,
        value: `a`,
        start: 2,
        end: 4,
      }),
      createNode({
        type: `combinator`,
        combinator: `+`,
        value: `+`,
        start: 4,
        end: 5,
      }),
      createNode({
        type: `class`,
        value: `b`,
        start: 5,
        end: 7,
      }),
    ],
  }),
]);
