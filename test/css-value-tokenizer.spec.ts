import { test } from "../test-kit/testing";
import { createCssValueAST } from "../src/parsers/css-value-tokenizer";

test("10px 10px 10px", createCssValueAST, [
  { value: "10px", type: "text", start: 0, end: 4, beforeText: "" },
  { value: "10px", type: "text", start: 5, end: 9, beforeText: " " },
  { value: "10px", type: "text", start: 10, end: 14, beforeText: " " },
]);

test("10px var( myColor ) 10px", createCssValueAST, [
  { type: "text", value: "10px", start: 0, end: 4, beforeText: "" },
  {
    type: "call",
    value: "var( myColor )",
    start: 5,
    end: 19,
    beforeText: " ",
    name: "var",
    args: [
      {
        type: "text",
        value: "myColor",
        start: 10,
        end: 17,
        beforeText: " ",
        afterText: " ",
      },
    ],
  },
  { type: "text", value: "10px", start: 20, end: 24, beforeText: " " },
]);

test("10px var( var( myColor ) )", createCssValueAST, [
  { type: "text", value: "10px", start: 0, end: 4, beforeText: "" },
  {
    type: "call",
    value: "var( var( myColor ) )",
    start: 5,
    end: 26,
    beforeText: " ",
    name: "var",
    args: [
      {
        type: "call",
        value: "var( myColor )",
        start: 10,
        end: 24,
        beforeText: " ",
        afterText: " ",
        name: "var",
        args: [
          {
            type: "text",
            value: "myColor",
            start: 15,
            end: 22,
            beforeText: " ",
            afterText: " ",
          },
        ],
      },
    ],
  },
]);
