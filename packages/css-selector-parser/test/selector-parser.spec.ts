import {
  parseCssSelector,
  stringifySelectorAst,
} from "@tokey/css-selector-parser";
import type {
  SelectorNode,
  Selector,
  SelectorList,
  Comment,
  Nth,
  NthStep,
  NthDash,
  NthOffset,
  NthOf,
} from "@tokey/css-selector-parser";
import { test as baseTest } from "@tokey/test-kit";

function createNode<TYPE extends SelectorNode["type"]>(
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
  if (defaults.type === `star` || defaults.type === `element`) {
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

function test<T extends string, U extends SelectorList>(
  input: T,
  aFn: (input: T) => U,
  expected: U
) {
  const actualAst = baseTest(input, aFn, expected);
  const stringify = stringifySelectorAst(actualAst);
  if (stringify !== input) {
    throw new Error(
      `expected stringify value "${stringify}" to equal input "${input}"`
    );
  }
}

describe(`selector-parser`, () => {
  describe(`selector types`, () => {
    it(`*`, () => {
      test(`*`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 1,
          nodes: [
            createNode({
              type: `star`,
              value: `*`,
              start: 0,
              end: 1,
            }),
          ],
        }),
      ]);
    });
    it(`some-element`, () => {
      test(`some-element`, parseCssSelector, [
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
    });
    it(`someelement`, () => {
      test(`someelement`, parseCssSelector, [
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
    });
    it(`.classX`, () => {
      test(`.classX`, parseCssSelector, [
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
    });
    it(`#x-id`, () => {
      test(`#x-id`, parseCssSelector, [
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
    });
    it(`:pseudo-class-x`, () => {
      test(`:pseudo-class-x`, parseCssSelector, [
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
    });
    it(`:nested-pseudo-class-x()`, () => {
      test(`:nested-pseudo-class-x()`, parseCssSelector, [
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
    });
    it(`:nested-pseudo-class-x(.a)`, () => {
      test(`:nested-pseudo-class-x(.a)`, parseCssSelector, [
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
    });
    it(`:nested-pseudo-class-x(.a, .b)`, () => {
      test(`:nested-pseudo-class-x(.a, .b)`, parseCssSelector, [
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
    });
    it(`::pseudo-element-x`, () => {
      test(`::pseudo-element-x`, parseCssSelector, [
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
    });
    it(`::pseudo-element-x()`, () => {
      test(`::pseudo-element-x()`, parseCssSelector, [
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
    });
    it(`::pseudo-element-x(.a)`, () => {
      test(`::pseudo-element-x(.a)`, parseCssSelector, [
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
    });
    it(`::pseudo-element-x(.a, .b)`, () => {
      test(`::pseudo-element-x(.a, .b)`, parseCssSelector, [
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
    });
    it(`[attr-x]`, () => {
      test(`[attr-x]`, parseCssSelector, [
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
    });
    it(`[attr-x="attr-value"]`, () => {
      test(`[attr-x="attr-value"]`, parseCssSelector, [
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
    });
  });
  describe(`nth`, () => {
    it(`:nth-child()`, () => {
      test(`:nth-child()`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 12,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 12,
              nodes: [],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n)`, () => {
      test(`:nth-child(2n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 14,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 14,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 13,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 13,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(-2n)`, () => {
      test(`:nth-child(-2n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 15,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 15,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 14,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `-2n`,
                      start: 11,
                      end: 14,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(+2N)`, () => {
      test(`:nth-child(+2N)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 15,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 15,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 14,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `+2N`,
                      start: 11,
                      end: 14,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(-n)`, () => {
      test(`:nth-child(-n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 14,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 14,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 13,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `-n`,
                      start: 11,
                      end: 13,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(+n)`, () => {
      test(`:nth-child(+n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 14,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 14,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 13,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `+n`,
                      start: 11,
                      end: 13,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(n)`, () => {
      test(`:nth-child(n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 13,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 13,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 12,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `n`,
                      start: 11,
                      end: 12,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(odd)`, () => {
      test(`:nth-child(odd)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 15,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 15,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 14,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `odd`,
                      start: 11,
                      end: 14,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(even)`, () => {
      test(`:nth-child(even)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 16,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 16,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 15,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `even`,
                      start: 11,
                      end: 15,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n-3)`, () => {
      test(`:nth-child(2n-3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 16,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 16,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 15,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 13,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `-3`,
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
    });
    it(`:nth-child(2n+3)`, () => {
      test(`:nth-child(2n+3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 16,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 16,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 15,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 13,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `+3`,
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
    });
    it(`:nth-child(3)`, () => {
      test(`:nth-child(3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 13,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 13,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 12,
                  nodes: [
                    createNode({
                      type: `nth_offset`,
                      value: `3`,
                      start: 11,
                      end: 12,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n- 3)`, () => {
      test(`:nth-child(2n- 3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 17,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 17,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 16,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 13,
                    }),
                    createNode({
                      type: `nth_dash`,
                      value: `-`,
                      start: 13,
                      end: 15,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `3`,
                      start: 15,
                      end: 16,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n+ 3)`, () => {
      test(`:nth-child(2n+ 3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 17,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 17,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 16,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 13,
                    }),
                    createNode({
                      type: `nth_dash`,
                      value: `+`,
                      start: 13,
                      end: 15,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `3`,
                      start: 15,
                      end: 16,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n - 3)`, () => {
      test(`:nth-child(2n - 3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 18,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 18,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 17,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 14,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_dash`,
                      value: `-`,
                      start: 14,
                      end: 16,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `3`,
                      start: 16,
                      end: 17,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n + 3)`, () => {
      test(`:nth-child(2n + 3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 18,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 18,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 17,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 14,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_dash`,
                      value: `+`,
                      start: 14,
                      end: 16,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `3`,
                      start: 16,
                      end: 17,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n + 3 of div.klass)`, () => {
      test(`:nth-child(2n + 3 of div.klass)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 31,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 31,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 20,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 14,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_dash`,
                      value: `+`,
                      start: 14,
                      end: 16,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `3`,
                      start: 16,
                      end: 18,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_of`,
                      value: `of`,
                      start: 18,
                      end: 20,
                    }),
                  ],
                }),
                createNode({
                  type: `selector`,
                  start: 20,
                  end: 30,
                  before: ` `,
                  nodes: [
                    createNode({
                      type: `element`,
                      value: `div`,
                      start: 21,
                      end: 24,
                    }),
                    createNode({
                      type: `class`,
                      value: `klass`,
                      start: 24,
                      end: 30,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n of html|div)`, () => {
      test(`:nth-child(2n of html|div)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 26,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 26,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 16,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 14,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_of`,
                      value: `of`,
                      start: 14,
                      end: 16,
                    }),
                  ],
                }),
                createNode({
                  type: `selector`,
                  start: 16,
                  end: 25,
                  before: ` `,
                  nodes: [
                    createNode({
                      type: `element`,
                      value: `div`,
                      start: 17,
                      end: 25,
                      namespace: {
                        value: `html`,
                        beforeComments: [],
                        afterComments: [],
                      },
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n of div, span)`, () => {
      test(`:nth-child(2n of div, span)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 27,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 27,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 16,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 14,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_of`,
                      value: `of`,
                      start: 14,
                      end: 16,
                    }),
                  ],
                }),
                createNode({
                  type: `selector`,
                  start: 16,
                  end: 20,
                  before: ` `,
                  nodes: [
                    createNode({
                      type: `element`,
                      value: `div`,
                      start: 17,
                      end: 20,
                    }),
                  ],
                }),
                createNode({
                  type: `selector`,
                  start: 21,
                  end: 26,
                  before: ` `,
                  nodes: [
                    createNode({
                      type: `element`,
                      value: `span`,
                      start: 22,
                      end: 26,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-last-child(2n)`, () => {
      test(`:nth-last-child(2n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 19,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-last-child`,
              start: 0,
              end: 19,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 16,
                  end: 18,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 16,
                      end: 18,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-of-type(2n)`, () => {
      test(`:nth-of-type(2n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 16,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-of-type`,
              start: 0,
              end: 16,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 13,
                  end: 15,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
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
    });
    it(`:nth-last-of-type(2n)`, () => {
      test(`:nth-last-of-type(2n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 21,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-last-of-type`,
              start: 0,
              end: 21,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 18,
                  end: 20,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 18,
                      end: 20,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child( 2n)`, () => {
      test(`:nth-child( 2n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 15,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 15,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 14,
                  before: ` `,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 12,
                      end: 14,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
  });
  describe(`namespace`, () => {
    it(`ns|div`, () => {
      test(`ns|div`, parseCssSelector, [
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
              namespace: {
                value: `ns`,
                beforeComments: [],
                afterComments: [],
              },
            }),
          ],
        }),
      ]);
    });
    it(`*|div`, () => {
      test(`*|div`, parseCssSelector, [
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
              namespace: {
                value: `*`,
                beforeComments: [],
                afterComments: [],
              },
            }),
          ],
        }),
      ]);
    });
    it(`|div`, () => {
      test(`|div`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 4,
          nodes: [
            createNode({
              type: `element`,
              value: `div`,
              start: 0,
              end: 4,
              namespace: {
                value: ``,
                beforeComments: [],
                afterComments: [],
              },
            }),
          ],
        }),
      ]);
    });
    it(`ns|*`, () => {
      test(`ns|*`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 4,
          nodes: [
            createNode({
              type: `star`,
              value: `*`,
              start: 0,
              end: 4,
              namespace: {
                value: `ns`,
                beforeComments: [],
                afterComments: [],
              },
            }),
          ],
        }),
      ]);
    });
  });
  describe(`comments`, () => {
    it(`/* comment  */`, () => {
      test(`/* comment  */`, parseCssSelector, [
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
    });
    it(`./*comment1???*//*???comment2*/classX`, () => {
      test(`./*comment1???*//*???comment2*/classX`, parseCssSelector, [
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
                createNode({
                  type: `comment`,
                  value: `/*comment1???*/`,
                  start: 1,
                  end: 16,
                }),
                createNode({
                  type: `comment`,
                  value: `/*???comment2*/`,
                  start: 16,
                  end: 31,
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:/*comment1???*//*???comment2*/pseudo-class`, () => {
      test(`:/*comment1???*//*???comment2*/pseudo-class`, parseCssSelector, [
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
                createNode({
                  type: `comment`,
                  value: `/*comment1???*/`,
                  start: 1,
                  end: 16,
                }),
                createNode({
                  type: `comment`,
                  value: `/*???comment2*/`,
                  start: 16,
                  end: 31,
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:/*c1*//*c2*/:/*c3*//*c4*/pseudo-element`, () => {
      test(`:/*c1*//*c2*/:/*c3*//*c4*/pseudo-element`, parseCssSelector, [
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
                  createNode({
                    type: `comment`,
                    value: `/*c1*/`,
                    start: 1,
                    end: 7,
                  }),
                  createNode({
                    type: `comment`,
                    value: `/*c2*/`,
                    start: 7,
                    end: 13,
                  }),
                ],
                second: [
                  createNode({
                    type: `comment`,
                    value: `/*c3*/`,
                    start: 14,
                    end: 20,
                  }),
                  createNode({
                    type: `comment`,
                    value: `/*c4*/`,
                    start: 20,
                    end: 26,
                  }),
                ],
              },
            }),
          ],
        }),
      ]);
    });
    it(`*+/*c1*/+*`, () => {
      test(`*+/*c1*/+*`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 10,
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
              type: `comment`,
              value: `/*c1*/`,
              start: 2,
              end: 8,
            }),
            createNode({
              type: `combinator`,
              combinator: `+`,
              value: `+`,
              start: 8,
              end: 9,
              invalid: true,
            }),
            createNode({
              type: `star`,
              value: `*`,
              start: 9,
              end: 10,
            }),
          ],
        }),
      ]);
    });
    it(`*+/*c1*/  *`, () => {
      test(`*+/*c1*/  *`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 11,
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
              type: `comment`,
              value: `/*c1*/`,
              start: 2,
              end: 10,
              after: `  `,
            }),
            createNode({
              type: `star`,
              value: `*`,
              start: 10,
              end: 11,
            }),
          ],
        }),
      ]);
    });
    it(`*+ /*c1*/ /*c2*/ *`, () => {
      test(`*+ /*c1*/ /*c2*/ *`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 18,
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
              end: 3,
              after: ` `,
            }),
            createNode({
              type: `comment`,
              value: `/*c1*/`,
              start: 3,
              end: 10,
              after: ` `,
            }),
            createNode({
              type: `comment`,
              value: `/*c2*/`,
              start: 10,
              end: 17,
              after: ` `,
            }),
            createNode({
              type: `star`,
              value: `*`,
              start: 17,
              end: 18,
            }),
          ],
        }),
      ]);
    });
    it(`*/*c1*//*c2*/|/*c3*//*c4*/div`, () => {
      test(`*/*c1*//*c2*/|/*c3*//*c4*/div`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 29,
          nodes: [
            createNode({
              type: `element`,
              value: `div`,
              start: 0,
              end: 29,
              namespace: {
                value: `*`,
                beforeComments: [
                  createNode({
                    type: `comment`,
                    value: `/*c1*/`,
                    start: 1,
                    end: 7,
                  }),
                  createNode({
                    type: `comment`,
                    value: `/*c2*/`,
                    start: 7,
                    end: 13,
                  }),
                ],
                afterComments: [
                  createNode({
                    type: `comment`,
                    value: `/*c3*/`,
                    start: 14,
                    end: 20,
                  }),
                  createNode({
                    type: `comment`,
                    value: `/*c4*/`,
                    start: 20,
                    end: 26,
                  }),
                ],
              },
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(/*c0*/ -5n /*c1*/ - /*c2*/ 10 /*c3*/ of /*c4*/div/*c5*/)`, () => {
      test(
        `:nth-child(/*c0*/ -5n /*c1*/ - /*c2*/ 10 /*c3*/ of /*c4*/div/*c5*/)`,
        parseCssSelector,
        [
          createNode({
            type: `selector`,
            start: 0,
            end: 67,
            nodes: [
              createNode({
                type: `pseudo_class`,
                value: `nth-child`,
                start: 0,
                end: 67,
                nodes: [
                  createNode({
                    type: `nth`,
                    start: 11,
                    end: 50,
                    nodes: [
                      createNode({
                        type: `comment`,
                        value: `/*c0*/`,
                        start: 11,
                        end: 18,
                        after: ` `,
                      }),
                      createNode({
                        type: `nth_step`,
                        value: `-5n`,
                        start: 18,
                        end: 22,
                        after: ` `,
                      }),
                      createNode({
                        type: `comment`,
                        value: `/*c1*/`,
                        start: 22,
                        end: 29,
                        after: ` `,
                      }),
                      createNode({
                        type: `nth_dash`,
                        value: `-`,
                        start: 29,
                        end: 31,
                        after: ` `,
                      }),
                      createNode({
                        type: `comment`,
                        value: `/*c2*/`,
                        start: 31,
                        end: 38,
                        after: ` `,
                      }),
                      createNode({
                        type: `nth_offset`,
                        value: `10`,
                        start: 38,
                        end: 41,
                        after: ` `,
                      }),
                      createNode({
                        type: `comment`,
                        value: `/*c3*/`,
                        start: 41,
                        end: 48,
                        after: ` `,
                      }),
                      createNode({
                        type: `nth_of`,
                        value: `of`,
                        start: 48,
                        end: 50,
                      }),
                    ],
                  }),
                  createNode({
                    type: `selector`,
                    start: 50,
                    end: 66,
                    before: ` `,
                    nodes: [
                      createNode({
                        type: `comment`,
                        value: `/*c4*/`,
                        start: 51,
                        end: 57,
                      }),
                      createNode({
                        type: "element",
                        value: `div`,
                        start: 57,
                        end: 60,
                      }),
                      createNode({
                        type: `comment`,
                        value: `/*c5*/`,
                        start: 60,
                        end: 66,
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ]
      );
    });
  });
  describe(`combinators`, () => {
    it(`* .nested-class`, () => {
      test(`* .nested-class`, parseCssSelector, [
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
    });
    it(`*+.adjacent-class`, () => {
      test(`*+.adjacent-class`, parseCssSelector, [
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
    });
    it(`*~.proceeding-sibling-class`, () => {
      test(`*~.proceeding-sibling-class`, parseCssSelector, [
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
    });
    it(`*>.direct-child-class`, () => {
      test(`*>.direct-child-class`, parseCssSelector, [
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
    });
    it(`*++*`, () => {
      test(`*++*`, parseCssSelector, [
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
    });
    it(`* ++*`, () => {
      test(`* ++*`, parseCssSelector, [
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
              end: 3,
              before: ` `,
            }),
            createNode({
              type: `combinator`,
              combinator: `+`,
              value: `+`,
              start: 3,
              end: 4,
              invalid: true,
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
    });
    it(`*+*+*`, () => {
      test(`*+*+*`, parseCssSelector, [
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
    });
    it(`*   *`, () => {
      test(`*   *`, parseCssSelector, [
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
    });
    it(`* + *`, () => {
      test(`* + *`, parseCssSelector, [
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
    });
    it(`*+~> *`, () => {
      test(`*+~> *`, parseCssSelector, [
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
    });
    it(`* /*c1*/ + *`, () => {
      test(`* /*c1*/ + *`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 12,
          nodes: [
            createNode({
              type: `star`,
              value: `*`,
              start: 0,
              end: 1,
            }),
            createNode({
              type: `comment`,
              value: `/*c1*/`,
              start: 1,
              end: 9,
              before: ` `,
              after: ` `,
            }),
            createNode({
              type: `combinator`,
              combinator: `+`,
              value: `+`,
              start: 9,
              end: 11,
              after: ` `,
            }),
            createNode({
              type: `star`,
              value: `*`,
              start: 11,
              end: 12,
            }),
          ],
        }),
      ]);
    });
    it(` /*c1*/ + *`, () => {
      test(` /*c1*/ + *`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 11,
          before: ` `,
          nodes: [
            createNode({
              type: `comment`,
              value: `/*c1*/`,
              start: 1,
              end: 8,
              after: ` `,
            }),
            createNode({
              type: `combinator`,
              combinator: `+`,
              value: `+`,
              start: 8,
              end: 10,
              after: ` `,
            }),
            createNode({
              type: `star`,
              value: `*`,
              start: 10,
              end: 11,
            }),
          ],
        }),
      ]);
    });
  });
  describe(`invalid`, () => {
    it(`:pseudo(`, () => {
      test(`:pseudo(`, parseCssSelector, [
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
    });
    it(`::pseudo(`, () => {
      test(`::pseudo(`, parseCssSelector, [
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
    });
    it(`.ns|*`, () => {
      test(`.ns|*`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 5,
          nodes: [
            createNode({
              type: `class`,
              value: `ns`,
              start: 0,
              end: 3,
            }),
            createNode({
              type: `star`,
              value: `*`,
              start: 3,
              end: 5,
              namespace: {
                value: ``,
                beforeComments: [],
                afterComments: [],
                invalid: `namespace`,
              },
            }),
          ],
        }),
      ]);
    });
    it(`ns|`, () => {
      test(`ns|`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 3,
          nodes: [
            createNode({
              type: `element`,
              value: ``,
              start: 0,
              end: 3,
              namespace: {
                value: `ns`,
                beforeComments: [],
                afterComments: [],
                invalid: `target`,
              },
            }),
          ],
        }),
      ]);
    });
    it(`:x|`, () => {
      test(`:x|`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 3,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `x`,
              start: 0,
              end: 2,
            }),
            createNode({
              type: `element`,
              value: ``,
              start: 2,
              end: 3,
              namespace: {
                value: ``,
                beforeComments: [],
                afterComments: [],
                invalid: `namespace,target`,
              },
            }),
          ],
        }),
      ]);
    });
    it(`ns|||div`, () => {
      test(`ns|||div`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 8,
          nodes: [
            createNode({
              type: `element`,
              value: ``,
              start: 0,
              end: 3,
              namespace: {
                value: `ns`,
                beforeComments: [],
                afterComments: [],
                invalid: `target`,
              },
            }),
            createNode({
              type: `element`,
              value: ``,
              start: 3,
              end: 4,
              namespace: {
                value: ``,
                beforeComments: [],
                afterComments: [],
                invalid: `namespace,target`,
              },
            }),
            createNode({
              type: `element`,
              value: `div`,
              start: 4,
              end: 8,
              namespace: {
                value: ``,
                beforeComments: [],
                afterComments: [],
                invalid: `namespace`,
              },
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(-3x)`, () => {
      test(`:nth-child(-3x)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 15,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 15,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 14,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `-3x`,
                      start: 11,
                      end: 14,
                      invalid: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(-odd)`, () => {
      test(`:nth-child(-odd)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 16,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 16,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 15,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `-odd`,
                      start: 11,
                      end: 15,
                      invalid: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(+even)`, () => {
      test(`:nth-child(+even)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 17,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 17,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 16,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `+even`,
                      start: 11,
                      end: 16,
                      invalid: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(5n-3n)`, () => {
      test(`:nth-child(5n-3n)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 17,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 17,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 16,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `5n`,
                      start: 11,
                      end: 13,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `-3n`,
                      start: 13,
                      end: 16,
                      invalid: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(2n+3 off div)`, () => {
      test(`:nth-child(2n+3 off div)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 24,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 24,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 19,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `2n`,
                      start: 11,
                      end: 13,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `+3`,
                      start: 13,
                      end: 16,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_of`,
                      value: `off`,
                      start: 16,
                      end: 19,
                      invalid: true,
                    }),
                  ],
                }),
                createNode({
                  type: `selector`,
                  start: 19,
                  end: 23,
                  before: ` `,
                  nodes: [
                    createNode({
                      type: `element`,
                      value: `div`,
                      start: 20,
                      end: 23,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(- 5)`, () => {
      test(`:nth-child(- 5)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 15,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 15,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 14,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `-`,
                      start: 11,
                      end: 13,
                      after: ` `,
                      invalid: true,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `5`,
                      start: 13,
                      end: 14,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
    it(`:nth-child(5n - +3)`, () => {
      test(`:nth-child(5n - +3)`, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 19,
          nodes: [
            createNode({
              type: `pseudo_class`,
              value: `nth-child`,
              start: 0,
              end: 19,
              nodes: [
                createNode({
                  type: `nth`,
                  start: 11,
                  end: 18,
                  nodes: [
                    createNode({
                      type: `nth_step`,
                      value: `5n`,
                      start: 11,
                      end: 14,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_dash`,
                      value: `-`,
                      start: 14,
                      end: 16,
                      after: ` `,
                    }),
                    createNode({
                      type: `nth_offset`,
                      value: `+3`,
                      start: 16,
                      end: 18,
                      invalid: true,
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ]);
    });
  });
  describe(`spaces`, () => {
    it(`:p(  .a  ,   .b  )`, () => {
      test(`:p(  .a  ,   .b  )`, parseCssSelector, [
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
    });
    it(`::p(  .a  ,   .b  )`, () => {
      test(`::p(  .a  ,   .b  )`, parseCssSelector, [
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
    });
    it(`*    .a  + .b`, () => {
      test(`*    .a  + .b`, parseCssSelector, [
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
    });
    it(` /*c1*/ .a .b /*c2*/ `, () => {
      test(` /*c1*/ .a .b /*c2*/ `, parseCssSelector, [
        createNode({
          type: `selector`,
          start: 0,
          end: 21,
          before: ` `,
          nodes: [
            createNode({
              type: `comment`,
              value: `/*c1*/`,
              start: 1,
              end: 8,
              after: ` `,
            }),
            createNode({
              type: `class`,
              value: `a`,
              start: 8,
              end: 10,
            }),
            createNode({
              type: `combinator`,
              combinator: `space`,
              value: ` `,
              start: 10,
              end: 11,
            }),
            createNode({
              type: `class`,
              value: `b`,
              start: 11,
              end: 13,
            }),
            createNode({
              type: `comment`,
              value: `/*c2*/`,
              start: 13,
              end: 21,
              before: ` `,
              after: ` `,
            }),
          ],
        }),
      ]);
    });
  });
  describe(`combinations`, () => {
    it(`:a(.b,::d(.e,.f))`, () => {
      test(`:a(.b,::d(.e,.f))`, parseCssSelector, [
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
    });
    it(`* .a+.b`, () => {
      test(`* .a+.b`, parseCssSelector, [
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
    });
  });
});
