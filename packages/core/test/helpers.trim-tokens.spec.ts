import { test } from "../test-kit/testing";
import { trimTokens } from "../src/helpers";
import type { Token } from "../src";

const trimSpace = (tokens: Token[]) =>
  trimTokens(tokens, (token) => token.type === "space");

function prettyPrint(items: Token[]) {
  (items as any).toJSON = function () {
    return items.map(({ type }) => type).join(" ");
  };
  return items;
}

test([], trimSpace, []);

test(
  prettyPrint([
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "text", value: "value" },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
  ]),
  trimSpace,
  [{ end: 0, start: 0, type: "text", value: "value" }]
);

test(
  prettyPrint([
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "text", value: "value" },
    { end: 0, start: 0, type: "space", value: " " },
  ]),
  trimSpace,
  [{ end: 0, start: 0, type: "text", value: "value" }]
);

test(
  prettyPrint([
    { end: 0, start: 0, type: "text", value: "value" },
    { end: 0, start: 0, type: "space", value: " " },
  ]),
  trimSpace,
  [{ end: 0, start: 0, type: "text", value: "value" }]
);

test(
  prettyPrint([
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "text", value: "value" },
  ]),
  trimSpace,
  [{ end: 0, start: 0, type: "text", value: "value" }]
);

test(
  prettyPrint([{ end: 0, start: 0, type: "text", value: "value" }]),
  trimSpace,
  [{ end: 0, start: 0, type: "text", value: "value" }]
);

test(
  prettyPrint([
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
  ]),
  trimSpace,
  []
);

test(
  prettyPrint([{ end: 0, start: 0, type: "space", value: " " }]),
  trimSpace,
  []
);

test(
  prettyPrint([
    { end: 0, start: 0, type: "text", value: "value" },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
  ]),
  trimSpace,
  [{ end: 0, start: 0, type: "text", value: "value" }]
);

test(
  prettyPrint([
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "space", value: " " },
    { end: 0, start: 0, type: "text", value: "value" },
  ]),
  trimSpace,
  [{ end: 0, start: 0, type: "text", value: "value" }]
);
