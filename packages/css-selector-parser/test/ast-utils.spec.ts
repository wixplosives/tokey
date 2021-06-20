import {
  parseCssSelector,
  walk,
  WalkOptions,
  SelectorNode,
  SelectorList,
} from "@tokey/css-selector-parser";
import { isMatch } from "@tokey/test-kit";

function testWalk(
  topNode: SelectorNode | SelectorList,
  {
    walkOptions,
    mapVisit,
    resultVisit,
    expectedMap,
  }: {
    walkOptions?: WalkOptions;
    mapVisit: (node: SelectorNode) => any;
    resultVisit?: (node: SelectorNode) => number | undefined;
    expectedMap: any[];
  }
) {
  const actual: any[] = [];
  try {
    walk(
      topNode,
      (current: SelectorNode) => {
        actual.push(mapVisit ? mapVisit(current) : current);
        return resultVisit ? resultVisit(current) : undefined;
      },
      walkOptions
    );
  } catch (e) {
    throw new Error(`error in walk, ${e}`);
  }
  if (!isMatch(actual, expectedMap)) {
    const e = JSON.stringify(expectedMap, null, 2);
    const a = JSON.stringify(actual, null, 2);
    throw new Error(`Fail walk: \n${a}\nTo\n${e}`);
  }
}

describe(`ast-utils`, () => {
  describe(`walk`, () => {
    it(`should visit nodes`, () => {
      testWalk(parseCssSelector(`.a#b`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `class`, value: `a` },
          { type: `id`, value: `b` },
        ],
      });
    });
    it(`should not visit specified types`, () => {
      testWalk(parseCssSelector(`.a#b.c`), {
        walkOptions: {
          ignoreList: ["selector", `id`],
        },
        mapVisit: ({ type, value }: any) => ({ type, value }),
        expectedMap: [
          { type: `class`, value: `a` },
          { type: `class`, value: `c` },
        ],
      });
    });
    it(`should visit only specified types`, () => {
      testWalk(parseCssSelector(`.a#b.c #d`), {
        walkOptions: {
          visitList: [`id`],
        },
        mapVisit: ({ type, value }: any) => ({ type, value }),
        expectedMap: [
          { type: `id`, value: `b` },
          { type: `id`, value: `d` },
        ],
      });
    });
    it(`should visit combinators`, () => {
      testWalk(parseCssSelector(`.a + .b`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `class`, value: `a` },
          { type: `combinator`, value: `+` },
          { type: `class`, value: `b` },
        ],
      });
    });
    it(`should visit all basic selector types`, () => {
      testWalk(parseCssSelector(`*.a + :b > ::c ~ #d[e] /*f*/`), {
        walkOptions: {
          ignoreList: [`selector`],
        },
        mapVisit: ({ type, value }: any) => ({ type, value }),
        expectedMap: [
          { type: `star`, value: `*` },
          { type: `class`, value: `a` },
          { type: `combinator`, value: `+` },
          { type: `pseudo_class`, value: `b` },
          { type: `combinator`, value: `>` },
          { type: `pseudo_element`, value: `c` },
          { type: `combinator`, value: `~` },
          { type: `id`, value: `d` },
          { type: `attribute`, value: `e` },
          { type: `comment`, value: `/*f*/` },
        ],
      });
    });
    it(`should visit nested`, () => {
      testWalk(parseCssSelector(`:a(::b(.c(d(x))), y) + z`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `a` },
          { type: `selector`, value: undefined },
          { type: `pseudo_element`, value: `b` },
          { type: `selector`, value: undefined },
          { type: `class`, value: `c` },
          { type: `selector`, value: undefined },
          { type: `element`, value: `d` },
          { type: `selector`, value: undefined },
          { type: `element`, value: `x` },
          { type: `selector`, value: undefined },
          { type: `element`, value: `y` },
          { type: `combinator`, value: `+` },
          { type: `element`, value: `z` },
        ],
      });
    });
    it(`should skip nested (return 0)`, () => {
      testWalk(parseCssSelector(`:is(:skip-nested(.a).b, .c).d, .e`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        resultVisit: ({ value }: any) =>
          value === `skip-nested` ? walk.skipNested : undefined,
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `is` },
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `skip-nested` },
          { type: `class`, value: `b` },
          { type: `selector`, value: undefined },
          { type: `class`, value: `c` },
          { type: `class`, value: `d` },
          { type: `selector`, value: undefined },
          { type: `class`, value: `e` },
        ],
      });
    });
    it(`should skip current selector`, () => {
      testWalk(parseCssSelector(`:is(:skip-selector(.a).b, .c).d, .e`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        resultVisit: ({ value }: any) =>
          value === `skip-selector` ? walk.skipCurrentSelector : undefined,
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `is` },
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `skip-selector` },
          { type: `selector`, value: undefined },
          { type: `class`, value: `c` },
          { type: `class`, value: `d` },
          { type: `selector`, value: undefined },
          { type: `class`, value: `e` },
        ],
      });
    });
    it(`should stop walk completely`, () => {
      testWalk(parseCssSelector(`:is(:stop(.a).b, .c).d, .e`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        resultVisit: ({ value }: any) =>
          value === `stop` ? walk.stopAll : undefined,
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `is` },
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `stop` },
        ],
      });
    });
    it(`should skip X levels down (2)`, () => {
      testWalk(parseCssSelector(`:is(:skip-2-levels(.a).b, .c).d, .e`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        resultVisit: ({ value }: any) =>
          value === `skip-2-levels` ? 2 : undefined,
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `is` },
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `skip-2-levels` },
          { type: `class`, value: `d` },
          { type: `selector`, value: undefined },
          { type: `class`, value: `e` },
        ],
      });
    });
    it(`should skip X levels down through selectors (3)`, () => {
      testWalk(parseCssSelector(`:is(:skip-3-levels(.a).b, .c).d, .e`), {
        mapVisit: ({ type, value }: any) => ({ type, value }),
        resultVisit: ({ value }: any) =>
          value === `skip-3-levels` ? 3 : undefined,
        expectedMap: [
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `is` },
          { type: `selector`, value: undefined },
          { type: `pseudo_class`, value: `skip-3-levels` },
          { type: `selector`, value: undefined },
          { type: `class`, value: `e` },
        ],
      });
    });
  });
});
