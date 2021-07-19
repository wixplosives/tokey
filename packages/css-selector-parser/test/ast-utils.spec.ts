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
    mapVisit: (
      node: SelectorNode,
      index: number,
      nodes: SelectorNode[],
      parents: SelectorNode[]
    ) => any;
    resultVisit?: (
      node: SelectorNode,
      index: number,
      nodes: SelectorNode[],
      parents: SelectorNode[]
    ) => number | undefined;
    expectedMap: any[];
  }
) {
  const actual: any[] = [];
  try {
    walk(
      topNode,
      (
        current: SelectorNode,
        index: number,
        nodes: SelectorNode[],
        parents: SelectorNode[]
      ) => {
        actual.push(
          mapVisit ? mapVisit(current, index, nodes, parents) : current
        );
        return resultVisit
          ? resultVisit(current, index, nodes, parents)
          : undefined;
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
          { type: `universal`, value: `*` },
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
          { type: `type`, value: `d` },
          { type: `selector`, value: undefined },
          { type: `type`, value: `x` },
          { type: `selector`, value: undefined },
          { type: `type`, value: `y` },
          { type: `combinator`, value: `+` },
          { type: `type`, value: `z` },
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
    describe(`context`, () => {
      it(`should provide index and sibling nodes within selector`, () => {
        testWalk(parseCssSelector(`:a(.a1.a2, .aX.aY), :b(.b1.b2)`), {
          mapVisit: ({ type, value }: any, index: number, nodes: any[]) => ({
            type,
            value,
            index,
            nodes: nodes.map(({ value, type }) => value || type).join(`,`),
          }),
          expectedMap: [
            {
              type: `selector`,
              value: undefined,
              index: 0,
              nodes: `selector,selector`,
            },
            { type: `pseudo_class`, value: `a`, index: 0, nodes: `a` },
            {
              type: `selector`,
              value: undefined,
              index: 0,
              nodes: `selector,selector`,
            },
            {
              type: `class`,
              value: `a1`,
              index: 0,
              nodes: `a1,a2`,
            },
            {
              type: `class`,
              value: `a2`,
              index: 1,
              nodes: `a1,a2`,
            },
            {
              type: `selector`,
              value: undefined,
              index: 1,
              nodes: `selector,selector`,
            },
            {
              type: `class`,
              value: `aX`,
              index: 0,
              nodes: `aX,aY`,
            },
            {
              type: `class`,
              value: `aY`,
              index: 1,
              nodes: `aX,aY`,
            },
            {
              type: `selector`,
              value: undefined,
              index: 1,
              nodes: `selector,selector`,
            },
            { type: `pseudo_class`, value: `b`, index: 0, nodes: `b` },
            { type: `selector`, value: undefined, index: 0, nodes: `selector` },
            {
              type: `class`,
              value: `b1`,
              index: 0,
              nodes: `b1,b2`,
            },
            {
              type: `class`,
              value: `b2`,
              index: 1,
              nodes: `b1,b2`,
            },
          ],
        });
      });
      it(`should provide index and sibling nodes within selector (skip nodes)`, () => {
        testWalk(parseCssSelector(`:a(.a1.a2, .aX.aY), :b(.b1.b2)`), {
          mapVisit: ({ type, value }: any, index: number, nodes: any[]) => ({
            type,
            value,
            index,
            nodes: nodes.map(({ value, type }) => value || type).join(`,`),
          }),
          resultVisit: ({ value }: any) => {
            if (value === `a1`) {
              return walk.skipCurrentSelector;
            } else if (value === `b`) {
              return walk.skipNested;
            }
            return;
          },
          expectedMap: [
            {
              type: `selector`,
              value: undefined,
              index: 0,
              nodes: `selector,selector`,
            },
            { type: `pseudo_class`, value: `a`, index: 0, nodes: `a` },
            {
              type: `selector`,
              value: undefined,
              index: 0,
              nodes: `selector,selector`,
            },
            {
              type: `class`,
              value: `a1`,
              index: 0,
              nodes: `a1,a2`,
            },
            {
              type: `selector`,
              value: undefined,
              index: 1,
              nodes: `selector,selector`,
            },
            {
              type: `class`,
              value: `aX`,
              index: 0,
              nodes: `aX,aY`,
            },
            {
              type: `class`,
              value: `aY`,
              index: 1,
              nodes: `aX,aY`,
            },
            {
              type: `selector`,
              value: undefined,
              index: 1,
              nodes: `selector,selector`,
            },
            { type: `pseudo_class`, value: `b`, index: 0, nodes: `b` },
          ],
        });
      });
      it(`should provide parent list to visit`, () => {
        testWalk(parseCssSelector(`:a(:b(:c))`), {
          mapVisit: (
            { type, value }: any,
            _index: number,
            _nodes: any[],
            parents: any[]
          ) => ({
            type,
            value,
            parents: parents.map(({ value, type }) => value || type).join(`,`),
          }),
          expectedMap: [
            { type: `selector`, value: undefined, parents: `` },
            { type: `pseudo_class`, value: `a`, parents: `selector` },
            { type: `selector`, value: undefined, parents: `selector,a` },
            {
              type: `pseudo_class`,
              value: `b`,
              parents: `selector,a,selector`,
            },
            {
              type: `selector`,
              value: undefined,
              parents: `selector,a,selector,b`,
            },
            {
              type: `pseudo_class`,
              value: `c`,
              parents: `selector,a,selector,b,selector`,
            },
          ],
        });
      });
      it(`should provide parent list to visit (test multi selectors)`, () => {
        testWalk(parseCssSelector(`:a(:a1(), :a2), :b(:b1)`), {
          walkOptions: {
            ignoreList: [`selector`],
          },
          mapVisit: (
            { type, value }: any,
            _index: number,
            _nodes: any[],
            parents: any[]
          ) => ({
            type,
            value,
            parents: parents.map(({ value, type }) => value || type).join(`,`),
          }),
          expectedMap: [
            { type: `pseudo_class`, value: `a`, parents: `selector` },
            {
              type: `pseudo_class`,
              value: `a1`,
              parents: `selector,a,selector`,
            },
            {
              type: `pseudo_class`,
              value: `a2`,
              parents: `selector,a,selector`,
            },
            { type: `pseudo_class`, value: `b`, parents: `selector` },
            {
              type: `pseudo_class`,
              value: `b1`,
              parents: `selector,b,selector`,
            },
          ],
        });
      });
    });
  });
});
