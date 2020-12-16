import { createMDNDataAST } from "../src/parsers/mdn-data-tokenizer";
import { expect } from "chai";
import { describe, it } from "mocha";
describe("mdn data ast", () => {
  const textAndRef = "solid <length>";
  it(`should parse "${textAndRef}"`, () => {
    const res = createMDNDataAST(textAndRef);
    expect(res).to.eql([
      {
        type: "text",
        text: "solid",
      },
      {
        type: "ref",

        target: "length",
        isPropertyRef: false,
      },
    ]);
  });

  const textRefMultipliers = 'gaga+ <"length">?';
  it(`should parse "${textRefMultipliers}"`, () => {
    const res = createMDNDataAST(textRefMultipliers);
    expect(res).to.eql([
      {
        type: "text",
        text: "gaga",
        multiplier: "+",
      },
      {
        type: "ref",
        target: "length",
        isPropertyRef: true,
        multiplier: "?",
      },
    ]);
  });
  const union = "a | b | c";
  it(`should parse "${union}"`, () => {
    const res = createMDNDataAST(union);
    expect(res).to.eql([
      {
        type: "union",
        children: [
          {
            type: "text",
            text: "a",
          },
          {
            type: "text",
            text: "b",
          },
          {
            type: "text",
            text: "c",
          },
        ],
      },
    ]);
  });
  const unordered = "a || b || c";
  it(`should parse "${unordered}"`, () => {
    const res = createMDNDataAST(unordered);
    expect(res).to.eql([
      {
        type: "unordered",
        allMandatory: false,
        children: [
          {
            type: "text",
            text: "a",
          },
          {
            type: "text",
            text: "b",
          },
          {
            type: "text",
            text: "c",
          },
        ],
      },
    ]);
  });
  const unorderedMandatory = "a && b && c";
  it(`should parse "${unorderedMandatory}"`, () => {
    const res = createMDNDataAST(unorderedMandatory);
    expect(res).to.eql([
      {
        type: "unordered",
        allMandatory: true,
        children: [
          {
            type: "text",
            text: "a",
          },
          {
            type: "text",
            text: "b",
          },
          {
            type: "text",
            text: "c",
          },
        ],
      },
    ]);
  });
});
const brackets = "start [ a | b ]# end";
it(`should parse "${brackets}"`, () => {
  const res = createMDNDataAST(brackets);
  expect(res).to.eql([
    {
      type: "text",
      text: "start",
    },
    {
      type: "brackets",
      multiplier: "#",
      children: [
        {
          type: "union",
          children: [
            {
              type: "text",
              text: "a",
            },
            {
              type: "text",
              text: "b",
            },
          ],
        },
      ],
    },
    {
      type: "text",
      text: "end",
    },
  ]);
});
