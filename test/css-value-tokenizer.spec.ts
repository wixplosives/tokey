import { test } from "../test-kit/testing";
import { createCssValueAST } from "../src/parsers/css-value-tokenizer";

test("10px 10px 10px", createCssValueAST, [
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
]);

test("10px var( myColor ) 10px", createCssValueAST, [
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
]);

test("10px var( var( myColor ) )", createCssValueAST, [
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
]);
test("var( a, b, c )", createCssValueAST, [
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
        type: "text",
        text: "b",
        start: 8,
        end: 9,
        before: [
          {
            type: ",",
            value: ",",
            start: 6,
            end: 7,
          },
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
        type: "text",
        text: "c",
        start: 11,
        end: 12,
        before: [
          {
            type: ",",
            value: ",",
            start: 9,
            end: 10,
          },
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
]);

test("var( a,/*a comment*/ b)", createCssValueAST, [
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
        type: "text",
        text: "b",
        start: 21,
        end: 22,
        before: [
          {
            type: ",",
            value: ",",
            start: 6,
            end: 7,
          },

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
]);
