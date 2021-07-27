import { createParseTester } from "@tokey/test-kit";
import { createCssValueAST } from "@tokey/experiments";

const test = createParseTester({
  parse: createCssValueAST,
});
const testWithSingleLineComments = createParseTester({
  parse: (source: string) => createCssValueAST(source, true),
});

describe(`demos/css-value-parser`, () => {
  it(`red url(http://localhost/x.png)`, () => {
    test(`red url(http://localhost/x.png)`, {
      expectedAst: [
        {
          type: "text",
          text: "red",
          start: 0,
          end: 3,
          before: [],
          after: [],
        },
        {
          type: "call",
          text: "url(http://localhost/x.png)",
          start: 4,
          end: 31,
          before: [
            {
              value: " ",
              type: "space",
              start: 3,
              end: 4,
            },
          ],
          after: [],
          name: "url",
          args: [
            {
              type: "text",
              text: "http://localhost/x.png",
              start: 8,
              end: 30,
              before: [],
              after: [],
            },
          ],
        },
      ],
    });
  });
  it.skip(`red url(http://localhost/x.png)`, () => {
    testWithSingleLineComments(`red url(http://localhost/x.png)`, {
      expectedAst: [
        {
          type: "text",
          text: "red",
          start: 0,
          end: 3,
          before: [],
          after: [],
        },
        {
          type: "call",
          text: "url(http://localhost/x.png)",
          start: 4,
          end: 31,
          before: [
            {
              value: " ",
              type: "space",
              start: 3,
              end: 4,
            },
          ],
          after: [],
          name: "url",
          args: [
            {
              type: "text",
              text: "http://localhost/x.png",
              start: 8,
              end: 30,
              before: [],
              after: [],
            },
          ],
        },
      ],
    });
  });
  it(`10px 10px 10px`, () => {
    test("10px 10px 10px", {
      expectedAst: [
        { text: "10px", type: "text", start: 0, end: 4, before: [], after: [] },
        {
          text: "10px",
          type: "text",
          start: 5,
          end: 9,
          before: [
            {
              type: "space",
              value: " ",
              start: 4,
              end: 5,
            },
          ],
          after: [],
        },
        {
          text: "10px",
          type: "text",
          start: 10,
          end: 14,
          before: [
            {
              type: "space",
              value: " ",
              start: 9,
              end: 10,
            },
          ],
          after: [],
        },
      ],
    });
  });
  it(`10px var( myColor ) 10px`, () => {
    test("10px var( myColor ) 10px", {
      expectedAst: [
        { type: "text", text: "10px", start: 0, end: 4, before: [], after: [] },
        {
          type: "call",
          text: "var( myColor )",
          start: 5,
          end: 19,
          before: [
            {
              type: "space",
              value: " ",
              start: 4,
              end: 5,
            },
          ],
          after: [],
          name: "var",
          args: [
            {
              type: "text",
              text: "myColor",
              start: 10,
              end: 17,
              before: [
                {
                  type: "space",
                  value: " ",
                  start: 9,
                  end: 10,
                },
              ],
              after: [
                {
                  type: "space",
                  value: " ",
                  start: 17,
                  end: 18,
                },
              ],
            },
          ],
        },
        {
          type: "text",
          text: "10px",
          start: 20,
          end: 24,
          before: [
            {
              type: "space",
              value: " ",
              start: 19,
              end: 20,
            },
          ],
          after: [],
        },
      ],
    });
  });
  it(`10px var( var( myColor ) )`, () => {
    test("10px var( var( myColor ) )", {
      expectedAst: [
        { type: "text", text: "10px", start: 0, end: 4, before: [], after: [] },
        {
          type: "call",
          text: "var( var( myColor ) )",
          start: 5,
          end: 26,
          before: [
            {
              type: "space",
              value: " ",
              start: 4,
              end: 5,
            },
          ],
          after: [],
          name: "var",
          args: [
            {
              type: "call",
              text: "var( myColor )",
              start: 10,
              end: 24,
              before: [
                {
                  type: "space",
                  value: " ",
                  start: 9,
                  end: 10,
                },
              ],
              after: [
                {
                  type: "space",
                  value: " ",
                  start: 24,
                  end: 25,
                },
              ],
              name: "var",
              args: [
                {
                  type: "text",
                  text: "myColor",
                  start: 15,
                  end: 22,
                  before: [
                    {
                      type: "space",
                      value: " ",
                      start: 14,
                      end: 15,
                    },
                  ],
                  after: [
                    {
                      type: "space",
                      value: " ",
                      start: 22,
                      end: 23,
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
  });
  it(`var( a, b, c )`, () => {
    test("var( a, b, c )", {
      expectedAst: [
        {
          type: "call",
          text: "var( a, b, c )",
          start: 0,
          end: 14,
          before: [],
          name: "var",
          args: [
            {
              type: "text",
              text: "a",
              start: 5,
              end: 6,
              before: [
                {
                  type: "space",
                  value: " ",
                  start: 4,
                  end: 5,
                },
              ],
              after: [],
            },
            {
              type: ",",
              text: ",",
              start: 6,
              end: 7,
              after: [],
              before: [],
            },
            {
              type: "text",
              text: "b",
              start: 8,
              end: 9,
              before: [
                {
                  type: "space",
                  value: " ",
                  start: 7,
                  end: 8,
                },
              ],
              after: [],
            },
            {
              type: ",",
              text: ",",
              start: 9,
              end: 10,
              after: [],
              before: [],
            },
            {
              type: "text",
              text: "c",
              start: 11,
              end: 12,
              before: [
                {
                  type: "space",
                  value: " ",
                  start: 10,
                  end: 11,
                },
              ],
              after: [
                {
                  type: "space",
                  value: " ",
                  start: 12,
                  end: 13,
                },
              ],
            },
          ],
          after: [],
        },
      ],
    });
  });
  it(`var( a,/*a comment*/ b)`, () => {
    test("var( a,/*a comment*/ b)", {
      expectedAst: [
        {
          type: "call",
          text: "var( a,/*a comment*/ b)",
          start: 0,
          end: 23,
          before: [],
          name: "var",
          args: [
            {
              type: "text",
              text: "a",
              start: 5,
              end: 6,
              before: [
                {
                  type: "space",
                  value: " ",
                  start: 4,
                  end: 5,
                },
              ],
              after: [],
            },
            {
              type: ",",
              text: ",",
              start: 6,
              end: 7,
              after: [],
              before: [],
            },
            {
              type: "text",
              text: "b",
              start: 21,
              end: 22,
              before: [
                {
                  type: "multi-comment",
                  value: "/*a comment*/",
                  start: 7,
                  end: 20,
                },

                {
                  type: "space",
                  value: " ",
                  start: 20,
                  end: 21,
                },
              ],
              after: [],
            },
          ],
          after: [],
        },
      ],
    });
  });
});
