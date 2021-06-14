import { test } from "../test-kit/testing";
import { getListItems } from "toky/dist/parsers/separated-shallow-list";

const commaSeparated = (char: string): char is "," => char === ",";
const commaSeparatedList = (input: string) =>
  getListItems(input, commaSeparated);

describe(`demos/separated-shallow-list`, () => {
  it("a,b,c", () => {
    test("a,b,c", commaSeparatedList, [
      {
        type: "list-item",
        value: "a",
        start: 0,
        end: 1,
        tokens: [{ type: "text", value: "a", start: 0, end: 1 }],
      },
      {
        type: "list-item",
        value: "b",
        start: 2,
        end: 3,
        tokens: [{ type: "text", value: "b", start: 2, end: 3 }],
      },
      {
        type: "list-item",
        value: "c",
        start: 4,
        end: 5,
        tokens: [{ type: "text", value: "c", start: 4, end: 5 }],
      },
    ]);
  });

  it("a, b , /*comment*/c//comment", () => {
    test("a, b , /*comment*/c//comment", commaSeparatedList, [
      {
        type: "list-item",
        start: 0,
        end: 1,
        value: "a",
        tokens: [
          {
            value: "a",
            type: "text",
            start: 0,
            end: 1,
          },
        ],
      },
      {
        type: "list-item",
        start: 3,
        end: 4,
        value: "b",
        tokens: [
          {
            value: "b",
            type: "text",
            start: 3,
            end: 4,
          },
        ],
      },
      {
        type: "list-item",
        start: 18,
        end: 19,
        value: "c",
        tokens: [
          {
            value: "c",
            type: "text",
            start: 18,
            end: 19,
          },
        ],
      },
    ]);
  });

  it(`a 10, b "10px"`, () => {
    test('a 10, b "10px"', commaSeparatedList, [
      {
        type: "list-item",
        start: 0,
        end: 4,
        value: "a 10",
        tokens: [
          {
            value: "a",
            type: "text",
            start: 0,
            end: 1,
          },
          {
            value: " ",
            type: "space",
            start: 1,
            end: 2,
          },
          {
            value: "10",
            type: "text",
            start: 2,
            end: 4,
          },
        ],
      },
      {
        type: "list-item",
        start: 6,
        end: 14,
        value: 'b "10px"',
        tokens: [
          {
            value: "b",
            type: "text",
            start: 6,
            end: 7,
          },
          {
            value: " ",
            type: "space",
            start: 7,
            end: 8,
          },
          {
            value: '"10px"',
            type: "string",
            start: 8,
            end: 14,
          },
        ],
      },
    ]);
  });
});
